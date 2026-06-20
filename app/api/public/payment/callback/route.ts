import { NextResponse } from "next/server";
import {
  createTransaction,
  getActiveTransactionByDeviceId,
} from "@/lib/db/transactions";
import { createDeviceCommand } from "@/lib/db/device-commands";
import { getDeviceByPaymentCode } from "@/lib/db/devices";
import { getTenantById } from "@/lib/db/tenants";

interface SePayWebhookBody {
  id?: string | number;
  transferType?: string;
  transferAmount?: string | number;
  content?: string;
}

function normalizePaymentCode(content?: string): string {
  return (content || "").trim().toUpperCase();
}

function verifyWebhookByTenantSecret(headers: Headers, secret: string | null): boolean {
  if (!secret) return true;

  const headerToken =
    headers.get("x-sepay-token") ||
    headers.get("authorization") ||
    headers.get("Authorization");

  if (!headerToken) return false;

  return headerToken.includes(secret);
}

export async function GET() {
  return NextResponse.json(
    { error: "Phương thức GET không được hỗ trợ cho webhook QR tĩnh" },
    { status: 405 },
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SePayWebhookBody;

    const paymentCode = normalizePaymentCode(body.content);
    if (!paymentCode) {
      return NextResponse.json(
        { error: "Không tìm thấy payment_code trong nội dung chuyển khoản" },
        { status: 400 },
      );
    }

    const device = await getDeviceByPaymentCode(paymentCode);
    if (!device || !device.is_active) {
      return NextResponse.json(
        { error: "Không tìm thấy thiết bị theo payment_code" },
        { status: 404 },
      );
    }

    const tenant = await getTenantById(device.tenant_id);
    if (tenant && !tenant.allow_expired_access && tenant.subscription_status === "expired") {
      return NextResponse.json({ error: "Tenant đã hết hạn sử dụng" }, { status: 403 });
    }

    const webhookValid = verifyWebhookByTenantSecret(
      request.headers,
      tenant?.sepay_webhook_secret || null,
    );

    if (!webhookValid) {
      return NextResponse.json({ error: "Webhook token không hợp lệ" }, { status: 401 });
    }

    if (!device.price_per_minute || device.price_per_minute <= 0) {
      return NextResponse.json({ error: "Thiết bị chưa cấu hình giá/phút" }, { status: 400 });
    }

    const transferType = (body.transferType || "").toLowerCase();
    const transferAmount = Number(body.transferAmount || 0);

    if (transferType === "out" || transferAmount <= 0) {
      return NextResponse.json(
        { success: true, message: "Bỏ qua giao dịch không hợp lệ" },
        { status: 200 },
      );
    }

    const addedSeconds = Math.round((transferAmount / device.price_per_minute) * 60);

    if (addedSeconds <= 0) {
      return NextResponse.json(
        { error: "Số tiền không đủ để sử dụng thiết bị" },
        { status: 400 },
      );
    }

    const addedMinutes = Math.floor(transferAmount / device.price_per_minute);
    const activeTransaction = await getActiveTransactionByDeviceId(device.id);

    // Mỗi lần chuyển khoản luôn tạo transaction mới (hiển thị riêng trong danh sách)
    const transaction = await createTransaction({
      tenantId: device.tenant_id,
      deviceId: device.id,
      pricingPackageId: null,
      qrCode: `STATIC-${device.id}-${Date.now()}`,
      amount: transferAmount,
      durationMinutes: addedMinutes,
      status: "completed",
      paymentMethod: "sepay",
      paymentTransactionId: body.id ? String(body.id) : null,
      startedAt: new Date(),
    });

    // Nếu thiết bị đang chạy → add_time (cộng thêm), nếu chưa chạy → start
    const commandType = activeTransaction ? "add_time" : "start";
    const command = await createDeviceCommand({
      deviceId: device.id,
      commandType,
      commandData: {
        transactionId: transaction.id,
        durationMinutes: transaction.duration_minutes,
        seconds: addedSeconds,
        addedSeconds,
        addedMinutes,
        amount: transferAmount,
        paymentCode,
      },
    });

    // --- BACKGROUND TIMEOUT CHECK ---
    // Vì không có Web cho khách, hệ thống tự động kiểm tra sau 30 giây
    // Nếu ESP32 chưa lấy lệnh (vẫn pending), đánh dấu lỗi và lưu log hoàn tiền.
    setTimeout(async () => {
      try {
        const { getDeviceCommandById, completeDeviceCommand } = await import("@/lib/db/device-commands");
        const { updateTransactionStatus } = await import("@/lib/db/transactions");
        const { createDeviceLog } = await import("@/lib/db/device-logs");

        const latestCommand = await getDeviceCommandById(command.id);
        if (latestCommand && latestCommand.status === "pending") {
          // Timeout! ESP32 offline or didn't fetch in time
          await completeDeviceCommand(command.id, "failed", { error: "timeout_after_30s" });
          await updateTransactionStatus(transaction.id, "failed");
          
          await createDeviceLog({
            deviceId: device.id,
            logLevel: "error",
            message: `Thiết bị gặp sự cố kết nối khi thanh toán ${transferAmount}đ. Đã chuyển giao dịch sang trạng thái Cần hoàn tiền.`,
            metadata: {
              transactionId: transaction.id,
              paymentCode,
              reason: "timeout_after_payment"
            }
          });
          console.log(`[TIMEOUT] Transaction ${transaction.id} failed. Logged for refund.`);
        }
      } catch (err) {
        console.error("Error in background timeout check:", err);
      }
    }, 30000); // 30s timeout
    // --------------------------------

    return NextResponse.json(
      {
        success: true,
        message: activeTransaction
          ? "Đã tạo giao dịch mới và gửi lệnh add_time tới thiết bị"
          : "Đã tạo giao dịch và gửi lệnh start thiết bị",
        deviceId: device.device_id,
        paymentCode,
        addedMinutes,
        addedSeconds,
        transaction,
        command,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/public/payment/callback:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý callback" },
      { status: 500 },
    );
  }
}

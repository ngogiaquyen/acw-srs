import { NextResponse } from "next/server";
import {
  createTransaction,
  getActiveTransactionByDeviceId,
  updateTransaction,
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
        { message: "Bỏ qua giao dịch không hợp lệ" },
        { status: 200 },
      );
    }

    const addedMinutes = Math.floor(transferAmount / device.price_per_minute);

    if (addedMinutes <= 0) {
      return NextResponse.json(
        { error: "Số tiền không đủ để sử dụng thiết bị" },
        { status: 400 },
      );
    }

    const activeTransaction = await getActiveTransactionByDeviceId(device.id);

    if (activeTransaction) {
      const updatedTransaction = await updateTransaction(activeTransaction.id, {
        amount: Number(activeTransaction.amount) + transferAmount,
        durationMinutes: activeTransaction.duration_minutes + addedMinutes,
        paymentTransactionId: body.id ? String(body.id) : activeTransaction.payment_transaction_id,
      });

      return NextResponse.json(
        {
          message: "Đã cộng dồn tiền/phút vào transaction đang chạy",
          deviceId: device.device_id,
          paymentCode,
          addedMinutes,
          transaction: updatedTransaction,
        },
        { status: 200 },
      );
    }

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

    const command = await createDeviceCommand({
      deviceId: device.id,
      commandType: "start",
      commandData: {
        transactionId: transaction.id,
        durationMinutes: transaction.duration_minutes,
        addedMinutes,
        amount: transferAmount,
        paymentCode,
      },
    });

    return NextResponse.json(
      {
        message: "Đã ghi nhận thanh toán và tạo lệnh start thiết bị",
        deviceId: device.device_id,
        paymentCode,
        addedMinutes,
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

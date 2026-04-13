import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  createTransaction,
  getActiveTransactionByDeviceId,
} from "@/lib/db/transactions";
import { createDeviceCommand } from "@/lib/db/device-commands";
import { getDeviceByPaymentCode } from "@/lib/db/devices";

interface SimulatePaymentBody {
  content: string;
  transferAmount: number;
  transactionId?: string;
}

export async function POST(request: Request) {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SimulatePaymentBody;

    const paymentCode = (body.content || "").trim().toUpperCase();
    if (!paymentCode) {
      return NextResponse.json(
        { error: "payment_code không được để trống" },
        { status: 400 },
      );
    }

    const transferAmount = Number(body.transferAmount || 0);
    if (transferAmount <= 0) {
      return NextResponse.json(
        { error: "Số tiền phải lớn hơn 0" },
        { status: 400 },
      );
    }

    const device = await getDeviceByPaymentCode(paymentCode);
    if (!device || !device.is_active) {
      return NextResponse.json(
        { error: `Không tìm thấy thiết bị nào có payment_code "${paymentCode}"` },
        { status: 404 },
      );
    }

    if (!device.price_per_minute || device.price_per_minute <= 0) {
      return NextResponse.json(
        { error: "Thiết bị chưa cấu hình giá/phút" },
        { status: 400 },
      );
    }

    const addedMinutes = Math.floor(transferAmount / device.price_per_minute);
    if (addedMinutes <= 0) {
      return NextResponse.json(
        {
          error: `Số tiền ${transferAmount.toLocaleString("vi-VN")}đ không đủ để sử dụng thiết bị (giá ${device.price_per_minute.toLocaleString("vi-VN")}đ/phút)`,
        },
        { status: 400 },
      );
    }

    const activeTransaction = await getActiveTransactionByDeviceId(device.id);

    const simTxId = body.transactionId || `SIM-${Date.now()}`;

    const transaction = await createTransaction({
      tenantId: device.tenant_id,
      deviceId: device.id,
      pricingPackageId: null,
      qrCode: `SIM-${device.id}-${Date.now()}`,
      amount: transferAmount,
      durationMinutes: addedMinutes,
      status: "completed",
      paymentMethod: "simulate",
      paymentTransactionId: simTxId,
      startedAt: new Date(),
    });

    const commandType = activeTransaction ? "add_time" : "start";
    const command = await createDeviceCommand({
      deviceId: device.id,
      commandType,
      commandData: {
        transactionId: transaction.id,
        durationMinutes: transaction.duration_minutes,
        addedMinutes,
        amount: transferAmount,
        paymentCode,
      },
    });

    return NextResponse.json({
      success: true,
      message: activeTransaction
        ? `Đã cộng thêm ${addedMinutes} phút vào thiết bị đang chạy`
        : `Đã khởi động thiết bị với ${addedMinutes} phút`,
      device: { id: device.id, name: device.name, device_id: device.device_id },
      paymentCode,
      transferAmount,
      addedMinutes,
      commandType,
      transactionId: transaction.id,
      commandId: command.id,
    });
  } catch (error) {
    console.error("Error in POST /api/super-admin/simulate-payment:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý" },
      { status: 500 },
    );
  }
}

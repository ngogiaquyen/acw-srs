import { NextResponse } from "next/server";
import { getDeviceByDeviceId } from "@/lib/db/devices";
import {
  getActiveTransactionByDeviceId,
  getTransactionById,
  startTransaction,
} from "@/lib/db/transactions";

interface StartPayload {
  transactionId?: number;
}

interface Params {
  params: Promise<{
    deviceId: string;
  }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as StartPayload;
    const { deviceId } = await params;

    const device = await getDeviceByDeviceId(deviceId);

    if (!device || !device.is_active) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    if (device.status !== "online") {
      return NextResponse.json(
        { error: "Thiết bị không online" },
        { status: 400 },
      );
    }

    const active = await getActiveTransactionByDeviceId(device.id);
    if (active) {
      return NextResponse.json(
        { error: "Thiết bị đang có giao dịch hoạt động" },
        { status: 409 },
      );
    }

    if (!body.transactionId) {
      return NextResponse.json(
        { error: "transactionId là bắt buộc" },
        { status: 400 },
      );
    }

    const transaction = await getTransactionById(body.transactionId);

    if (!transaction || transaction.device_id !== device.id) {
      return NextResponse.json(
        { error: "Transaction không hợp lệ" },
        { status: 404 },
      );
    }

    if (transaction.status !== "completed") {
      return NextResponse.json(
        { error: "Transaction chưa thanh toán thành công" },
        { status: 400 },
      );
    }

    if (transaction.started_at) {
      return NextResponse.json(
        { error: "Transaction đã được bắt đầu trước đó" },
        { status: 409 },
      );
    }

    const started = await startTransaction(transaction.id);

    return NextResponse.json(
      { message: "Bắt đầu sử dụng thành công", transaction: started },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/public/device/[deviceId]/start:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi bắt đầu sử dụng" },
      { status: 500 },
    );
  }
}

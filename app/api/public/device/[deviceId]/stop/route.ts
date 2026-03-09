import { NextResponse } from "next/server";
import { getDeviceByDeviceId } from "@/lib/db/devices";
import {
  endTransaction,
  getActiveTransactionByDeviceId,
  getTransactionById,
} from "@/lib/db/transactions";

interface StopPayload {
  transactionId?: number;
}

interface Params {
  params: Promise<{
    deviceId: string;
  }>;
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = (await request.json()) as StopPayload;
    const { deviceId } = await params;

    const device = await getDeviceByDeviceId(deviceId);

    if (!device || !device.is_active) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    let transaction;

    if (body.transactionId) {
      transaction = await getTransactionById(body.transactionId);

      if (!transaction || transaction.device_id !== device.id) {
        return NextResponse.json(
          { error: "Transaction không hợp lệ" },
          { status: 404 },
        );
      }

      if (!transaction.started_at || transaction.ended_at) {
        return NextResponse.json(
          { error: "Transaction không ở trạng thái đang chạy" },
          { status: 400 },
        );
      }
    } else {
      transaction = await getActiveTransactionByDeviceId(device.id);

      if (!transaction) {
        return NextResponse.json(
          { error: "Không có transaction đang hoạt động" },
          { status: 404 },
        );
      }
    }

    const ended = await endTransaction(transaction.id);

    const usedMinutes = ended?.started_at && ended.ended_at
      ? Math.ceil(
          (new Date(ended.ended_at).getTime() - new Date(ended.started_at).getTime()) /
            60000,
        )
      : null;

    return NextResponse.json(
      {
        message: "Dừng sử dụng thành công",
        transaction: ended,
        usedMinutes,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/public/device/[deviceId]/stop:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi dừng sử dụng" },
      { status: 500 },
    );
  }
}

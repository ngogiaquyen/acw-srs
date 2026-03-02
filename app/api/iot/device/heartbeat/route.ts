import { NextResponse } from "next/server";
import { getDeviceByDeviceId, updateDeviceHeartbeat } from "@/lib/db/devices";

interface HeartbeatPayload {
  deviceId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HeartbeatPayload;

    if (!body.deviceId) {
      return NextResponse.json({ error: "deviceId là bắt buộc" }, { status: 400 });
    }

    const device = await getDeviceByDeviceId(body.deviceId);

    if (!device) {
      return NextResponse.json(
        { error: "Thiết bị chưa được đăng ký" },
        { status: 404 },
      );
    }

    const updated = await updateDeviceHeartbeat(body.deviceId);

    return NextResponse.json(
      { message: "Heartbeat thành công", device: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/iot/device/heartbeat:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi heartbeat" },
      { status: 500 },
    );
  }
}

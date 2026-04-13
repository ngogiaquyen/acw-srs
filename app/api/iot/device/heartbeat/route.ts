import { NextResponse } from "next/server";
import { getDeviceByDeviceId, updateDeviceHeartbeat } from "@/lib/db/devices";
import { setDeviceRemainingSeconds } from "@/lib/device-state";

interface HeartbeatPayload {
  deviceId?: string;
  remainingSeconds?: number;
  localIp?: string;
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

    const updated = await updateDeviceHeartbeat(body.deviceId, undefined, body.localIp ?? null);

    // Lưu remainingSeconds từ ESP32 vào in-memory store (không cần DB)
    if (typeof body.remainingSeconds === "number") {
      setDeviceRemainingSeconds(device.id, body.remainingSeconds);
    }

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

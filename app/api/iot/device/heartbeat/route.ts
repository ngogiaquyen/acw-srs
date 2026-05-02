import { NextResponse } from "next/server";
import { getDeviceByDeviceId, updateDeviceHeartbeat } from "@/lib/db/devices";
import { setDeviceRemainingSeconds, getDeviceRemainingSeconds } from "@/lib/device-state";
import { createDeviceCommand, getRecentCommandsByDeviceId } from "@/lib/db/device-commands";

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

    // 1. Kiểm tra bù giờ nếu thiết bị vừa reboot (báo 0 nhưng backend nghĩ là còn)
    if (body.remainingSeconds === 0) {
      const backendRemaining = getDeviceRemainingSeconds(device.id);
      
      // Nếu backend nghĩ còn trên 5 giây, ta ra lệnh chạy tiếp
      if (backendRemaining && backendRemaining > 5) {
        // Kiểm tra xem đã có lệnh start nào mới gửi gần đây chưa để tránh lặp
        const recent = await getRecentCommandsByDeviceId(device.id, 5);
        const alreadyResuming = recent.some(c => 
          c.command_type === "start" && 
          (c.status === "pending" || c.status === "sent")
        );

        if (!alreadyResuming) {
          console.log(`[Heartbeat] Device ${body.deviceId} rebooted. Auto-resuming ${backendRemaining}s`);
          await createDeviceCommand({
            deviceId: device.id,
            commandType: "start",
            commandData: { 
              duration: Math.floor(backendRemaining / 60) || 1, // backend dùng phút cho lệnh start, hoặc ta có thể hỗ trợ giây
              seconds: backendRemaining, // Gửi cả giây nếu ESP32 hỗ trợ
              isResume: true 
            }
          });
        }
      }
    }

    const updated = await updateDeviceHeartbeat(body.deviceId, undefined, body.localIp ?? null);

    // 2. Lưu remainingSeconds từ ESP32 vào in-memory store
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

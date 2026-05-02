import { NextResponse } from "next/server";
import {
  createDevice,
  getDeviceByDeviceId,
  updateDevice,
  updateDeviceHeartbeat,
} from "@/lib/db/devices";

interface RegisterPayload {
  deviceId?: string;
  tenantId?: number;
  name?: string;
  firmwareVersion?: string | null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterPayload;

    if (!body.deviceId || !body.name) {
      return NextResponse.json(
        { error: "deviceId và name là bắt buộc" },
        { status: 400 },
      );
    }

    const tenantId = body.tenantId ?? 1; // Default tenant ID

    const existed = await getDeviceByDeviceId(body.deviceId);

    if (existed) {
      await updateDevice(existed.id, {
        name: body.name,
        firmwareVersion: body.firmwareVersion ?? existed.firmware_version,
        isActive: true,
      });

      const updated = await updateDeviceHeartbeat(body.deviceId);

      return NextResponse.json(
        {
          message: "Thiết bị đã tồn tại, cập nhật thông tin và heartbeat thành công",
          device: updated,
        },
        { status: 200 },
      );
    }

    const device = await createDevice({
      tenantId: tenantId,
      deviceId: body.deviceId,
      name: body.name,
      firmwareVersion: body.firmwareVersion ?? null,
      lastHeartbeat: new Date(),
      isActive: true,
    });

    return NextResponse.json(
      { message: "Đăng ký thiết bị thành công", device },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/iot/device/register:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký thiết bị" },
      { status: 500 },
    );
  }
}

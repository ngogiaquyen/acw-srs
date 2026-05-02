import { NextResponse } from "next/server";
import {
  completeDeviceCommand,
  getDeviceCommandById,
} from "@/lib/db/device-commands";
import { getDeviceByDeviceId } from "@/lib/db/devices";

interface Params {
  params: Promise<{
    deviceId: string;
  }>;
}

interface CommandResponsePayload {
  commandId?: number;
  status?: "executed" | "failed";
  responseData?: unknown;
}

export async function POST(request: Request, { params }: Params) {
  const { deviceId: deviceIdParam } = await params;

  if (!deviceIdParam) {
    return NextResponse.json({ error: "deviceId không hợp lệ" }, { status: 400 });
  }

  const device = await getDeviceByDeviceId(deviceIdParam);

  if (!device || !device.is_active) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as CommandResponsePayload;

    if (!body.commandId || !body.status) {
      return NextResponse.json(
        { error: "commandId và status là bắt buộc" },
        { status: 400 },
      );
    }

    if (body.status !== "executed" && body.status !== "failed") {
      return NextResponse.json({ error: "status không hợp lệ" }, { status: 400 });
    }

    const command = await getDeviceCommandById(body.commandId);

    if (!command || command.device_id !== device.id) {
      return NextResponse.json({ error: "Command không tồn tại" }, { status: 404 });
    }

    const updated = await completeDeviceCommand(
      command.id,
      body.status,
      body.responseData,
    );

    return NextResponse.json({ command: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in POST /api/iot/device/[deviceId]/response:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật phản hồi lệnh" },
      { status: 500 },
    );
  }
}

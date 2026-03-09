import { NextResponse } from "next/server";
import { createDeviceLog, type DeviceLogLevel } from "@/lib/db/device-logs";
import { getDeviceById } from "@/lib/db/devices";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

interface DeviceLogPayload {
  logLevel?: DeviceLogLevel;
  message?: string;
  metadata?: unknown;
}

const ALLOWED_LOG_LEVELS: DeviceLogLevel[] = ["info", "warning", "error"];

export async function POST(request: Request, { params }: Params) {
  const { id: idParam } = await params;
  const deviceId = Number.parseInt(idParam, 10);

  if (Number.isNaN(deviceId)) {
    return NextResponse.json({ error: "ID thiết bị không hợp lệ" }, { status: 400 });
  }

  const device = await getDeviceById(deviceId);
  if (!device || !device.is_active) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  try {
    const body = (await request.json()) as DeviceLogPayload;

    if (!body.message || body.message.trim().length === 0) {
      return NextResponse.json({ error: "message là bắt buộc" }, { status: 400 });
    }

    if (body.logLevel && !ALLOWED_LOG_LEVELS.includes(body.logLevel)) {
      return NextResponse.json({ error: "logLevel không hợp lệ" }, { status: 400 });
    }

    const log = await createDeviceLog({
      deviceId,
      logLevel: body.logLevel ?? "info",
      message: body.message,
      metadata: body.metadata ?? null,
    });

    return NextResponse.json({ log }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/iot/device/[id]/logs:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi gửi log từ thiết bị" },
      { status: 500 },
    );
  }
}

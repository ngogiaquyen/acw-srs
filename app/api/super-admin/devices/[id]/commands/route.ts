import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceById } from "@/lib/db/devices";
import {
  createDeviceCommand,
  getRecentCommandsByDeviceId,
  type DeviceCommandType,
} from "@/lib/db/device-commands";

interface Params {
  params: Promise<{ id: string }>;
}

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: idParam } = await params;
  const deviceId = Number.parseInt(idParam, 10);
  if (Number.isNaN(deviceId))
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const device = await getDeviceById(deviceId);
  if (!device)
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });

  const commands = await getRecentCommandsByDeviceId(deviceId, 20);
  return NextResponse.json({ commands }, { status: 200 });
}

const ALLOWED_TYPES: DeviceCommandType[] = [
  "start",
  "stop",
  "add_time",
  "restart",
  "update_firmware",
  "config",
];

export async function POST(request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id: idParam } = await params;
  const deviceId = Number.parseInt(idParam, 10);
  if (Number.isNaN(deviceId))
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const device = await getDeviceById(deviceId);
  if (!device)
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });

  try {
    const body = (await request.json()) as {
      commandType?: string;
      commandData?: unknown;
    };

    if (!body.commandType || !ALLOWED_TYPES.includes(body.commandType as DeviceCommandType)) {
      return NextResponse.json(
        { error: "commandType không hợp lệ", allowed: ALLOWED_TYPES },
        { status: 400 },
      );
    }

    const command = await createDeviceCommand({
      deviceId,
      commandType: body.commandType as DeviceCommandType,
      commandData: body.commandData ?? null,
    });

    return NextResponse.json({ command }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/super-admin/devices/[id]/commands:", error);
    return NextResponse.json({ error: "Lỗi khi tạo lệnh" }, { status: 500 });
  }
}

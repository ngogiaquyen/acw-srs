import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  createDeviceCommand,
  type DeviceCommandType,
} from "@/lib/db/device-commands";
import { getDeviceById, getDeviceByIdAndTenantId } from "@/lib/db/devices";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) return null;
  return auth.user;
}

interface Params {
  params: {
    id: string;
  };
}

interface CommandPayload {
  commandType?: DeviceCommandType;
  commandData?: unknown;
}

const ALLOWED_COMMAND_TYPES: DeviceCommandType[] = [
  "start",
  "stop",
  "restart",
  "update_firmware",
  "config",
];

export async function POST(request: Request, { params }: Params) {
  const user = await ensureAuthenticated();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as CommandPayload;

    if (!body.commandType || !ALLOWED_COMMAND_TYPES.includes(body.commandType)) {
      return NextResponse.json(
        { error: "commandType không hợp lệ" },
        { status: 400 },
      );
    }

    let device;

    if (user.role === "TENANT_ADMIN") {
      if (!user.tenantId) {
        return NextResponse.json(
          { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
          { status: 400 },
        );
      }

      device = await getDeviceByIdAndTenantId(id, user.tenantId);
    } else if (user.role === "SUPER_ADMIN") {
      device = await getDeviceById(id);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!device) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    const command = await createDeviceCommand({
      deviceId: device.id,
      commandType: body.commandType,
      commandData: body.commandData ?? null,
    });

    return NextResponse.json({ command }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tenant/devices/[id]/command:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo lệnh cho thiết bị" },
      { status: 500 },
    );
  }
}

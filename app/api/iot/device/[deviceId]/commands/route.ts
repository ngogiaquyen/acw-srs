import { NextResponse } from "next/server";
import {
  getPendingCommandsByDeviceId,
  markCommandsAsSent,
} from "@/lib/db/device-commands";
import { getDeviceByDeviceId } from "@/lib/db/devices";

interface Params {
  params: Promise<{
    deviceId: string;
  }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { deviceId: deviceIdParam } = await params;

  if (!deviceIdParam) {
    return NextResponse.json({ error: "deviceId không hợp lệ" }, { status: 400 });
  }

  const device = await getDeviceByDeviceId(deviceIdParam);

  if (!device || !device.is_active) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  const commands = await getPendingCommandsByDeviceId(device.id, 20);

  await markCommandsAsSent(commands.map((command) => command.id));

  return NextResponse.json(
    {
      commands,
      count: commands.length,
    },
    { status: 200 },
  );
}

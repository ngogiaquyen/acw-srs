import { NextResponse } from "next/server";
import {
  getPendingCommandsByDeviceId,
  markCommandsAsSent,
} from "@/lib/db/device-commands";
import { getDeviceById } from "@/lib/db/devices";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const deviceId = Number.parseInt(params.id, 10);

  if (Number.isNaN(deviceId)) {
    return NextResponse.json({ error: "ID thiết bị không hợp lệ" }, { status: 400 });
  }

  const device = await getDeviceById(deviceId);

  if (!device || !device.is_active) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  const commands = await getPendingCommandsByDeviceId(deviceId, 20);

  await markCommandsAsSent(commands.map((command) => command.id));

  return NextResponse.json(
    {
      commands,
      count: commands.length,
    },
    { status: 200 },
  );
}

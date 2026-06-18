import { NextResponse } from "next/server";
import {
  getPendingCommandsByDeviceId,
  markCommandsAsSent,
} from "@/lib/db/device-commands";
import { getDeviceByDeviceId, updateDeviceHeartbeat } from "@/lib/db/devices";

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
    return NextResponse.json(
      { error: "Thiết bị không tồn tại", clearCredentials: true },
      { status: 404 },
    );
  }

  if (!device.tenant_id) {
    return NextResponse.json(
      { error: "Chủ trạm không tồn tại", clearCredentials: true, commands: [], count: 0 },
      { status: 200 },
    );
  }

  // Cập nhật heartbeat mỗi khi mạch gọi lệnh (mặc định 5s/lần)
  // để mạch báo Online nhanh chóng.
  await updateDeviceHeartbeat(deviceIdParam);

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

import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { createDeviceLog, getDeviceLogsByDeviceId } from "@/lib/db/device-logs";
import {
  getDeviceById,
  getDeviceByIdAndTenantId,
  updateDeviceStatus,
} from "@/lib/db/devices";
import {
  getActiveTransactionByDeviceId,
  computeRemainingSeconds,
} from "@/lib/db/transactions";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) return null;
  return auth.user;
}

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
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

  const now = Date.now();
  const heartbeatTime = device.last_heartbeat
    ? new Date(device.last_heartbeat).getTime()
    : null;

  const offlineThresholdMs = 5 * 60 * 1000;

  const isOfflineOver5m =
    heartbeatTime === null || now - heartbeatTime > offlineThresholdMs;

  let alertCreated = false;

  if (isOfflineOver5m && device.status !== "offline") {
    await updateDeviceStatus(device.device_id, "offline");

    await createDeviceLog({
      deviceId: device.id,
      logLevel: "warning",
      message: "ALERT: Device offline quá 5 phút",
      metadata: {
        alertType: "device_offline",
        offlineThresholdMinutes: 5,
        lastHeartbeat: device.last_heartbeat,
      },
    });

    alertCreated = true;

    device = await getDeviceById(device.id);
  }

  if (!device) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  const logs = await getDeviceLogsByDeviceId(device.id, 50);

  const activeTransaction = await getActiveTransactionByDeviceId(device.id);
  const remainingSeconds = activeTransaction
    ? computeRemainingSeconds(activeTransaction)
    : null;

  return NextResponse.json(
    {
      device,
      monitoring: {
        isOfflineOver5m,
        offlineThresholdMinutes: 5,
        alertCreated,
      },
      logs,
      remainingSeconds,
    },
    { status: 200 },
  );
}

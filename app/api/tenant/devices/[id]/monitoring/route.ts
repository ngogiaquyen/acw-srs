import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { createDeviceLog, getDeviceLogsByDeviceId } from "@/lib/db/device-logs";
import { getDeviceById, getDeviceByIdAndTenantId } from "@/lib/db/devices";
import { getDeviceRemainingSeconds } from "@/lib/device-state";

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
  let shouldCreateAlert = true;

  if (isOfflineOver5m) {
    const latestLogs = await getDeviceLogsByDeviceId(device.id, 1);
    if (latestLogs.length > 0) {
      shouldCreateAlert = latestLogs[0].message !== "ALERT: Device offline quá 5 phút";
    }

    if (shouldCreateAlert) {
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
    }
  }

  const logs = await getDeviceLogsByDeviceId(device.id, 50);

  const remainingSeconds = getDeviceRemainingSeconds(device.id);

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

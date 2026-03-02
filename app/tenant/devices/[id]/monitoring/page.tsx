import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";
import { getDeviceLogsByDeviceId } from "@/lib/db/device-logs";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantDeviceMonitoringPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const device = await getDeviceByIdAndTenantId(id, auth.user.tenantId);
  if (!device) {
    notFound();
  }

  const logs = await getDeviceLogsByDeviceId(device.id, 50);

  const now = Date.now();
  const heartbeatTime = device.last_heartbeat
    ? new Date(device.last_heartbeat).getTime()
    : null;
  const offlineThresholdMs = 5 * 60 * 1000;
  const isOfflineOver5m =
    heartbeatTime === null || now - heartbeatTime > offlineThresholdMs;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Monitoring thiết bị</h2>
        <p className="text-sm text-muted-foreground">Theo dõi trạng thái và logs thiết bị.</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={device.status === "online" ? "default" : "outline"}>
            {device.status}
          </Badge>
          <Badge variant={isOfflineOver5m ? "destructive" : "secondary"}>
            {isOfflineOver5m ? "Offline > 5 phút" : "Ổn định"}
          </Badge>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Last heartbeat: {device.last_heartbeat ? new Date(device.last_heartbeat).toLocaleString("vi-VN") : "-"}
        </p>
      </Card>

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-medium">Logs gần nhất</h3>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleString("vi-VN")} • {log.log_level}
              </p>
              <p className="mt-1 text-sm">{log.message}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có logs.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

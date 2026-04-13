import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DeviceOtaPanel } from "@/components/super-admin/DeviceOtaPanel";
import { getDeviceById } from "@/lib/db/devices";
import { getRecentCommandsByDeviceId } from "@/lib/db/device-commands";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";

interface Props {
  params: Promise<{ id: string; deviceId: string }>;
}

export default async function SuperAdminDeviceDetailPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") notFound();

  const { id: tenantIdParam, deviceId: deviceIdParam } = await params;
  const deviceId = Number.parseInt(deviceIdParam, 10);
  if (Number.isNaN(deviceId)) notFound();

  const [device, commands] = await Promise.all([
    getDeviceById(deviceId),
    getRecentCommandsByDeviceId(deviceId, 20),
  ]);

  if (!device) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 text-sm text-muted-foreground">
            <Link href={`/super-admin/tenants/${tenantIdParam}`} className="hover:underline">
              ← Quay lại tenant
            </Link>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết thiết bị</h2>
          <p className="text-sm text-muted-foreground">Thiết bị #{device.id} — {device.device_id}</p>
        </div>
      </div>

      {/* Basic info */}
      <Card className="p-6">
        <dl className="grid gap-4 md:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Device ID</dt>
            <dd className="font-medium font-mono">{device.device_id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Tên</dt>
            <dd className="font-medium">{device.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Firmware</dt>
            <dd className="font-medium">{device.firmware_version ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Giá/phút</dt>
            <dd className="font-medium">
              {device.price_per_minute
                ? `${Number(device.price_per_minute).toLocaleString("vi-VN")} VNĐ`
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Heartbeat gần nhất</dt>
            <dd className="font-medium">
              {device.last_heartbeat
                ? new Date(device.last_heartbeat).toLocaleString("vi-VN")
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Mã thanh toán</dt>
            <dd className="font-medium font-mono">{device.payment_code ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Kích hoạt</dt>
            <dd>
              <Badge variant={device.is_active ? "default" : "outline"}>
                {device.is_active ? "Hoạt động" : "Vô hiệu hóa"}
              </Badge>
            </dd>
          </div>
        </dl>
      </Card>

      {/* OTA + credentials + command history */}
      <DeviceOtaPanel
        deviceId={device.id}
        webUsername={device.web_username}
        webPassword={device.web_password}
        lastIp={device.last_ip}
        recentCommands={commands.map((c) => ({
          ...c,
          created_at: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
          executed_at: c.executed_at instanceof Date ? c.executed_at.toISOString() : c.executed_at ? String(c.executed_at) : null,
        }))}
      />
    </div>
  );
}

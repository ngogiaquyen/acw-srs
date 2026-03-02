import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantDeviceDetailPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) notFound();

  const device = await getDeviceByIdAndTenantId(id, auth.user.tenantId);
  if (!device) notFound();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết thiết bị</h2>
          <p className="text-sm text-muted-foreground">Thiết bị #{device.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/tenant/devices/${device.id}/monitoring`}>Monitoring</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/tenant/devices/${device.id}/edit`}>Chỉnh sửa</Link>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Device ID</dt>
            <dd className="font-medium">{device.device_id}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Tên thiết bị</dt>
            <dd className="font-medium">{device.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Trạng thái</dt>
            <dd>
              <Badge variant={device.status === "online" ? "default" : "outline"}>
                {device.status}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Firmware</dt>
            <dd className="font-medium">{device.firmware_version ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Station ID</dt>
            <dd className="font-medium">{device.station_id ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Kích hoạt</dt>
            <dd>
              <Badge variant={device.is_active ? "default" : "outline"}>
                {device.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
              </Badge>
            </dd>
          </div>
          <div className="md:col-span-2">
            <dt className="text-xs text-muted-foreground">Heartbeat gần nhất</dt>
            <dd className="font-medium">
              {device.last_heartbeat ? new Date(device.last_heartbeat).toLocaleString("vi-VN") : "-"}
            </dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

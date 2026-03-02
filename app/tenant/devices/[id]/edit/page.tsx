import { notFound } from "next/navigation";
import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";
import { getStationsByTenantId } from "@/lib/db/stations";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantEditDevicePage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) notFound();

  const [device, stations] = await Promise.all([
    getDeviceByIdAndTenantId(id, auth.user.tenantId),
    getStationsByTenantId(auth.user.tenantId),
  ]);

  if (!device) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa thiết bị</h2>
        <p className="text-sm text-muted-foreground">Cập nhật thiết bị #{device.id}.</p>
      </div>

      <DeviceForm
        mode="edit"
        deviceIdParam={String(device.id)}
        stations={stations.map((s) => ({ id: s.id, name: s.name }))}
        initialData={{
          deviceId: device.device_id,
          name: device.name,
          stationId: device.station_id ? String(device.station_id) : "",
          status: device.status,
          firmwareVersion: device.firmware_version ?? "",
          isActive: Boolean(device.is_active),
        }}
      />
    </div>
  );
}

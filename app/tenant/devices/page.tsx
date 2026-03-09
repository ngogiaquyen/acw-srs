import { DeviceList } from "@/components/tenant/DeviceList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDevicesByTenantId } from "@/lib/db/devices";
import { getDeviceRemainingSecondsMap } from "@/lib/device-state";

export default async function TenantDevicesPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const rawDevices = tenantId ? await getDevicesByTenantId(tenantId) : [];

  const remainingMap = getDeviceRemainingSecondsMap(rawDevices.map((d) => d.id));

  const devices = rawDevices.map((d) => ({
    ...d,
    remainingSeconds: remainingMap.get(d.id) ?? null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý thiết bị</h2>
        <p className="text-sm text-muted-foreground">
          Danh sách thiết bị ESP32 của tenant.
        </p>
      </div>

      <DeviceList devices={devices} />
    </div>
  );
}

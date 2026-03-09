import { DeviceList } from "@/components/tenant/DeviceList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDevicesByTenantId } from "@/lib/db/devices";
import {
  getActiveTransactionsByDeviceIds,
  computeRemainingSeconds,
} from "@/lib/db/transactions";

export default async function TenantDevicesPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const rawDevices = tenantId ? await getDevicesByTenantId(tenantId) : [];

  const activeTxMap = await getActiveTransactionsByDeviceIds(
    rawDevices.map((d) => d.id),
  );

  const devices = rawDevices.map((d) => {
    const tx = activeTxMap.get(d.id);
    return {
      ...d,
      remainingSeconds: tx ? computeRemainingSeconds(tx) : null,
    };
  });

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

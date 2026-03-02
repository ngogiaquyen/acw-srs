import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getStationsByTenantId } from "@/lib/db/stations";

export default async function TenantNewDevicePage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;
  const stations = tenantId ? await getStationsByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Đăng ký thiết bị</h2>
        <p className="text-sm text-muted-foreground">
          Thêm thiết bị ESP32 mới và liên kết với trạm.
        </p>
      </div>

      <DeviceForm
        mode="create"
        stations={stations.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}

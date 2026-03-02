import { StationList } from "@/components/tenant/StationList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getStationsByTenantId } from "@/lib/db/stations";

export default async function TenantStationsPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const stations = tenantId ? await getStationsByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý trạm</h2>
        <p className="text-sm text-muted-foreground">
          Danh sách trạm rửa xe thuộc tenant của bạn.
        </p>
      </div>

      <StationList stations={stations} />
    </div>
  );
}

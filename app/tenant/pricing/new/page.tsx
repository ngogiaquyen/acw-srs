import { PricingForm } from "@/components/tenant/PricingForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getStationsByTenantId } from "@/lib/db/stations";

export default async function TenantNewPricingPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;
  const stations = tenantId ? await getStationsByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tạo gói giá mới</h2>
        <p className="text-sm text-muted-foreground">
          Cấu hình giá tiền và thời gian sử dụng.
        </p>
      </div>

      <PricingForm
        mode="create"
        stations={stations.map((s) => ({ id: s.id, name: s.name }))}
      />
    </div>
  );
}

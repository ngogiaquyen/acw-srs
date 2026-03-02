import { PricingList } from "@/components/tenant/PricingList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getPricingPackagesByTenantId } from "@/lib/db/pricing";

export default async function TenantPricingPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const pricingPackages = tenantId
    ? await getPricingPackagesByTenantId(tenantId)
    : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý gói giá</h2>
        <p className="text-sm text-muted-foreground">
          Tạo và quản lý các gói giá cho tenant của bạn.
        </p>
      </div>

      <PricingList pricingPackages={pricingPackages} />
    </div>
  );
}

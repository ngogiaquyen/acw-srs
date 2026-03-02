import { notFound } from "next/navigation";
import { PricingForm } from "@/components/tenant/PricingForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getPricingPackageByIdAndTenantId } from "@/lib/db/pricing";
import { getStationsByTenantId } from "@/lib/db/stations";

interface Props {
  params: { id: string };
}

export default async function TenantEditPricingPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const [pricing, stations] = await Promise.all([
    getPricingPackageByIdAndTenantId(id, auth.user.tenantId),
    getStationsByTenantId(auth.user.tenantId),
  ]);

  if (!pricing) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa gói giá</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin gói giá #{pricing.id}.
        </p>
      </div>

      <PricingForm
        mode="edit"
        pricingId={String(pricing.id)}
        stations={stations.map((s) => ({ id: s.id, name: s.name }))}
        initialData={{
          name: pricing.name,
          stationId: pricing.station_id ? String(pricing.station_id) : "",
          price: String(pricing.price),
          durationMinutes: String(pricing.duration_minutes),
          isActive: Boolean(pricing.is_active),
        }}
      />
    </div>
  );
}

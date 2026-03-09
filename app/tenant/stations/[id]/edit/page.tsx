import { notFound } from "next/navigation";
import { StationForm } from "@/components/tenant/StationForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getStationByIdAndTenantId } from "@/lib/db/stations";

interface Props {
  params: { id: string };
}

export default async function TenantEditStationPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) notFound();

  const station = await getStationByIdAndTenantId(id, auth.user.tenantId);
  if (!station) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa trạm</h2>
        <p className="text-sm text-muted-foreground">Cập nhật thông tin trạm #{station.id}.</p>
      </div>

      <StationForm
        mode="edit"
        stationId={String(station.id)}
        initialData={{
          name: station.name,
          address: station.address ?? "",
          latitude: station.latitude !== null ? String(station.latitude) : "",
          longitude: station.longitude !== null ? String(station.longitude) : "",
          isActive: Boolean(station.is_active),
        }}
      />
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getStationByIdAndTenantId } from "@/lib/db/stations";

interface Props {
  params: { id: string };
}

export default async function TenantStationDetailPage({ params }: Props) {
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết trạm</h2>
          <p className="text-sm text-muted-foreground">Trạm #{station.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href={`/tenant/stations/${station.id}/edit`}>Chỉnh sửa</Link>
        </Button>
      </div>

      <Card className="p-6">
        <dl className="grid gap-4 md:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Tên trạm</dt>
            <dd className="font-medium">{station.name}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Địa chỉ</dt>
            <dd className="font-medium">{station.address ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Trạng thái</dt>
            <dd>
              <Badge variant={station.is_active ? "default" : "outline"}>
                {station.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Latitude</dt>
            <dd className="font-medium">{station.latitude ?? "-"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Longitude</dt>
            <dd className="font-medium">{station.longitude ?? "-"}</dd>
          </div>
        </dl>
      </Card>
    </div>
  );
}

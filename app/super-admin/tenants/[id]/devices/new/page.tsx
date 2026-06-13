import { notFound } from "next/navigation";
import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SuperAdminNewDevicePage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    notFound();
  }

  const { id: tenantIdParam } = await params;
  const tenantId = Number.parseInt(tenantIdParam, 10);
  if (Number.isNaN(tenantId)) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Thêm thiết bị mới cho người thuê</h2>
        <p className="text-sm text-muted-foreground">Nhập thông tin thiết bị để thêm mới vào hệ thống cho người thuê này.</p>
      </div>

      <DeviceForm mode="create" tenantId={tenantId} />
    </div>
  );
}

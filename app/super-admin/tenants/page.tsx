import { TenantList } from "@/components/super-admin/TenantList";
import { getTenants } from "@/lib/db/tenants";

export default async function SuperAdminTenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý chủ trạm</h2>
        <p className="text-sm text-muted-foreground">
          Danh sách chủ trạm toàn hệ thống. Bạn có thể tạo mới, chỉnh sửa hoặc vô hiệu hóa chủ trạm.
        </p>

      <TenantList tenants={tenants} />
    </div>
  );
}

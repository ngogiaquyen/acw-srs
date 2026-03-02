import { TenantList } from "@/components/super-admin/TenantList";
import { getTenants } from "@/lib/db/tenants";

export default async function SuperAdminTenantsPage() {
  const tenants = await getTenants();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý tenants</h2>
        <p className="text-sm text-muted-foreground">
          Danh sách tenant toàn hệ thống. Bạn có thể tạo mới, chỉnh sửa hoặc vô hiệu hóa tenant.
        </p>
      </div>

      <TenantList tenants={tenants} />
    </div>
  );
}

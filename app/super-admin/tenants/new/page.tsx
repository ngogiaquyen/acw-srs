import { TenantForm } from "@/components/super-admin/TenantForm";

export default function SuperAdminNewTenantPage() {
  return (
    <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Tạo người thuê mới</h2>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin người thuê để tạo mới trong hệ thống.
        </p>

      <TenantForm mode="create" />
    </div>
  );
}

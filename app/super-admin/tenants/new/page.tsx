import { TenantForm } from "@/components/super-admin/TenantForm";

export default function SuperAdminNewTenantPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tạo tenant mới</h2>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin tenant để tạo mới trong hệ thống.
        </p>
      </div>

      <TenantForm mode="create" />
    </div>
  );
}

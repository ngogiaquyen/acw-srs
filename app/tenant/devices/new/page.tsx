import { notFound } from "next/navigation";
import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";

export default async function TenantNewDevicePage() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Thêm thiết bị mới</h2>
        <p className="text-sm text-muted-foreground">Nhập thông tin thiết bị để thêm mới vào hệ thống.</p>
      </div>

      <DeviceForm mode="create" />
    </div>
  );
}


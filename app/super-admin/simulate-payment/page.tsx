import { notFound, redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getAllDevices } from "@/lib/db/devices";
import { getTenants } from "@/lib/db/tenants";
import { SimulatePaymentForm } from "@/components/super-admin/SimulatePaymentForm";
import type { DeviceOption } from "@/components/super-admin/SimulatePaymentForm";

export default async function SimulatePaymentPage() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated) redirect("/login");
  if (auth.user.role !== "SUPER_ADMIN") notFound();

  const [devices, tenants] = await Promise.all([getAllDevices(), getTenants()]);

  const tenantMap = new Map(tenants.map((t) => [t.id, t.name]));

  const deviceOptions: DeviceOption[] = devices.map((d) => ({
    id: d.id,
    device_id: d.device_id,
    name: d.name,
    payment_code: d.payment_code,
    price_per_minute: d.price_per_minute,
    is_active: d.is_active,
    tenant_name: tenantMap.get(d.tenant_id) ?? `Tenant #${d.tenant_id}`,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Giả lập thanh toán</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gửi webhook giả lập SePay để kiểm thử luồng thanh toán mà không cần chuyển khoản thực tế.
          Kết quả giống hệt chuyển khoản thật (tạo transaction, gửi lệnh tới thiết bị).
        </p>
      </div>

      <SimulatePaymentForm devices={deviceOptions} />
    </div>
  );
}

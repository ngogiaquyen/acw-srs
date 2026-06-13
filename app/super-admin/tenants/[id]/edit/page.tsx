import { notFound } from "next/navigation";
import { TenantForm } from "@/components/super-admin/TenantForm";
import { getTenantById } from "@/lib/db/tenants";
import { findTenantAdminByTenantId } from "@/lib/db/users";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

function toDateInputValue(value: Date | null): string {
  if (!value) return "";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function SuperAdminEditTenantPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    notFound();
  }

  const tenant = await getTenantById(id);

  if (!tenant) {
    notFound();
  }

  const admin = await findTenantAdminByTenantId(id);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa tenant</h2>
        <p className="text-sm text-muted-foreground">
          Cập nhật thông tin tenant và cấu hình subscription.
        </p>
      </div>

      <TenantForm
        mode="edit"
        tenantId={String(tenant.id)}
        initialData={{
          name: tenant.name,
          email: tenant.email,
          phone: tenant.phone ?? "",
          address: tenant.address ?? "",
          licenseMaxDevices: tenant.license_max_devices,
          subscriptionStatus: tenant.subscription_status,
          subscriptionStartDate: toDateInputValue(tenant.subscription_start_date),
          subscriptionEndDate: toDateInputValue(tenant.subscription_end_date),
          allowExpiredAccess: Boolean(tenant.allow_expired_access),
          isActive: Boolean(tenant.is_active),
          sepayBankAccount: tenant.sepay_bank_account ?? "",
          sepayBankCode: tenant.sepay_bank_code ?? "",
          sepayAccountName: tenant.sepay_account_name ?? "",
          sepayWebhookSecret: tenant.sepay_webhook_secret ?? "",
          adminPassword: "",
        }}
      />
    </div>
  );
}


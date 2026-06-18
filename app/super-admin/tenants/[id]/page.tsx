import { notFound } from "next/navigation";
import {
  TenantDetail,
  type TenantDetailData,
} from "@/components/super-admin/TenantDetail";
import { getTenantById } from "@/lib/db/tenants";
import { getDevicesByTenantId } from "@/lib/db/devices";
import { DeviceList } from "@/components/tenant/DeviceList";
import { getDeviceRemainingSecondsMap } from "@/lib/device-state";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function SuperAdminTenantDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    notFound();
  }

  const tenant = await getTenantById(id);

  if (!tenant) {
    notFound();
  }

  const rawDevices = await getDevicesByTenantId(id);

  const remainingMap = getDeviceRemainingSecondsMap(rawDevices.map((d) => d.id));

  const devices = rawDevices.map((d) => ({
    ...d,
    remainingSeconds: remainingMap.get(d.id) ?? null,
  }));

  const tenantData: TenantDetailData = {
    id: tenant.id,
    name: tenant.name,
    email: tenant.email,
    phone: tenant.phone,
    address: tenant.address,
    license_max_devices: tenant.license_max_devices,
    subscription_status: tenant.subscription_status,
    subscription_start_date: tenant.subscription_start_date
      ? tenant.subscription_start_date.toISOString().slice(0, 10)
      : null,
    subscription_end_date: tenant.subscription_end_date
      ? tenant.subscription_end_date.toISOString().slice(0, 10)
      : null,
    allow_expired_access: tenant.allow_expired_access,
    is_active: tenant.is_active,
    sepay_bank_account: tenant.sepay_bank_account,
    sepay_bank_code: tenant.sepay_bank_code,
    sepay_account_name: tenant.sepay_account_name,
    sepay_webhook_secret: tenant.sepay_webhook_secret,
    created_at: tenant.created_at.toISOString(),
    updated_at: tenant.updated_at.toISOString(),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chi tiết chủ trạm</h2>
        <p className="text-sm text-muted-foreground">
          Xem thông tin chi tiết chủ trạm và chu kỳ hợp đồng.
        </p>
      </div>

      <TenantDetail tenant={tenantData} />

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            Thiết bị của chủ trạm
          </h3>
          <p className="text-sm text-muted-foreground">
            Danh sách thiết bị ESP32 mà chủ trạm này đang quản lý.
          </p>
        </div>
        <DeviceList devices={devices} deviceDetailBase={`/super-admin/tenants/${id}/devices`} />
      </div>
    </div>
  );
}

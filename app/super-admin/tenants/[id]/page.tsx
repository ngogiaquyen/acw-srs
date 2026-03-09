import { notFound } from "next/navigation";
import {
  TenantDetail,
  type TenantDetailData,
} from "@/components/super-admin/TenantDetail";
import { getTenantById } from "@/lib/db/tenants";
import { getDevicesByTenantId } from "@/lib/db/devices";
import { getStationsByTenantId } from "@/lib/db/stations";
import { DeviceList } from "@/components/tenant/DeviceList";
import { StationList } from "@/components/tenant/StationList";
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

  const [rawDevices, stations] = await Promise.all([
    getDevicesByTenantId(id),
    getStationsByTenantId(id),
  ]);

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
        <h2 className="text-2xl font-semibold tracking-tight">Chi tiết tenant</h2>
        <p className="text-sm text-muted-foreground">
          Xem thông tin chi tiết tenant và trạng thái subscription.
        </p>
      </div>

      <TenantDetail tenant={tenantData} />

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            Thiết bị của tenant
          </h3>
          <p className="text-sm text-muted-foreground">
            Danh sách thiết bị ESP32 mà tenant này đang quản lý.
          </p>
        </div>
        <DeviceList devices={devices} />
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">
            Trạm rửa xe của tenant
          </h3>
          <p className="text-sm text-muted-foreground">
            Danh sách các trạm thuộc về tenant này.
          </p>
        </div>
        <StationList stations={stations} />
      </div>
    </div>
  );
}

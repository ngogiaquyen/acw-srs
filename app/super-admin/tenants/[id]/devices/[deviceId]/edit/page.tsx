import { notFound } from "next/navigation";
import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceById } from "@/lib/db/devices";

interface Props {
  params: Promise<{
    id: string;
    deviceId: string;
  }>;
}

export default async function SuperAdminEditDevicePage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    notFound();
  }

  const { id: tenantIdParam, deviceId: deviceIdParam } = await params;
  const tenantId = Number.parseInt(tenantIdParam, 10);
  const deviceId = Number.parseInt(deviceIdParam, 10);
  if (Number.isNaN(tenantId) || Number.isNaN(deviceId)) {
    notFound();
  }

  const device = await getDeviceById(deviceId);

  if (!device || device.tenant_id !== tenantId) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa thiết bị</h2>
        <p className="text-sm text-muted-foreground">Cập nhật thiết bị #{device.id}.</p>
      </div>

      <DeviceForm
        mode="edit"
        deviceIdParam={String(device.id)}
        tenantId={tenantId}
        initialData={{
          deviceId: device.device_id,
          name: device.name,
          paymentCode: device.payment_code ?? "",
          webUsername: device.web_username ?? "",
          webPassword: device.web_password ?? "",
          firmwareVersion: device.firmware_version ?? "",
          pricePerMinute: device.price_per_minute ? String(device.price_per_minute) : "",
          isActive: Boolean(device.is_active),
        }}
      />
    </div>
  );
}

import { notFound } from "next/navigation";
import { DeviceForm } from "@/components/tenant/DeviceForm";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantEditDevicePage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) notFound();

  const device = await getDeviceByIdAndTenantId(id, auth.user.tenantId);

  if (!device) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Chỉnh sửa thiết bị</h2>
        <p className="text-sm text-muted-foreground">Cập nhật thiết bị #{device.id}.</p>
      </div>

      <DeviceForm
        mode="edit"
        deviceIdParam={String(device.id)}
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

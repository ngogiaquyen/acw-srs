import { DeviceForm } from "@/components/tenant/DeviceForm";

export default async function TenantNewDevicePage() {

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Đăng ký thiết bị</h2>
        <p className="text-sm text-muted-foreground">
          Thêm thiết bị ESP32 mới.
        </p>
      </div>

      <DeviceForm mode="create" />
    </div>
  );
}

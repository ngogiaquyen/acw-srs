import { StationForm } from "@/components/tenant/StationForm";

export default function TenantNewStationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Tạo trạm mới</h2>
        <p className="text-sm text-muted-foreground">
          Nhập thông tin trạm để thêm vào hệ thống.
        </p>
      </div>

      <StationForm mode="create" />
    </div>
  );
}

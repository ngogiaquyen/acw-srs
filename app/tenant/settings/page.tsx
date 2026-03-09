import { SettingsForm } from "@/components/tenant/SettingsForm";

export default function TenantSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Cấu hình</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý cấu hình thanh toán và thông tin tài khoản.
        </p>
      </div>

      <SettingsForm />
    </div>
  );
}

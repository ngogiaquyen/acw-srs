import { Card } from "@/components/ui/card";

export default function TenantDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard Tenant</h2>
        <p className="text-sm text-muted-foreground">
          Tổng quan nhanh dành cho Tenant Admin.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Doanh thu hôm nay</p>
          <p className="mt-2 text-2xl font-bold">--</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Giao dịch hôm nay</p>
          <p className="mt-2 text-2xl font-bold">--</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Trạm đang hoạt động</p>
          <p className="mt-2 text-2xl font-bold">--</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Thiết bị online</p>
          <p className="mt-2 text-2xl font-bold">--</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-medium">Tenant Admin đã sẵn sàng</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Giai đoạn 16 đã hoàn thành layout, navigation, header và protected route cơ bản
          cho khu vực Tenant Admin.
        </p>
      </Card>
    </div>
  );
}

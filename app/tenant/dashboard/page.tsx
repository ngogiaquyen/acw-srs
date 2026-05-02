import { Card } from "@/components/ui/card";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDevicesByTenantId } from "@/lib/db/devices";
import { getTenantRevenueSummary } from "@/lib/db/tenant-revenue";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function TenantDashboardPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const [summary, devices] = tenantId
    ? await Promise.all([
        getTenantRevenueSummary(tenantId),
        getDevicesByTenantId(tenantId),
      ])
    : [
        {
          tenantId: 0,
          totalRevenue: 0,
          revenueToday: 0,
          totalTransactions: 0,
          transactionsToday: 0,
        },
        [],
      ];

  // Online = có heartbeat trong vòng 5 phút gần đây
  const onlineDevices = devices.filter((device) => {
    if (!device.last_heartbeat) return false;
    const lastHeartbeat = typeof device.last_heartbeat === "string"
      ? new Date(device.last_heartbeat)
      : device.last_heartbeat;
    const now = new Date();
    const diffMs = now.getTime() - lastHeartbeat.getTime();
    const diffMinutes = diffMs / 60000;
    return diffMinutes <= 5;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard Tenant</h2>
        <p className="text-sm text-muted-foreground">
          Tổng quan nhanh dành cho Tenant Admin.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="p-3 md:p-4">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Doanh thu hôm nay</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold text-blue-600">{formatCurrency(summary.revenueToday)}</p>
        </Card>

        <Card className="p-3 md:p-4">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Giao dịch</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold">{summary.transactionsToday}</p>
        </Card>

        <Card className="p-3 md:p-4">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Đang Online</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold text-green-600">{onlineDevices}</p>
        </Card>

        <Card className="p-3 md:p-4">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Tổng thiết bị</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold">{devices.length}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-base font-medium">Tổng quan tenant</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Dữ liệu được tổng hợp theo ngày hiện tại và trạng thái thiết bị đang hoạt động.
        </p>
      </Card>
    </div>
  );
}

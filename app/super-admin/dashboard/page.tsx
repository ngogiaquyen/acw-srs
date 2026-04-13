import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getSuperAdminRevenueAnalytics,
  getSuperAdminRevenueSummary,
  getTenantRevenueComparison,
} from "@/lib/db/revenue";
import { RevenueOverviewCharts } from "@/components/super-admin/RevenueOverviewCharts";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function SuperAdminDashboardPage() {
  const [summary, analytics, topTenants] = await Promise.all([
    getSuperAdminRevenueSummary(),
    getSuperAdminRevenueAnalytics(14),
    getTenantRevenueComparison(5),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Tổng quan hệ thống, doanh thu và hoạt động tenant.
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/super-admin/revenue">Xem trang doanh thu</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/super-admin/revenue/compare">So sánh tenants</Link>
          </Button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng số tenants</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalTenants}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Đang hoạt động: {summary.activeTenants}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Thiết bị đang hoạt động</p>
          <p className="mt-2 text-2xl font-bold">{summary.onlineDevices}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tổng thiết bị: {summary.totalDevices}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Giao dịch hôm nay</p>
          <p className="mt-2 text-2xl font-bold">{summary.transactionsToday}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tổng giao dịch: {summary.totalTransactions}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Doanh thu hôm nay</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(summary.revenueToday)}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Tổng doanh thu: {formatCurrency(summary.totalRevenue)}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <RevenueOverviewCharts data={analytics} />
      </Card>

      <Card className="p-6">
        <h3 className="text-base font-medium">Top tenants theo doanh thu</h3>
        <div className="mt-3 space-y-3">
          {topTenants.map((tenant, index) => (
            <div
              key={tenant.tenantId}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  #{index + 1} - {tenant.tenantName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tenant.transactions} giao dịch • {tenant.devices} thiết bị
                </p>
              </div>
              <p className="text-sm font-semibold">{formatCurrency(tenant.revenue)}</p>
            </div>
          ))}
          {topTenants.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có dữ liệu doanh thu.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

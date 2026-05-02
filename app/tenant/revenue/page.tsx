import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/tenant/RevenueChart";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTenantRevenueAnalytics, getTenantRevenueSummary } from "@/lib/db/tenant-revenue";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function TenantRevenuePage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const [summary, analytics] = tenantId
    ? await Promise.all([getTenantRevenueSummary(tenantId), getTenantRevenueAnalytics(tenantId, 30)])
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Doanh thu tenant</h2>
        <p className="text-sm text-muted-foreground">
          Tổng quan doanh thu và giao dịch của tenant.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
        <Card className="p-3 md:p-4 border-l-4 border-l-blue-500">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Hôm nay</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold text-blue-600">{formatCurrency(summary.revenueToday)}</p>
        </Card>

        <Card className="p-3 md:p-4 border-l-4 border-l-slate-400">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Tổng doanh thu</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
        </Card>

        <Card className="p-3 md:p-4 border-l-4 border-l-green-500">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">GD hôm nay</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold text-green-600">{summary.transactionsToday}</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-slate-400">
          <p className="text-[10px] md:text-sm text-muted-foreground uppercase tracking-wider font-semibold">Tổng giao dịch</p>
          <p className="mt-1 md:mt-2 text-lg md:text-2xl font-bold">{summary.totalTransactions}</p>
        </Card>
      </div>

      <Card className="p-4">
        <RevenueChart data={analytics} />
      </Card>
    </div>
  );
}

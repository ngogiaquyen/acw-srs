import { Card } from "@/components/ui/card";
import { getSuperAdminRevenueAnalytics, getSuperAdminRevenueSummary } from "@/lib/db/revenue";
import { RevenueOverviewCharts } from "@/components/super-admin/RevenueOverviewCharts";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { findUserById } from "@/lib/db/users";
import { SendReportDialog } from "@/components/tenant/SendReportDialog";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function SuperAdminRevenuePage() {
  const auth = await getCurrentUserFromCookies();
  const userId = auth.isAuthenticated ? auth.user.userId : null;

  let userEmail = "";
  if (userId) {
    const userRecord = await findUserById(userId);
    userEmail = userRecord?.email || "";
  }

  const [summary, analytics] = await Promise.all([
    getSuperAdminRevenueSummary(),
    getSuperAdminRevenueAnalytics(30),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tổng doanh thu hệ thống</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi doanh thu và giao dịch toàn hệ thống trong 30 ngày gần nhất.
          </p>
        </div>
        {auth.isAuthenticated && (
          <SendReportDialog
            endpoint="/api/super-admin/revenue/report"
            defaultEmail={userEmail}
          />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Doanh thu hôm nay</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(summary.revenueToday)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalTransactions}</p>
        </Card>
      </div>

      <Card className="p-4">
        <RevenueOverviewCharts data={analytics} />
      </Card>
    </div>
  );
}

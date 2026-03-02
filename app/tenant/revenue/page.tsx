import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTenantRevenueSummary } from "@/lib/db/tenant-revenue";

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

  const summary = tenantId
    ? await getTenantRevenueSummary(tenantId)
    : {
        tenantId: 0,
        totalRevenue: 0,
        revenueToday: 0,
        totalTransactions: 0,
        transactionsToday: 0,
      };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Doanh thu tenant</h2>
          <p className="text-sm text-muted-foreground">
            Tổng quan doanh thu và giao dịch của tenant.
          </p>
        </div>

        <Button asChild variant="outline" size="sm">
          <Link href="/tenant/revenue/analytics">Xem analytics</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Doanh thu hôm nay</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(summary.revenueToday)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Giao dịch hôm nay</p>
          <p className="mt-2 text-2xl font-bold">{summary.transactionsToday}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tổng giao dịch</p>
          <p className="mt-2 text-2xl font-bold">{summary.totalTransactions}</p>
        </Card>
      </div>
    </div>
  );
}

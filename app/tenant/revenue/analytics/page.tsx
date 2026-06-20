import { Card } from "@/components/ui/card";
import { RevenueChart } from "@/components/tenant/RevenueChart";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTenantRevenueAnalytics } from "@/lib/db/tenant-revenue";

export default async function TenantRevenueAnalyticsPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const analytics = tenantId ? await getTenantRevenueAnalytics(tenantId) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Phân tích doanh thu</h2>
        <p className="text-sm text-muted-foreground">
          Biểu đồ doanh thu và số giao dịch 30 ngày gần nhất.
        </p>
      </div>

      <Card className="p-4">
        <RevenueChart data={analytics} />
      </Card>
    </div>
  );
}

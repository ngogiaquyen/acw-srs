import { Card } from "@/components/ui/card";
import { getTenantRevenueComparison } from "@/lib/db/revenue";
import { TenantRevenueCompareChart } from "@/components/super-admin/TenantRevenueCompareChart";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function SuperAdminRevenueComparePage() {
  const comparison = await getTenantRevenueComparison(10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">So sánh doanh thu chủ trạm</h2>
        <p className="text-sm text-muted-foreground">
          Xếp hạng doanh thu giữa các chủ trạm để theo dõi hiệu quả kinh doanh.
        </p>
      </div>

      <TenantRevenueCompareChart data={comparison} />

      <Card className="p-4">
        <h3 className="mb-3 text-sm font-medium">Bảng xếp hạng chi tiết</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="px-2 py-2">#</th>
                <th className="px-2 py-2">Chủ trạm</th>
                <th className="px-2 py-2">Doanh thu</th>
                <th className="px-2 py-2">Giao dịch</th>
                <th className="px-2 py-2">Thiết bị</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((item, idx) => (
                <tr key={item.tenantId} className="border-b">
                  <td className="px-2 py-2">{idx + 1}</td>
                  <td className="px-2 py-2 font-medium">{item.tenantName}</td>
                  <td className="px-2 py-2">{formatCurrency(item.revenue)}</td>
                  <td className="px-2 py-2">{item.transactions}</td>
                  <td className="px-2 py-2">{item.devices}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

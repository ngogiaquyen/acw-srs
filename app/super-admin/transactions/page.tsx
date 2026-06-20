import { TransactionList } from "@/components/tenant/TransactionList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getAllTransactions } from "@/lib/db/transactions";
import { getTenants } from "@/lib/db/tenants";
import { getAllDevices } from "@/lib/db/devices";
import { RevenueFilters } from "@/components/super-admin/RevenueFilters";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SuperAdminTransactionsPage({ searchParams }: Props) {
  const auth = await getCurrentUserFromCookies();

  const resolvedParams = await searchParams;
  const currentTenantId = resolvedParams.tenantId ? Number(resolvedParams.tenantId) : undefined;
  const currentDeviceId = resolvedParams.deviceId ? Number(resolvedParams.deviceId) : undefined;

  let transactions: any[] = [];
  let tenants: any[] = [];
  let devices: any[] = [];

  try {
    [transactions, tenants, devices] = await Promise.all([
      getAllTransactions(currentTenantId, currentDeviceId),
      getTenants(),
      getAllDevices(),
    ]);
  } catch (error) {
    console.error("Lỗi DB khi lấy danh sách giao dịch (Admin):", error);
    // Bỏ qua lỗi, mảng giao dịch sẽ rỗng và UI tự hiển thị "Không tìm thấy dữ liệu"
  }

  const queryParams = new URLSearchParams();
  if (currentTenantId) queryParams.set("tenantId", currentTenantId.toString());
  if (currentDeviceId) queryParams.set("deviceId", currentDeviceId.toString());
  const queryString = queryParams.toString();
  const exportUrl = `/api/super-admin/transactions/export${queryString ? `?${queryString}` : ''}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight animate-fade-in">Tất cả giao dịch</h2>
          <p className="text-sm text-muted-foreground">
            Quản lý toàn bộ giao dịch trên hệ thống.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
          <a href={exportUrl}>
            <FileDown className="h-4 w-4" />
            <span>Xuất file Excel</span>
          </a>
        </Button>
      </div>

      <RevenueFilters tenants={tenants} devices={devices} />

      <TransactionList transactions={transactions} />
    </div>
  );
}

import { TransactionList } from "@/components/tenant/TransactionList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTransactionsByTenantId } from "@/lib/db/transactions";
import { getDevicesByTenantId } from "@/lib/db/devices";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { TransactionDeviceFilter } from "@/components/tenant/TransactionDeviceFilter";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function TenantTransactionsPage({ searchParams }: Props) {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const params = await searchParams;
  const deviceIdParam = typeof params.device === 'string' ? params.device : null;
  const deviceId = deviceIdParam ? parseInt(deviceIdParam, 10) : null;

  const transactions = tenantId ? await getTransactionsByTenantId(tenantId, deviceId) : [];
  const devices = tenantId ? await getDevicesByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight animate-fade-in">Danh sách giao dịch</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi các giao dịch thanh toán của chủ trạm.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          <TransactionDeviceFilter devices={devices} currentDeviceId={deviceIdParam} />
          <Button asChild variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
            <a href={`/api/tenant/transactions/export${deviceIdParam ? `?device=${deviceIdParam}` : ''}`}>
              <FileDown className="h-4 w-4" />
              <span>Xuất file Excel</span>
            </a>
          </Button>
        </div>
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}

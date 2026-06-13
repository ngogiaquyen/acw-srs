import { TransactionList } from "@/components/tenant/TransactionList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTransactionsByTenantId } from "@/lib/db/transactions";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default async function TenantTransactionsPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const transactions = tenantId ? await getTransactionsByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight animate-fade-in">Danh sách giao dịch</h2>
          <p className="text-sm text-muted-foreground">
            Theo dõi các giao dịch thanh toán của người thuê.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="w-full sm:w-auto flex items-center gap-1.5 hover:bg-slate-50 transition-colors">
          <a href="/api/tenant/transactions/export">
            <FileDown className="h-4 w-4" />
            <span>Xuất file Excel</span>
          </a>
        </Button>
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}

import { TransactionList } from "@/components/tenant/TransactionList";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTransactionsByTenantId } from "@/lib/db/transactions";

export default async function TenantTransactionsPage() {
  const auth = await getCurrentUserFromCookies();
  const tenantId = auth.isAuthenticated ? auth.user.tenantId : null;

  const transactions = tenantId ? await getTransactionsByTenantId(tenantId) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Danh sách giao dịch</h2>
        <p className="text-sm text-muted-foreground">
          Theo dõi các giao dịch thanh toán của tenant.
        </p>
      </div>

      <TransactionList transactions={transactions} />
    </div>
  );
}

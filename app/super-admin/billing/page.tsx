import { BillingList } from "@/components/super-admin/BillingList";
import { getInvoices } from "@/lib/db/invoices";

export default async function SuperAdminBillingPage() {
  const invoices = await getInvoices();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Billing</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý hóa đơn subscription và trạng thái thanh toán.
        </p>
      </div>

      <BillingList invoices={invoices} />
    </div>
  );
}

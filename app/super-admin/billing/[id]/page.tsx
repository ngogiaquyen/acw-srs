import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInvoiceById } from "@/lib/db/invoices";
import { getTenantById } from "@/lib/db/tenants";
import { getSubscriptionById } from "@/lib/db/subscriptions";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVariant(status: string) {
  if (status === "paid") return "default" as const;
  if (status === "overdue") return "destructive" as const;
  return "outline" as const;
}

interface Params {
  params: { id: string };
}

export default async function InvoiceDetailPage({ params }: Params) {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">ID không hợp lệ</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/billing">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const invoice = await getInvoiceById(id);
  if (!invoice) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">Không tìm thấy hóa đơn</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/billing">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const [tenant, subscription] = await Promise.all([
    getTenantById(invoice.tenant_id),
    invoice.subscription_id ? getSubscriptionById(invoice.subscription_id) : null,
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết hóa đơn</h2>
          <p className="text-sm text-muted-foreground">Invoice #{invoice.invoice_number}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/super-admin/billing">Quay lại</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin hóa đơn</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Number:</span>
              <span className="font-medium">{invoice.invoice_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số tiền:</span>
              <span className="font-semibold">{formatCurrency(Number(invoice.amount))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Currency:</span>
              <span className="font-medium">{invoice.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Hạn thanh toán:</span>
              <span className="font-medium">
                {new Date(invoice.due_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
            </div>
            {invoice.paid_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày thanh toán:</span>
                <span className="font-medium">
                  {new Date(invoice.paid_at).toLocaleString("vi-VN")}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tạo:</span>
              <span className="font-medium">
                {new Date(invoice.created_at).toLocaleString("vi-VN")}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin liên quan</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tenant ID:</span>
              <span className="font-medium">#{invoice.tenant_id}</span>
            </div>
            {tenant && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tenant Name:</span>
                <span className="font-medium">{tenant.name}</span>
              </div>
            )}
            {subscription && (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subscription ID:</span>
                  <span className="font-medium">#{subscription.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plan:</span>
                  <span className="font-medium">{subscription.plan_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing Cycle:</span>
                  <span className="font-medium">{subscription.billing_cycle}</span>
                </div>
              </>
            )}
            {invoice.description && (
              <div className="mt-4 pt-4 border-t">
                <span className="text-muted-foreground">Mô tả:</span>
                <p className="mt-1 font-medium">{invoice.description}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

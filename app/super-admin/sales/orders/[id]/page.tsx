import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/db/orders";
import { getTenantById } from "@/lib/db/tenants";

function statusVariant(status: string) {
  if (status === "completed") return "default" as const;
  if (status === "cancelled") return "destructive" as const;
  if (status === "confirmed" || status === "processing") return "secondary" as const;
  return "outline" as const;
}

function paymentStatusVariant(status: string) {
  if (status === "paid") return "default" as const;
  if (status === "refunded") return "destructive" as const;
  return "outline" as const;
}

function formatCurrency(value: number, currency = "VND") {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(value);
}

interface Params {
  params: { id: string };
}

export default async function OrderDetailPage({ params }: Params) {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">ID không hợp lệ</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/orders">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const order = await getOrderById(id);
  if (!order) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">Không tìm thấy đơn hàng</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/orders">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const tenant = order.tenant_id ? await getTenantById(order.tenant_id) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết đơn hàng</h2>
          <p className="text-sm text-muted-foreground">Order #{order.order_number}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/orders">Quay lại</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin đơn hàng</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">{order.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Gói:</span>
              <span className="font-medium">{order.package_name}</span>
            </div>
            {order.package_description && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mô tả:</span>
                <span className="font-medium">{order.package_description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Số lượng:</span>
              <span className="font-medium">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Đơn giá:</span>
              <span className="font-medium">{formatCurrency(Number(order.unit_price), order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền:</span>
              <span className="font-semibold">{formatCurrency(Number(order.total_amount), order.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Thanh toán:</span>
              <Badge variant={paymentStatusVariant(order.payment_status)}>{order.payment_status}</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin khách hàng</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên:</span>
              <span className="font-medium">{order.customer_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{order.customer_email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Điện thoại:</span>
              <span className="font-medium">{order.customer_phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Địa chỉ:</span>
              <span className="font-medium">{order.customer_address || "-"}</span>
            </div>
            {order.tenant_id && (
              <>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tenant ID:</span>
                    <span className="font-medium">#{order.tenant_id}</span>
                  </div>
                  {tenant && (
                    <div className="flex justify-between mt-2">
                      <span className="text-muted-foreground">Tenant Name:</span>
                      <span className="font-medium">{tenant.name}</span>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tạo:</span>
              <span className="font-medium">{new Date(order.created_at).toLocaleString("vi-VN")}</span>
            </div>
            {order.confirmed_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày xác nhận:</span>
                <span className="font-medium">{new Date(order.confirmed_at).toLocaleString("vi-VN")}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {order.notes && (
        <Card className="p-6">
          <h3 className="mb-2 text-base font-medium">Ghi chú</h3>
          <p className="text-sm text-muted-foreground">{order.notes}</p>
        </Card>
      )}
    </div>
  );
}

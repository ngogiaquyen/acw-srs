"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface OrderItem {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  package_name: string;
  total_amount: number;
  currency: string;
  status: "draft" | "pending" | "confirmed" | "processing" | "delivered" | "completed" | "cancelled";
  payment_status: "unpaid" | "partial" | "paid" | "refunded";
  tenant_id: number | null;
  created_at: Date | string;
}

interface Props {
  orders: OrderItem[];
}

function statusVariant(status: OrderItem["status"]) {
  if (status === "completed") return "default" as const;
  if (status === "cancelled") return "destructive" as const;
  if (status === "confirmed" || status === "processing") return "secondary" as const;
  return "outline" as const;
}

function paymentStatusVariant(status: OrderItem["payment_status"]) {
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

export function OrderList({ orders }: Props) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Order #</th>
              <th className="px-2 py-2">Khách hàng</th>
              <th className="px-2 py-2">Gói</th>
              <th className="px-2 py-2">Tổng tiền</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Thanh toán</th>
              <th className="px-2 py-2">Tenant</th>
              <th className="px-2 py-2">Ngày tạo</th>
              <th className="px-2 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b">
                <td className="px-2 py-2">#{order.id}</td>
                <td className="px-2 py-2">
                  <Link
                    href={`/super-admin/sales/orders/${order.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-2 py-2">
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{order.customer_email}</div>
                  </div>
                </td>
                <td className="px-2 py-2">{order.package_name}</td>
                <td className="px-2 py-2">{formatCurrency(Number(order.total_amount), order.currency)}</td>
                <td className="px-2 py-2">
                  <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
                </td>
                <td className="px-2 py-2">
                  <Badge variant={paymentStatusVariant(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </td>
                <td className="px-2 py-2">{order.tenant_id ? `#${order.tenant_id}` : "-"}</td>
                <td className="px-2 py-2">{new Date(order.created_at).toLocaleDateString("vi-VN")}</td>
                <td className="px-2 py-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/super-admin/sales/orders/${order.id}`}>Xem</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {orders.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có đơn hàng.</p>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface InvoiceItem {
  id: number;
  tenant_id: number;
  subscription_id: number | null;
  invoice_number: string;
  amount: number;
  due_date: Date | string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  created_at: Date | string;
}

interface Props {
  invoices: InvoiceItem[];
}

function statusVariant(status: InvoiceItem["status"]) {
  if (status === "paid") return "default" as const;
  if (status === "overdue") return "destructive" as const;
  return "outline" as const;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function BillingList({ invoices }: Props) {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);

  async function handleGenerateInvoices() {
    setGenerating(true);
    try {
      const res = await fetch("/api/super-admin/billing/generate", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        window.alert(data.error || "Không thể tạo hóa đơn");
        return;
      }

      window.alert(data.message || "Đã tạo hóa đơn thành công");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Có lỗi kết nối server");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex items-center justify-end">
        <Button onClick={handleGenerateInvoices} disabled={generating}>
          {generating ? "Đang tạo..." : "Tạo hóa đơn tự động"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Invoice #</th>
              <th className="px-2 py-2">Tenant</th>
              <th className="px-2 py-2">Subscription</th>
              <th className="px-2 py-2">Số tiền</th>
              <th className="px-2 py-2">Hạn thanh toán</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Ngày tạo</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b">
                <td className="px-2 py-2">#{invoice.id}</td>
                <td className="px-2 py-2">
                  <Link
                    href={`/super-admin/billing/${invoice.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>
                </td>
                <td className="px-2 py-2">{invoice.tenant_id}</td>
                <td className="px-2 py-2">{invoice.subscription_id ?? "-"}</td>
                <td className="px-2 py-2">{formatCurrency(Number(invoice.amount))}</td>
                <td className="px-2 py-2">{new Date(invoice.due_date).toLocaleDateString("vi-VN")}</td>
                <td className="px-2 py-2">
                  <Badge variant={statusVariant(invoice.status)}>{invoice.status}</Badge>
                </td>
                <td className="px-2 py-2">{new Date(invoice.created_at).toLocaleString("vi-VN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có hóa đơn.</p>
      )}
    </Card>
  );
}

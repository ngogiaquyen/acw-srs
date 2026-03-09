import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TransactionItem {
  id: number;
  device_id: number;
  pricing_package_id: number | null;
  amount: number;
  duration_minutes: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string | null;
  created_at: Date | string;
}

interface TransactionListProps {
  transactions: TransactionItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVariant(status: TransactionItem["status"]) {
  if (status === "completed") return "default" as const;
  if (status === "failed") return "destructive" as const;
  return "outline" as const;
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Device</th>
              <th className="px-3 py-2">Số tiền</th>
              <th className="px-3 py-2">Thời lượng</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thanh toán</th>
              <th className="px-3 py-2">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b">
                <td className="px-3 py-3">#{tx.id}</td>
                <td className="px-3 py-3">{tx.device_id}</td>
                <td className="px-3 py-3">{formatCurrency(Number(tx.amount))}</td>
                <td className="px-3 py-3">{tx.duration_minutes} phút</td>
                <td className="px-3 py-3">
                  <Badge variant={statusVariant(tx.status)}>{tx.status}</Badge>
                </td>
                <td className="px-3 py-3">{tx.payment_method ?? "-"}</td>
                <td className="px-3 py-3">
                  {new Date(tx.created_at).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transactions.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có giao dịch.</p>
      )}
    </Card>
  );
}

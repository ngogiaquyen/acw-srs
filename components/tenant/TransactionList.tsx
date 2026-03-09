import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface TransactionItem {
  id: number;
  device_id: number;
  device_name?: string | null;
  device_code?: string | null;
  pricing_package_id: number | null;
  amount: number;
  duration_minutes: number;
  status: "pending" | "completed" | "failed" | "refunded";
  payment_method: string | null;
  payment_transaction_id?: string | null;
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

function statusLabel(status: TransactionItem["status"]) {
  if (status === "completed") return "Thành công";
  if (status === "failed") return "Thất bại";
  if (status === "refunded") return "Hoàn tiền";
  return "Chờ xử lý";
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
        <table className="w-full min-w-215 text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">Thiết bị</th>
              <th className="px-3 py-2">Số tiền</th>
              <th className="px-3 py-2">Thời lượng</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Mã giao dịch</th>
              <th className="px-3 py-2">Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b">
                <td className="px-3 py-3 text-muted-foreground">#{tx.id}</td>
                <td className="px-3 py-3">
                  <div className="font-medium">{tx.device_name ?? `Device #${tx.device_id}`}</div>
                  {tx.device_code && (
                    <div className="text-xs text-muted-foreground">{tx.device_code}</div>
                  )}
                </td>
                <td className="px-3 py-3 font-semibold">{formatCurrency(Number(tx.amount))}</td>
                <td className="px-3 py-3">{tx.duration_minutes} phút</td>
                <td className="px-3 py-3">
                  <Badge variant={statusVariant(tx.status)}>{statusLabel(tx.status)}</Badge>
                </td>
                <td className="px-3 py-3 font-mono text-xs text-muted-foreground">
                  {tx.payment_transaction_id ?? "-"}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
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

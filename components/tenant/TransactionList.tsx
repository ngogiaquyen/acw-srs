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
  tenant_name?: string | null;
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
    <Card className="p-3 md:p-6">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">#</th>
              {transactions.some(tx => tx.tenant_name) && <th className="px-3 py-2">Chủ trạm</th>}
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
              <tr key={tx.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3 text-xs text-muted-foreground">#{tx.id}</td>
                {transactions.some(t => t.tenant_name) && (
                  <td className="px-3 py-3 font-medium text-slate-700">
                    {tx.tenant_name ?? "-"}
                  </td>
                )}
                <td className="px-3 py-3">
                  <div className="font-medium">{tx.device_name ?? `Device #${tx.device_id}`}</div>
                  {tx.device_code && (
                    <div className="text-xs text-muted-foreground">{tx.device_code}</div>
                  )}
                </td>
                <td className="px-3 py-3 font-semibold text-blue-600">{formatCurrency(Number(tx.amount))}</td>
                <td className="px-3 py-3">{tx.duration_minutes} phút</td>
                <td className="px-3 py-3">
                  <Badge variant={statusVariant(tx.status)} className="text-[10px]">{statusLabel(tx.status)}</Badge>
                </td>
                <td className="px-3 py-3 font-mono text-[10px] text-muted-foreground">
                  {tx.payment_transaction_id ?? "-"}
                </td>
                <td className="px-3 py-3 text-xs text-muted-foreground">
                  {new Date(tx.created_at).toLocaleString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {transactions.map((tx) => (
          <div key={tx.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">#{tx.id}</span>
                <Badge variant={statusVariant(tx.status)} className="text-[10px]">
                  {statusLabel(tx.status)}
                </Badge>
              </div>
              <span className="font-bold text-blue-600">{formatCurrency(Number(tx.amount))}</span>
            </div>

            <div className="space-y-2 text-sm">
              {tx.tenant_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ trạm:</span>
                  <span className="font-medium text-right">{tx.tenant_name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thiết bị:</span>
                <span className="font-medium text-right">{tx.device_name ?? `Device #${tx.device_id}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời lượng:</span>
                <span>{tx.duration_minutes} phút</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã GD:</span>
                <span className="font-mono text-xs">{tx.payment_transaction_id || "-"}</span>
              </div>
              <div className="flex justify-between pt-2 border-t mt-2">
                <span className="text-[10px] text-muted-foreground italic">
                  {new Date(tx.created_at).toLocaleString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {transactions.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Không tìm thấy dữ liệu giao dịch.</p>
      )}
    </Card>
  );
}

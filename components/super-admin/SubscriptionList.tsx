import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface SubscriptionItem {
  id: number;
  tenant_id: number;
  tenant_name?: string;
  plan_name: string;
  billing_cycle: "monthly" | "yearly";
  amount: number;
  start_date: Date | string;
  end_date: Date | string;
  status: "active" | "past_due" | "cancelled" | "expired";
  auto_renew: number | boolean;
  is_active: number | boolean;
}

interface Props {
  subscriptions: SubscriptionItem[];
  tenantMap?: Map<number, string>;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVariant(status: SubscriptionItem["status"]) {
  if (status === "active") return "default" as const;
  if (status === "past_due") return "secondary" as const;
  if (status === "expired") return "destructive" as const;
  return "outline" as const;
}

export function SubscriptionList({ subscriptions, tenantMap }: Props) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Tenant</th>
              <th className="px-2 py-2">Plan</th>
              <th className="px-2 py-2">Chu kỳ</th>
              <th className="px-2 py-2">Số tiền</th>
              <th className="px-2 py-2">Bắt đầu</th>
              <th className="px-2 py-2">Kết thúc</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Auto renew</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => {
              const tenantName = tenantMap?.get(s.tenant_id) || s.tenant_name || `#${s.tenant_id}`;
              return (
                <tr key={s.id} className="border-b">
                  <td className="px-2 py-2">#{s.id}</td>
                  <td className="px-2 py-2">{tenantName}</td>
                  <td className="px-2 py-2">{s.plan_name}</td>
                  <td className="px-2 py-2">{s.billing_cycle}</td>
                  <td className="px-2 py-2">{formatCurrency(Number(s.amount))}</td>
                  <td className="px-2 py-2">{new Date(s.start_date).toLocaleDateString("vi-VN")}</td>
                  <td className="px-2 py-2">{new Date(s.end_date).toLocaleDateString("vi-VN")}</td>
                  <td className="px-2 py-2">
                    <Badge variant={statusVariant(s.status)}>{s.status}</Badge>
                  </td>
                  <td className="px-2 py-2">{s.auto_renew ? "Có" : "Không"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {subscriptions.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có subscription.</p>
      )}
    </Card>
  );
}

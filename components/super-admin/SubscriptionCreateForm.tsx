"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TenantOption {
  id: number;
  name: string;
}

interface Props {
  tenants: TenantOption[];
}

export function SubscriptionCreateForm({ tenants }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    tenantId: "",
    planName: "Basic",
    billingCycle: "monthly",
    amount: "0",
    startDate: "",
    endDate: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/super-admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: Number(form.tenantId),
          planName: form.planName,
          billingCycle: form.billingCycle,
          amount: Number(form.amount),
          startDate: form.startDate,
          endDate: form.endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể tạo subscription");
        return;
      }

      router.refresh();
      setForm((prev) => ({ ...prev, amount: "0" }));
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-4">
      <h3 className="mb-3 text-sm font-medium">Tạo subscription mới</h3>
      <form className="grid gap-3 md:grid-cols-3" onSubmit={handleSubmit}>
        <div className="space-y-1">
          <Label htmlFor="tenantId">Tenant</Label>
          <select
            id="tenantId"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={form.tenantId}
            onChange={(e) => setForm((p) => ({ ...p, tenantId: e.target.value }))}
            required
          >
            <option value="">Chọn tenant</option>
            {tenants.map((t) => (
              <option key={t.id} value={String(t.id)}>
                #{t.id} - {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="planName">Plan</Label>
          <Input
            id="planName"
            value={form.planName}
            onChange={(e) => setForm((p) => ({ ...p, planName: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="billingCycle">Chu kỳ</Label>
          <select
            id="billingCycle"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={form.billingCycle}
            onChange={(e) => setForm((p) => ({ ...p, billingCycle: e.target.value }))}
          >
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
          </select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="amount">Số tiền</Label>
          <Input
            id="amount"
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="startDate">Ngày bắt đầu</Label>
          <Input
            id="startDate"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="endDate">Ngày kết thúc</Label>
          <Input
            id="endDate"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500 md:col-span-3">{error}</p>}

        <div className="md:col-span-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang tạo..." : "Tạo subscription"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

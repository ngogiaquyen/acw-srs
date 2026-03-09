"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface TenantSettingsFormData {
  sepayBankAccount: string;
  sepayBankCode: string;
  sepayAccountName: string;
  sepayWebhookSecret: string;
}

const defaultValues: TenantSettingsFormData = {
  sepayBankAccount: "",
  sepayBankCode: "",
  sepayAccountName: "",
  sepayWebhookSecret: "",
};

export function SettingsForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<TenantSettingsFormData>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch initial data
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/tenant/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            sepayBankAccount: data.sepayBankAccount ?? "",
            sepayBankCode: data.sepayBankCode ?? "",
            sepayAccountName: data.sepayAccountName ?? "",
            sepayWebhookSecret: data.sepayWebhookSecret ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sepayBankAccount: formData.sepayBankAccount || null,
          sepayBankCode: formData.sepayBankCode || null,
          sepayAccountName: formData.sepayAccountName || null,
          sepayWebhookSecret: formData.sepayWebhookSecret || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể lưu cấu hình");
        return;
      }

      setSuccess("Cập nhật cấu hình thành công!");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  if (loadingInitial) {
    return (
      <Card className="p-6">
        <p className="text-center text-muted-foreground">Đang tải...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-md border p-4 space-y-4">
          <h3 className="text-sm font-medium">Cấu hình SePay (thanh toán)</h3>
          <p className="text-xs text-muted-foreground">
            Cấu hình tài khoản ngân hàng để nhận thanh toán từ khách hàng qua SePay.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sepayBankAccount">Số tài khoản ngân hàng</Label>
              <Input
                id="sepayBankAccount"
                value={formData.sepayBankAccount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayBankAccount: e.target.value }))
                }
                placeholder="VD: 10575000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayBankCode">Mã ngân hàng</Label>
              <Input
                id="sepayBankCode"
                value={formData.sepayBankCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayBankCode: e.target.value }))
                }
                placeholder="VD: VTB, VCB, MB, TPB..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayAccountName">Tên chủ tài khoản</Label>
              <Input
                id="sepayAccountName"
                value={formData.sepayAccountName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayAccountName: e.target.value }))
                }
                placeholder="VD: NGUYEN VAN A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayWebhookSecret">Webhook Secret</Label>
              <Input
                id="sepayWebhookSecret"
                type="password"
                value={formData.sepayWebhookSecret}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayWebhookSecret: e.target.value }))
                }
                placeholder="Secret từ SePay dashboard"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

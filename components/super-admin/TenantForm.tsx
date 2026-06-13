"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type SubscriptionStatus = "active" | "suspended" | "expired";

export interface TenantFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  licenseMaxDevices: number;
  subscriptionStatus: SubscriptionStatus;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  allowExpiredAccess: boolean;
  isActive: boolean;
  // SePay configuration
  sepayBankAccount: string;
  sepayBankCode: string;
  sepayAccountName: string;
  sepayWebhookSecret: string;
  // Admin credentials
  adminPassword: string;
}

interface TenantFormProps {
  mode: "create" | "edit";
  tenantId?: string;
  initialData?: Partial<TenantFormData>;
}

const defaultValues: TenantFormData = {
  name: "",
  email: "",
  phone: "",
  address: "",
  licenseMaxDevices: 0,
  subscriptionStatus: "active",
  subscriptionStartDate: "",
  subscriptionEndDate: "",
  allowExpiredAccess: false,
  isActive: true,
  sepayBankAccount: "",
  sepayBankCode: "",
  sepayAccountName: "",
  sepayWebhookSecret: "",
  adminPassword: "",
};

export function TenantForm({ mode, tenantId, initialData }: TenantFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<TenantFormData>({
    ...defaultValues,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/super-admin/tenants"
          : `/api/super-admin/tenants/${tenantId}`;

      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        phone: formData.phone || null,
        address: formData.address || null,
        subscriptionStartDate: formData.subscriptionStartDate || null,
        subscriptionEndDate: formData.subscriptionEndDate || null,
        sepayBankAccount: formData.sepayBankAccount || null,
        sepayBankCode: formData.sepayBankCode || null,
        sepayAccountName: formData.sepayAccountName || null,
        sepayWebhookSecret: formData.sepayWebhookSecret || null,
        adminPassword: formData.adminPassword || undefined,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể lưu tenant");
        return;
      }

      if (mode === "create") {
        router.push("/super-admin/tenants");
      } else {
        router.push(`/super-admin/tenants/${tenantId}`);
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên tenant</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="licenseMaxDevices">Số thiết bị tối đa</Label>
            <Input
              id="licenseMaxDevices"
              type="number"
              min={0}
              value={formData.licenseMaxDevices}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  licenseMaxDevices: Number(e.target.value),
                }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionStatus">Trạng thái subscription</Label>
            <select
              id="subscriptionStatus"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={formData.subscriptionStatus}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  subscriptionStatus: e.target.value as SubscriptionStatus,
                }))
              }
            >
              <option value="active">active</option>
              <option value="suspended">suspended</option>
              <option value="expired">expired</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowExpiredAccess">Cho phép dùng khi hết hạn</Label>
            <select
              id="allowExpiredAccess"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={String(formData.allowExpiredAccess)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  allowExpiredAccess: e.target.value === "true",
                }))
              }
            >
              <option value="true">Cho phép</option>
              <option value="false">Không cho phép</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Hoạt động</Label>
            <select
              id="isActive"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={String(formData.isActive)}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isActive: e.target.value === "true",
                }))
              }
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Vô hiệu hóa</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionStartDate">Ngày bắt đầu</Label>
            <Input
              id="subscriptionStartDate"
              type="date"
              value={formData.subscriptionStartDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subscriptionStartDate: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subscriptionEndDate">Ngày kết thúc</Label>
            <Input
              id="subscriptionEndDate"
              type="date"
              value={formData.subscriptionEndDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subscriptionEndDate: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Textarea
            id="address"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="rounded-md border p-4 space-y-4 bg-gray-50/50">
          <h3 className="text-sm font-medium text-primary">Mật khẩu tài khoản quản trị (Tenant Admin)</h3>
          <p className="text-xs text-muted-foreground -mt-2">
            Tài khoản đăng nhập của tenant sẽ sử dụng tên và email của tenant ở trên.
          </p>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">
              {mode === "create" ? "Mật khẩu quản trị" : "Mật khẩu quản trị mới (để trống nếu không đổi)"}
            </Label>
            <Input
              id="adminPassword"
              type="password"
              value={formData.adminPassword}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, adminPassword: e.target.value }))
              }
              required={mode === "create"}
              placeholder={mode === "create" ? "Tối thiểu 6 ký tự" : "Nhập mật khẩu mới để thay đổi"}
            />
          </div>
        </div>

        <div className="rounded-md border p-4 space-y-4">
          <h3 className="text-sm font-medium">Cấu hình SePay (thanh toán)</h3>
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
                placeholder="VD: VTB, VCB, MB..."
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

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            {loading
              ? "Đang lưu..."
              : mode === "create"
                ? "Tạo tenant"
                : "Cập nhật tenant"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}

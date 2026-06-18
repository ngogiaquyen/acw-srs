"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DeviceFormData {
  deviceId: string;
  name: string;
  paymentCode: string;
  webUsername: string;
  webPassword: string;
  firmwareVersion: string;
  pricePerMinute: string;
  isActive: boolean;
}

interface DeviceFormProps {
  mode: "create" | "edit";
  deviceIdParam?: string;
  initialData?: Partial<DeviceFormData>;
  tenantId?: number;
}

const defaultValues: DeviceFormData = {
  deviceId: "",
  name: "",
  paymentCode: "",
  webUsername: "",
  webPassword: "",
  firmwareVersion: "",
  pricePerMinute: "",
  isActive: true,
};

export function DeviceForm({ mode, deviceIdParam, initialData, tenantId }: DeviceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<DeviceFormData>(() => {
    const data = { ...defaultValues, ...initialData };
    if (data.pricePerMinute) {
      const numericValue = parseInt(String(data.pricePerMinute), 10);
      if (!isNaN(numericValue)) {
        data.pricePerMinute = numericValue.toLocaleString("vi-VN");
      }
    }
    return data;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopyPaymentCode() {
    if (!formData.paymentCode) return;
    try {
      await navigator.clipboard.writeText(formData.paymentCode);
      window.alert("Đã copy mã thanh toán");
    } catch (err) {
      console.error(err);
      window.alert("Không thể copy mã thanh toán");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint =
        mode === "create" ? "/api/tenant/devices" : `/api/tenant/devices/${deviceIdParam}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        tenantId,
        firmwareVersion: formData.firmwareVersion || null,
        pricePerMinute: formData.pricePerMinute ? Number(formData.pricePerMinute.replace(/\./g, '')) : null,
        paymentCode: formData.paymentCode || null,
        webUsername: formData.webUsername || null,
        webPassword: formData.webPassword || null,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể lưu thiết bị");
        return;
      }

      if (mode === "create") {
        if (tenantId) {
          router.push(`/super-admin/tenants/${tenantId}`);
        } else {
          router.push("/tenant/devices");
        }
      } else {
        if (tenantId) {
          router.push(`/super-admin/tenants/${tenantId}/devices/${deviceIdParam}`);
        } else {
          router.push(`/tenant/devices/${deviceIdParam}`);
        }
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
    <Card className="p-3 md:p-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="deviceId">Device ID</Label>
            <Input
              id="deviceId"
              value={formData.deviceId}
              onChange={(e) => setFormData((p) => ({ ...p, deviceId: e.target.value }))}
              required
            />
          </div>

          {mode === "edit" && (
            <div className="space-y-2">
              <Label htmlFor="paymentCode">Mã thanh toán (tự tạo theo PA1)</Label>
              <div className="flex gap-2">
                <Input
                  id="paymentCode"
                  value={formData.paymentCode || ""}
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyPaymentCode}
                  disabled={!formData.paymentCode}
                >
                  Copy
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Tên thiết bị</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="pricePerMinute">Giá mỗi phút (VNĐ)</Label>
            <Input
              id="pricePerMinute"
              type="text"
              value={formData.pricePerMinute}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                if (!rawValue) {
                  setFormData((p) => ({ ...p, pricePerMinute: "" }));
                  return;
                }
                const formatted = Number(rawValue).toLocaleString("vi-VN");
                setFormData((p) => ({ ...p, pricePerMinute: formatted }));
              }}
              placeholder="VD: 5.000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Kích hoạt</Label>
            <select
              id="isActive"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={String(formData.isActive)}
              onChange={(e) =>
                setFormData((p) => ({ ...p, isActive: e.target.value === "true" }))
              }
            >
              <option value="true">Đang hoạt động</option>
              <option value="false">Vô hiệu hóa</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webUsername">Username đăng nhập web ESP</Label>
            <Input
              id="webUsername"
              value={formData.webUsername}
              onChange={(e) => setFormData((p) => ({ ...p, webUsername: e.target.value }))}
              placeholder="Mặc định theo email tenant admin"
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webPassword">Password đăng nhập web ESP</Label>
            <Input
              id="webPassword"
              type="password"
              value={formData.webPassword}
              onChange={(e) => setFormData((p) => ({ ...p, webPassword: e.target.value }))}
              placeholder="Nhập mật khẩu cho web ESP"
              autoComplete="new-password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : mode === "create" ? "Tạo thiết bị" : "Cập nhật"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StationOption {
  id: number;
  name: string;
}

export interface PricingFormData {
  name: string;
  stationId: string;
  price: string;
  durationMinutes: string;
  isActive: boolean;
}

interface PricingFormProps {
  mode: "create" | "edit";
  pricingId?: string;
  initialData?: Partial<PricingFormData>;
  stations: StationOption[];
}

const defaultValues: PricingFormData = {
  name: "",
  stationId: "",
  price: "",
  durationMinutes: "",
  isActive: true,
};

export function PricingForm({ mode, pricingId, initialData, stations }: PricingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<PricingFormData>({
    ...defaultValues,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = mode === "create" ? "/api/tenant/pricing" : `/api/tenant/pricing/${pricingId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        name: formData.name,
        stationId: formData.stationId ? Number(formData.stationId) : null,
        price: Number(formData.price),
        durationMinutes: Number(formData.durationMinutes),
        isActive: formData.isActive,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể lưu gói giá");
        return;
      }

      router.push("/tenant/pricing");
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên gói giá</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stationId">Trạm áp dụng</Label>
            <select
              id="stationId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={formData.stationId}
              onChange={(e) => setFormData((p) => ({ ...p, stationId: e.target.value }))}
            >
              <option value="">Tất cả trạm</option>
              {stations.map((station) => (
                <option key={station.id} value={String(station.id)}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Giá (VND)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={formData.price}
              onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="durationMinutes">Thời lượng (phút)</Label>
            <Input
              id="durationMinutes"
              type="number"
              min={1}
              value={formData.durationMinutes}
              onChange={(e) =>
                setFormData((p) => ({ ...p, durationMinutes: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="isActive">Trạng thái</Label>
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
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : mode === "create" ? "Tạo gói giá" : "Cập nhật"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}

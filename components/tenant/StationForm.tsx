"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface StationFormData {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
}

interface StationFormProps {
  mode: "create" | "edit";
  stationId?: string;
  initialData?: Partial<StationFormData>;
}

const defaultValues: StationFormData = {
  name: "",
  address: "",
  latitude: "",
  longitude: "",
  isActive: true,
};

export function StationForm({ mode, stationId, initialData }: StationFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<StationFormData>({
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
      const endpoint =
        mode === "create" ? "/api/tenant/stations" : `/api/tenant/stations/${stationId}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        address: formData.address || null,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
      };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể lưu trạm");
        return;
      }

      if (mode === "create") {
        router.push("/tenant/stations");
      } else {
        router.push(`/tenant/stations/${stationId}`);
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Tên trạm</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              value={formData.latitude}
              onChange={(e) => setFormData((p) => ({ ...p, latitude: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              value={formData.longitude}
              onChange={(e) => setFormData((p) => ({ ...p, longitude: e.target.value }))}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea
              id="address"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
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
            {loading ? "Đang lưu..." : mode === "create" ? "Tạo trạm" : "Cập nhật"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
        </div>
      </form>
    </Card>
  );
}

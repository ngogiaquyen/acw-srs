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

export interface DeviceFormData {
  deviceId: string;
  name: string;
  stationId: string;
  status: "online" | "offline" | "maintenance";
  firmwareVersion: string;
  isActive: boolean;
}

interface DeviceFormProps {
  mode: "create" | "edit";
  deviceIdParam?: string;
  initialData?: Partial<DeviceFormData>;
  stations: StationOption[];
}

const defaultValues: DeviceFormData = {
  deviceId: "",
  name: "",
  stationId: "",
  status: "offline",
  firmwareVersion: "",
  isActive: true,
};

export function DeviceForm({ mode, deviceIdParam, initialData, stations }: DeviceFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<DeviceFormData>({
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
        mode === "create" ? "/api/tenant/devices" : `/api/tenant/devices/${deviceIdParam}`;
      const method = mode === "create" ? "POST" : "PUT";

      const payload = {
        ...formData,
        stationId: formData.stationId ? Number(formData.stationId) : null,
        firmwareVersion: formData.firmwareVersion || null,
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
        router.push("/tenant/devices");
      } else {
        router.push(`/tenant/devices/${deviceIdParam}`);
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
            <Label htmlFor="deviceId">Device ID</Label>
            <Input
              id="deviceId"
              value={formData.deviceId}
              onChange={(e) => setFormData((p) => ({ ...p, deviceId: e.target.value }))}
              disabled={mode === "edit"}
              required
            />
          </div>

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
            <Label htmlFor="stationId">Trạm</Label>
            <select
              id="stationId"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={formData.stationId}
              onChange={(e) => setFormData((p) => ({ ...p, stationId: e.target.value }))}
            >
              <option value="">Không gán trạm</option>
              {stations.map((station) => (
                <option key={station.id} value={String(station.id)}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <select
              id="status"
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
              value={formData.status}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  status: e.target.value as "online" | "offline" | "maintenance",
                }))
              }
            >
              <option value="online">online</option>
              <option value="offline">offline</option>
              <option value="maintenance">maintenance</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="firmwareVersion">Firmware version</Label>
            <Input
              id="firmwareVersion"
              value={formData.firmwareVersion}
              onChange={(e) =>
                setFormData((p) => ({ ...p, firmwareVersion: e.target.value }))
              }
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

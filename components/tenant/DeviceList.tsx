"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface DeviceItem {
  id: number;
  device_id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  last_heartbeat: Date | string | null;
  firmware_version: string | null;
  price_per_minute: number | null;
  is_active: number | boolean;
}

interface DeviceListProps {
  devices: DeviceItem[];
}

function statusVariant(status: DeviceItem["status"]) {
  if (status === "online") return "default" as const;
  if (status === "maintenance") return "secondary" as const;
  return "outline" as const;
}

function formatLastHeartbeat(lastHeartbeat: Date | string | null): string {
  if (!lastHeartbeat) return "-";

  const date = typeof lastHeartbeat === "string" ? new Date(lastHeartbeat) : lastHeartbeat;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString("vi-VN");
}

export function DeviceList({ devices }: DeviceListProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = devices.filter((device) =>
    [device.device_id, device.name, device.firmware_version ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(keyword.trim().toLowerCase()),
  );

  async function handleDelete(id: number) {
    const ok = window.confirm("Bạn có chắc muốn xóa thiết bị này? Hành động không thể hoàn tác.");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/tenant/devices/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        window.alert(data.error || "Không thể xóa thiết bị");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Có lỗi kết nối server");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm theo Device ID, tên, firmware..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="sm:max-w-md"
        />
        <Button asChild>
          <Link href="/tenant/devices/new">Đăng ký thiết bị</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Device ID</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Hoạt động</th>
              <th className="px-3 py-2">Lần cuối</th>
              <th className="px-3 py-2">Firmware</th>
              <th className="px-3 py-2">Giá/phút</th>
              <th className="px-3 py-2">Kích hoạt</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((device) => (
              <tr key={device.id} className="border-b">
                <td className="px-3 py-3">#{device.id}</td>
                <td className="px-3 py-3 font-medium">{device.device_id}</td>
                <td className="px-3 py-3">{device.name}</td>
                <td className="px-3 py-3">
                  <Badge variant={statusVariant(device.status)}>{device.status}</Badge>
                </td>
                <td className="px-3 py-3">
                  {device.status === "online" ? (
                    <span className="text-green-600">Đang hoạt động</span>
                  ) : device.status === "maintenance" ? (
                    <span className="text-yellow-600">Bảo trì</span>
                  ) : (
                    <span className="text-gray-500">Ngừng hoạt động</span>
                  )}
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {formatLastHeartbeat(device.last_heartbeat)}
                </td>
                <td className="px-3 py-3">{device.firmware_version ?? "-"}</td>
                <td className="px-3 py-3">
                  {device.price_per_minute
                    ? `${Number(device.price_per_minute).toLocaleString("vi-VN")}đ`
                    : "-"}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={device.is_active ? "default" : "outline"}>
                    {device.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tenant/devices/${device.id}`}>Xem</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tenant/devices/${device.id}/edit`}>Sửa</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(device.id)}
                      disabled={deletingId === device.id}
                    >
                      {deletingId === device.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Không có thiết bị phù hợp.</p>
      )}
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountdownTimer } from "@/components/ui/countdown-timer";

export interface DeviceItem {
  id: number;
  device_id: string;
  name: string;
  last_heartbeat: Date | string | null;
  firmware_version: string | null;
  price_per_minute: number | null;
  is_active: number | boolean;
  web_username: string | null;
  last_ip?: string | null;
  remainingSeconds?: number | null;
}

interface DeviceListProps {
  devices: DeviceItem[];
  deviceDetailBase?: string;
}

function isOnline(lastHeartbeat: Date | string | null): boolean {
  if (!lastHeartbeat) return false;
  const date = typeof lastHeartbeat === "string" ? new Date(lastHeartbeat) : lastHeartbeat;
  const diffMs = new Date().getTime() - date.getTime();
  return diffMs / 60000 <= 5;
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

export function DeviceList({ devices, deviceDetailBase = "/tenant/devices" }: DeviceListProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [liveRemaining, setLiveRemaining] = useState<Record<number, number | null>>(
    () => Object.fromEntries(devices.map((d) => [d.id, d.remainingSeconds ?? null])),
  );

  useEffect(() => {
    if (devices.length === 0) return;
    const ids = devices.map((d) => d.id).join(",");

    const poll = async () => {
      try {
        const res = await fetch(`/api/tenant/devices/remaining?ids=${ids}`);
        if (res.ok) {
          const data = await res.json();
          setLiveRemaining(data.remaining);
        }
      } catch {
        // ignore network errors
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [devices]);

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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-250 text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Device ID</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Hoạt động</th>
              <th className="px-3 py-2">Còn lại</th>
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
                  <span className={isOnline(device.last_heartbeat) ? "text-green-600" : "text-gray-500"}>
                    {isOnline(device.last_heartbeat) ? "Đang hoạt động" : "Offline"}
                  </span>
                  {device.last_ip && (
                    <p className="text-xs text-muted-foreground">IP: {device.last_ip}</p>
                  )}
                </td>
                <td className="px-3 py-3">
                  {(() => {
                    const secs = liveRemaining[device.id];
                    return secs != null && secs > 0 ? (
                      <CountdownTimer initialSeconds={secs} />
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    );
                  })()}
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
                    {device.is_active ? "Đang kích hoạt" : "Vô hiệu hóa"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`${deviceDetailBase}/${device.id}`}>Xem</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`${deviceDetailBase}/${device.id}/edit`}>Sửa</Link>
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

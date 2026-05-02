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
    <Card className="p-3 md:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm theo Device ID, tên, firmware..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="sm:max-w-md"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
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
              <tr key={device.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3 text-xs text-muted-foreground">#{device.id}</td>
                <td className="px-3 py-3 font-medium">{device.device_id}</td>
                <td className="px-3 py-3">{device.name}</td>
                <td className="px-3 py-3">
                  <span className={isOnline(device.last_heartbeat) ? "text-green-600 font-medium" : "text-gray-400"}>
                    {isOnline(device.last_heartbeat) ? "● Online" : "● Offline"}
                  </span>
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
                <td className="px-3 py-3 text-xs text-muted-foreground">
                  {formatLastHeartbeat(device.last_heartbeat)}
                </td>
                <td className="px-3 py-3 text-xs">{device.firmware_version ?? "-"}</td>
                <td className="px-3 py-3">
                  {device.price_per_minute
                    ? `${Number(device.price_per_minute).toLocaleString("vi-VN")}đ`
                    : "-"}
                </td>
                <td className="px-3 py-3">
                  <Badge variant={device.is_active ? "default" : "outline"} className="text-[10px]">
                    {device.is_active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" title="Xem">
                      <Link href={`${deviceDetailBase}/${device.id}`}>👁</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" title="Sửa">
                      <Link href={`${deviceDetailBase}/${device.id}/edit`}>✎</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(device.id)}
                      disabled={deletingId === device.id}
                      title="Xóa"
                    >
                      {deletingId === device.id ? "..." : "🗑"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filtered.map((device) => (
          <div key={device.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">#{device.id}</span>
                <h4 className="font-bold text-slate-800">{device.name}</h4>
              </div>
              <Badge variant={device.is_active ? "default" : "outline"}>
                {device.is_active ? "Active" : "Disabled"}
              </Badge>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device ID:</span>
                <span className="font-mono font-medium">{device.device_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Trạng thái:</span>
                <span className={isOnline(device.last_heartbeat) ? "text-green-600 font-bold" : "text-slate-400"}>
                  {isOnline(device.last_heartbeat) ? "Đang hoạt động" : "Ngoại tuyến"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thời gian còn lại:</span>
                <span>
                  {(() => {
                    const secs = liveRemaining[device.id];
                    return secs != null && secs > 0 ? (
                      <CountdownTimer initialSeconds={secs} />
                    ) : (
                      <span className="text-slate-300">Không có</span>
                    );
                  })()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lần cuối thấy:</span>
                <span className="text-xs">{formatLastHeartbeat(device.last_heartbeat)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t pt-3">
              <Button asChild variant="outline" className="w-full text-xs h-9">
                <Link href={`${deviceDetailBase}/${device.id}`}>Xem chi tiết</Link>
              </Button>
              <Button asChild variant="outline" className="w-full text-xs h-9">
                <Link href={`${deviceDetailBase}/${device.id}/edit`}>Chỉnh sửa</Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full text-xs h-9"
                onClick={() => handleDelete(device.id)}
                disabled={deletingId === device.id}
              >
                {deletingId === device.id ? "..." : "Xóa"}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Không tìm thấy thiết bị nào phù hợp với từ khóa của bạn.
        </p>
      )}
    </Card>
  );
}

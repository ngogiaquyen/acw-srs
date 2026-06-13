"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PasswordField } from "@/components/tenant/PasswordField";

export interface CommandRecord {
  id: number;
  device_id: number;
  command_type: string;
  command_data: unknown;
  status: "pending" | "sent" | "executed" | "failed";
  response_data: unknown;
  created_at: string;
  executed_at: string | null;
}

interface DeviceOtaPanelProps {
  deviceId: number;
  webUsername: string | null;
  webPassword: string | null;
  lastIp: string | null;
  recentCommands: CommandRecord[];
}

function statusVariant(status: CommandRecord["status"]) {
  if (status === "executed") return "default" as const;
  if (status === "failed") return "destructive" as const;
  if (status === "sent") return "secondary" as const;
  return "outline" as const;
}

export function DeviceOtaPanel({
  deviceId,
  webUsername,
  webPassword,
  lastIp,
  recentCommands: initialCommands,
}: DeviceOtaPanelProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTA upload-and-flash state
  const [otaFile, setOtaFile] = useState<File | null>(null);
  const [otaLoading, setOtaLoading] = useState(false);
  const [otaMsg, setOtaMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Credentials push state
  const [newUsername, setNewUsername] = useState(webUsername ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [credLoading, setCredLoading] = useState(false);
  const [credMsg, setCredMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [commands, setCommands] = useState<CommandRecord[]>(initialCommands);

  async function sendOtaCommand(firmwareUrl: string) {
    const res = await fetch(`/api/super-admin/devices/${deviceId}/commands`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        commandType: "update_firmware",
        commandData: { firmwareUrl },
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Lỗi khi gửi lệnh OTA");
    setCommands((prev) => [data.command, ...prev].slice(0, 20));
    router.refresh();
  }

  async function handleUploadAndFlash(e: React.FormEvent) {
    e.preventDefault();
    if (!otaFile) return;

    setOtaLoading(true);
    setOtaMsg(null);

    try {
      // Step 1: Upload file → receive one-time download token
      const formData = new FormData();
      formData.append("file", otaFile);

      const uploadRes = await fetch(`/api/super-admin/devices/${deviceId}/firmware`, {
        method: "POST",
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        setOtaMsg({ ok: false, text: uploadData.error || "Lỗi khi upload firmware" });
        return;
      }

      // Step 2: Construct full URL using current origin (same server ESP connects to)
      const firmwareUrl = `${window.location.origin}${uploadData.downloadPath}`;

      // Step 3: Push OTA command to device
      await sendOtaCommand(firmwareUrl);

      setOtaMsg({
        ok: true,
        text: `Lệnh OTA đã gửi. ESP sẽ tải và flash firmware khi poll tiếp theo. File sẽ tự xóa sau khi tải xong.`,
      });
      setOtaFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      setOtaMsg({ ok: false, text: err instanceof Error ? err.message : "Lỗi không xác định" });
    } finally {
      setOtaLoading(false);
    }
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    if (!newUsername.trim() && !newPassword.trim()) return;

    setCredLoading(true);
    setCredMsg(null);

    const payload: Record<string, string> = {};
    if (newUsername.trim()) payload.webUsername = newUsername.trim();
    if (newPassword.trim()) payload.webPassword = newPassword.trim();

    try {
      const res = await fetch(`/api/super-admin/devices/${deviceId}/commands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandType: "config", commandData: payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCredMsg({ ok: false, text: data.error || "Lỗi khi gửi lệnh" });
        return;
      }
      setCredMsg({ ok: true, text: "Lệnh đã được đưa vào hàng đợi. ESP sẽ nhận khi poll tiếp theo." });
      setCommands((prev) => [data.command, ...prev].slice(0, 20));
      setNewPassword("");
      router.refresh();
    } catch {
      setCredMsg({ ok: false, text: "Lỗi kết nối server" });
    } finally {
      setCredLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Credentials + URL info */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-base">Thông tin truy cập Web ESP</h3>
        <dl className="grid gap-3 md:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Username</dt>
            <dd className="font-medium font-mono">
              {webUsername ?? <span className="text-muted-foreground italic">Chưa cấu hình</span>}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Password</dt>
            <dd>
              <PasswordField value={webPassword} />
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">URL trang cấu hình ESP</dt>
            <dd>
              {lastIp ? (
                <a
                  href={`http://${lastIp}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline font-medium"
                >
                  http://{lastIp}/
                </a>
              ) : (
                <span className="text-muted-foreground italic">Chưa có heartbeat</span>
              )}
            </dd>
          </div>
        </dl>
      </Card>

      {/* Push credentials */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-base">Cập nhật credentials web ESP</h3>
        <p className="text-xs text-muted-foreground">
          Gửi lệnh <code>config</code> xuống thiết bị để đổi username/password đăng nhập web ESP.
        </p>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCredentials}>
          <div className="space-y-1">
            <Label htmlFor="newUsername">Username mới</Label>
            <Input
              id="newUsername"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Để trống = giữ nguyên"
              autoComplete="off"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="newPassword">Password mới</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Để trống = giữ nguyên"
              autoComplete="new-password"
            />
          </div>
          {credMsg && (
            <p className={`md:col-span-2 text-sm ${credMsg.ok ? "text-green-600" : "text-red-500"}`}>
              {credMsg.text}
            </p>
          )}
          <div className="md:col-span-2">
            <Button
              type="submit"
              disabled={credLoading || (!newUsername.trim() && !newPassword.trim())}
            >
              {credLoading ? "Đang gửi..." : "Gửi lệnh cập nhật credentials"}
            </Button>
          </div>
        </form>
      </Card>


      {/* Command history */}
      <Card className="p-6 space-y-3">
        <h3 className="font-semibold text-base">Lịch sử lệnh gần đây</h3>
        {commands.length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có lệnh nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="px-2 py-2">ID</th>
                  <th className="px-2 py-2">Loại lệnh</th>
                  <th className="px-2 py-2">Dữ liệu</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2">Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {commands.map((cmd) => (
                  <tr key={cmd.id} className="border-b">
                    <td className="px-2 py-2 text-muted-foreground">#{cmd.id}</td>
                    <td className="px-2 py-2 font-mono font-medium">{cmd.command_type}</td>
                    <td className="px-2 py-2 text-xs text-muted-foreground max-w-xs truncate">
                      {cmd.command_data ? JSON.stringify(cmd.command_data) : "-"}
                    </td>
                    <td className="px-2 py-2">
                      <Badge variant={statusVariant(cmd.status)}>{cmd.status}</Badge>
                    </td>
                    <td className="px-2 py-2 text-muted-foreground whitespace-nowrap">
                      {new Date(cmd.created_at).toLocaleString("vi-VN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}




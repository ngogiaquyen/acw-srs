"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface DeviceOption {
  id: number;
  device_id: string;
  name: string;
  payment_code: string | null;
  price_per_minute: number | null;
  is_active: number | boolean;
  tenant_name: string;
}

interface Props {
  devices: DeviceOption[];
}

interface SimulateResult {
  success?: boolean;
  message?: string;
  error?: string;
  addedMinutes?: number;
  commandType?: string;
  transactionId?: number;
  commandId?: number;
  transferAmount?: number;
}

export function SimulatePaymentForm({ devices }: Props) {
  const activeDevices = devices.filter((d) => d.payment_code && d.is_active);

  const [selectedDeviceId, setSelectedDeviceId] = useState<number | "">(
    activeDevices[0]?.id ?? "",
  );
  const [amount, setAmount] = useState("10000");
  const [txId, setTxId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulateResult | null>(null);
  const [history, setHistory] = useState<Array<{ time: string; result: SimulateResult; device: string; amount: number }>>([]);

  const selectedDevice = useMemo(
    () => devices.find((d) => d.id === selectedDeviceId) ?? null,
    [devices, selectedDeviceId],
  );

  const estimatedMinutes = useMemo(() => {
    if (!selectedDevice?.price_per_minute || !amount) return null;
    const mins = Math.floor(Number(amount) / selectedDevice.price_per_minute);
    return mins > 0 ? mins : null;
  }, [selectedDevice, amount]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDevice?.payment_code) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/super-admin/simulate-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: selectedDevice.payment_code,
          transferAmount: Number(amount),
          transactionId: txId.trim() || undefined,
        }),
      });

      const data: SimulateResult = await res.json();
      setResult(data);

      if (data.success) {
        setHistory((prev) => [
          {
            time: new Date().toLocaleTimeString("vi-VN"),
            result: data,
            device: selectedDevice.name,
            amount: Number(amount),
          },
          ...prev.slice(0, 9),
        ]);
        setTxId("");
      }
    } catch {
      setResult({ error: "Lỗi kết nối tới server" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* --- Form panel --- */}
      <Card className="p-6 space-y-5">
        <div>
          <h3 className="font-semibold text-base">Giả lập webhook SePay</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Gửi yêu cầu giống hệt webhook chuyển khoản thực tế.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Device picker */}
          <div className="space-y-1.5">
            <Label htmlFor="device-select">Thiết bị (payment_code)</Label>
            <select
              id="device-select"
              value={selectedDeviceId}
              onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id} disabled={!d.payment_code}>
                  [{d.tenant_name}] {d.name}{d.payment_code ? ` — ${d.payment_code}` : " (chưa có payment_code)"}
                </option>
              ))}
            </select>
          </div>

          {/* Device info card */}
          {selectedDevice && (
            <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-28">Device ID:</span>
                <span className="font-mono font-medium">{selectedDevice.device_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-28">Payment code:</span>
                <span className="font-mono font-medium">{selectedDevice.payment_code ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground w-28">Giá/phút:</span>
                <span>
                  {selectedDevice.price_per_minute
                    ? `${Number(selectedDevice.price_per_minute).toLocaleString("vi-VN")}đ`
                    : <span className="text-destructive">Chưa cấu hình</span>}
                </span>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="space-y-1.5">
            <Label htmlFor="amount">Số tiền chuyển khoản (VND)</Label>
            <Input
              id="amount"
              type="number"
              min="1000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              required
            />
            {estimatedMinutes !== null && (
              <p className="text-xs text-green-600 font-medium">
                ≈ {estimatedMinutes} phút sử dụng
              </p>
            )}
            {selectedDevice?.price_per_minute && estimatedMinutes === null && Number(amount) > 0 && (
              <p className="text-xs text-destructive">
                Số tiền chưa đủ 1 phút (tối thiểu {Number(selectedDevice.price_per_minute).toLocaleString("vi-VN")}đ)
              </p>
            )}
          </div>

          {/* Quick amount buttons */}
          <div className="flex flex-wrap gap-2">
            {[5000, 10000, 20000, 50000, 100000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount(String(v))}
                className="rounded-full border px-3 py-1 text-xs hover:bg-muted transition-colors"
              >
                {v.toLocaleString("vi-VN")}đ
              </button>
            ))}
          </div>

          {/* Optional transaction ID */}
          <div className="space-y-1.5">
            <Label htmlFor="txid">
              Mã giao dịch giả lập{" "}
              <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </Label>
            <Input
              id="txid"
              value={txId}
              onChange={(e) => setTxId(e.target.value)}
              placeholder="SIM-001 (để trống sẽ tự tạo)"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !selectedDevice?.payment_code || !estimatedMinutes}
            className="w-full"
          >
            {loading ? "Đang xử lý..." : "🚀 Gửi webhook giả lập"}
          </Button>
        </form>

        {/* Result */}
        {result && (
          <div
            className={`rounded-lg border p-4 text-sm space-y-2 ${
              result.success
                ? "border-green-300 bg-green-50 text-green-800"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {result.success ? (
              <>
                <p className="font-semibold">✅ {result.message}</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <span className="text-green-700">Thời lượng thêm:</span>
                  <span className="font-medium">{result.addedMinutes} phút</span>
                  <span className="text-green-700">Lệnh gửi:</span>
                  <span className="font-mono font-medium">{result.commandType}</span>
                  <span className="text-green-700">Transaction ID:</span>
                  <span className="font-mono">#{result.transactionId}</span>
                  <span className="text-green-700">Command ID:</span>
                  <span className="font-mono">#{result.commandId}</span>
                </div>
              </>
            ) : (
              <p className="font-semibold">❌ {result.error}</p>
            )}
          </div>
        )}
      </Card>

      {/* --- History panel --- */}
      <div className="space-y-4">
        <h3 className="font-semibold text-base">Lịch sử giả lập</h3>

        {history.length === 0 ? (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Chưa có lần giả lập nào trong phiên này.
          </Card>
        ) : (
          <div className="space-y-2">
            {history.map((h, i) => (
              <Card key={i} className="p-4 text-sm flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-medium">{h.device}</p>
                  <p className="text-muted-foreground text-xs">
                    {Number(h.amount).toLocaleString("vi-VN")}đ →{" "}
                    <span className="text-green-600 font-medium">{h.result.addedMinutes} phút</span>
                    {" · "}
                    <span className="font-mono text-xs">{h.result.commandType}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{h.time}</span>
              </Card>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="rounded-lg border border-dashed p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Ghi chú:</p>
          <p>• <span className="font-mono">start</span> — thiết bị chưa chạy, gửi lệnh khởi động</p>
          <p>• <span className="font-mono">add_time</span> — thiết bị đang chạy, cộng thêm thời gian</p>
          <p>• Giao dịch được ghi vào DB với <span className="font-mono">payment_method = &apos;simulate&apos;</span></p>
          <p>• Bỏ qua xác thực webhook secret của tenant</p>
        </div>
      </div>
    </div>
  );
}

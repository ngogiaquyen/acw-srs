"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Power, PowerOff, Loader2 } from "lucide-react";

interface DeviceData {
  id: number;
  name: string;
  device_id: string;
  status: string;
  last_heartbeat: Date | null;
}

interface DeviceLog {
  id: number;
  log_level: string;
  message: string;
  created_at: Date;
}

interface DeviceControlPanelProps {
  device: DeviceData;
  initialLogs: DeviceLog[];
}

export function DeviceControlPanel({ device: initialDevice, initialLogs }: DeviceControlPanelProps) {
  const [device, setDevice] = useState<DeviceData>(initialDevice);
  const [logs, setLogs] = useState<DeviceLog[]>(initialLogs);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Check device running status from logs - check latest command
  const checkRunningStatus = useCallback(() => {
    if (logs.length === 0) {
      setIsRunning(false);
      return;
    }

    // Find the latest "command" log (start or stop)
    // Log messages from ESP32: "May rua bat dau hoat dong" or "May rua da dung"
    // Note: "hoat dong" contains "dung" so we need to check carefully
    let latestCommandLog = null;
    for (const log of logs) {
      const msg = log.message.toLowerCase();
      // Check for "bat dau" (start) first, then "da dung" (stop)
      if (msg.includes("bat dau") || msg.includes("da dung")) {
        latestCommandLog = log;
        break; // First one is the most recent (logs are sorted desc)
      }
    }

    if (latestCommandLog) {
      const msg = latestCommandLog.message.toLowerCase();
      // Check specifically for "bat dau" (start) or "da dung" (stop)
      // "hoat dong" contains "dung" but not "da dung"
      const isStart = msg.includes("bat dau");
      const isStop = msg.includes("da dung");
      setIsRunning(isStart);
    } else {
      setIsRunning(false);
    }
  }, [logs]);

  useEffect(() => {
    checkRunningStatus();
  }, [checkRunningStatus]);

  // Poll for device status and logs every 5 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingLogs(true);
        const res = await fetch(`/api/tenant/devices/${device.id}/monitoring`);
        if (res.ok) {
          const data = await res.json();
          setDevice((prev) => ({
            ...prev,
            status: data.device.status,
            last_heartbeat: data.device.last_heartbeat,
          }));
          setLogs(data.logs || []);
        }
      } catch (error) {
        console.error("Error fetching device data:", error);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [device.id]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const commandType = isRunning ? "stop" : "start";
      const res = await fetch(`/api/tenant/devices/${device.id}/command`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commandType }),
      });

      if (res.ok) {
        // Toggle immediately for better UX - will be confirmed by polling
        // But also refresh logs to get the actual state
        setIsRunning(!isRunning);
        // Refresh logs after command
        const logsRes = await fetch(`/api/tenant/devices/${device.id}/monitoring`);
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.logs || []);
        }
      }
    } catch (error) {
      console.error("Error sending command:", error);
    } finally {
      setLoading(false);
    }
  };

  const now = Date.now();
  const heartbeatTime = device.last_heartbeat
    ? new Date(device.last_heartbeat).getTime()
    : null;
  const offlineThresholdMs = 5 * 60 * 1000;
  const isOfflineOver5m =
    heartbeatTime === null || now - heartbeatTime > offlineThresholdMs;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Monitoring thiết bị</h2>
        <p className="text-sm text-muted-foreground">
          Theo dõi trạng thái và logs thiết bị.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant={device.status === "online" ? "default" : "outline"}>
            {device.status}
          </Badge>
          <Badge variant={isOfflineOver5m ? "destructive" : "secondary"}>
            {isOfflineOver5m ? "Offline > 5 phút" : "Ổn định"}
          </Badge>
          <Badge variant={isRunning ? "default" : "outline"} className={isRunning ? "bg-green-500" : ""}>
            {isRunning ? "Đang chạy" : "Dừng"}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Last heartbeat:{" "}
          {device.last_heartbeat
            ? new Date(device.last_heartbeat).toLocaleString("vi-VN")
            : "-"}
        </p>

        <div className="flex items-center gap-4">
          <Button
            onClick={handleToggle}
            disabled={loading || isOfflineOver5m}
            variant={isRunning ? "destructive" : "default"}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isRunning ? (
              <>
                <PowerOff className="mr-2 h-4 w-4" />
                Tắt máy
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4" />
                Bật máy
              </>
            )}
          </Button>

          {isOfflineOver5m && (
            <span className="text-sm text-red-500">
              Thiết bị offline, không thể điều khiển
            </span>
          )}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium">Logs gần nhất</h3>
          {loadingLogs && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="rounded-md border p-3">
              <p className="text-xs text-muted-foreground">
                {new Date(log.created_at).toLocaleString("vi-VN")} • {log.log_level}
              </p>
              <p className="mt-1 text-sm">{log.message}</p>
            </div>
          ))}
          {logs.length === 0 && (
            <p className="text-sm text-muted-foreground">Chưa có logs.</p>
          )}
        </div>
      </Card>
    </div>
  );
}

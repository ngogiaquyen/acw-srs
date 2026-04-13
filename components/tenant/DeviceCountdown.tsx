"use client";

import { useState, useEffect } from "react";
import { CountdownTimer } from "@/components/ui/countdown-timer";

interface DeviceCountdownProps {
  deviceId: number;
  initialSeconds: number | null;
}

export function DeviceCountdown({ deviceId, initialSeconds }: DeviceCountdownProps) {
  const [seconds, setSeconds] = useState<number | null>(initialSeconds);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`/api/tenant/devices/remaining?ids=${deviceId}`);
        if (res.ok) {
          const data = await res.json();
          const val = data.remaining?.[deviceId];
          setSeconds(typeof val === "number" ? val : null);
        }
      } catch {
        // ignore
      }
    };

    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [deviceId]);

  if (seconds == null || seconds <= 0) {
    return <span className="text-muted-foreground">—</span>;
  }
  return <CountdownTimer initialSeconds={seconds} />;
}

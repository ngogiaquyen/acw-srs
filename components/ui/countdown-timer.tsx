"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  initialSeconds: number;
  className?: string;
}

export function CountdownTimer({ initialSeconds, className }: CountdownTimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
    if (initialSeconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [initialSeconds]);

  if (seconds <= 0) {
    return <span className={className ?? "text-gray-400 text-xs"}>—</span>;
  }

  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  const display = m > 0 ? `${m}p ${s.toString().padStart(2, "0")}s` : `${s}s`;

  return (
    <span className={className ?? "font-mono text-sm font-semibold text-orange-500"}>
      {display}
    </span>
  );
}

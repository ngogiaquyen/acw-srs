"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordFieldProps {
  value?: string | null;
}

export function PasswordField({ value }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!value) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium font-mono">
        {isVisible ? value : "•".repeat(value.length)}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
      >
        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
}

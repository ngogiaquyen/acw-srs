"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Đảm bảo cookies được gửi và nhận
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || "Đăng nhập thất bại";
        setError(errorMessage);
        toast.error(errorMessage);
        return;
      }

      // Kiểm tra cookie có được set không
      console.log("[LOGIN] Login successful, user:", data.user);
      
      // Hiển thị toast thành công
      toast.success("Đăng nhập thành công!");

      const role = data?.user?.role as string | undefined;

      // Xác định đường dẫn redirect
      const redirectPath = role === "SUPER_ADMIN" 
        ? "/super-admin/dashboard" 
        : role === "TENANT_ADMIN" 
        ? "/tenant/dashboard" 
        : "/";
      
      console.log("[LOGIN] Redirecting to:", redirectPath);
      
      // Đợi một chút để cookie được set và toast hiển thị
      // Sử dụng window.location.replace để force reload và không lưu vào history
      setTimeout(() => {
        window.location.replace(redirectPath);
      }, 800);
    } catch (err) {
      console.error(err);
      const errorMessage = "Có lỗi kết nối server";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Đăng nhập hệ thống
          </h1>
          <p className="text-sm text-muted-foreground">
            Nhập email và mật khẩu để tiếp tục
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="flex justify-end">
              <a 
                href="/forgot-password" 
                className="text-sm text-blue-600 hover:underline"
              >
                Quên mật khẩu?
              </a>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Có lỗi xảy ra");
        return;
      }

      setStep(2);
      toast.success("Mã xác thực đã được gửi! Vui lòng kiểm tra email.");
      
      if (data.demo_token) {
        console.log("MÃ OTP (DEMO):", data.demo_token);
        toast.info(`MÃ OTP DEMO: ${data.demo_token}`, { duration: 10000 });
      }
    } catch (err) {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Mã xác thực không đúng");
        return;
      }

      setStep(3);
      toast.success("Xác thực thành công! Vui lòng nhập mật khẩu mới.");
    } catch (err) {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  // Step 3: Reset Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Có lỗi xảy ra");
        return;
      }

      toast.success("Đổi mật khẩu thành công!");
      router.push("/login");
    } catch (err) {
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {step === 1 ? "Quên mật khẩu" : step === 2 ? "Xác nhận mã OTP" : "Mật khẩu mới"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 1 
              ? "Nhập email của bạn để nhận mã xác thực" 
              : step === 2 
              ? `Nhập mã OTP 4 số đã gửi tới ${email}` 
              : "Thiết lập mật khẩu mới cho tài khoản của bạn"}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang xử lý..." : "Gửi mã xác thực"}
            </Button>
            <div className="text-center">
              <a href="/login" className="text-sm text-blue-600 hover:underline"> Quay lại đăng nhập </a>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Label htmlFor="otp">Mã xác thực</Label>
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button type="submit" className="w-full" disabled={loading || otp.length < 4}>
              {loading ? "Đang xác thực..." : "Xác nhận mã OTP"}
            </Button>
            <div className="text-center">
              <button type="button" onClick={() => setStep(1)} className="text-sm text-blue-600 hover:underline"> Thay đổi email </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

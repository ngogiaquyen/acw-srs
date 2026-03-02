"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/public/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không thể gửi yêu cầu");
        return;
      }

      setSuccess(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="container mx-auto max-w-2xl py-12">
        <Card className="p-8 text-center">
          <h1 className="mb-4 text-2xl font-semibold">Cảm ơn bạn đã đăng ký!</h1>
          <p className="mb-6 text-muted-foreground">
            Chúng tôi đã nhận được yêu cầu demo của bạn. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.
          </p>
          <Button
            onClick={() => {
              setSuccess(false);
            }}
          >
            Gửi yêu cầu khác
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <Card className="p-8">
        <h1 className="mb-2 text-2xl font-semibold">Đăng ký Demo</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Điền thông tin để đăng ký demo giải pháp rửa xe tự động của chúng tôi.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label htmlFor="name">Họ và tên *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="phone">Điện thoại</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="company">Công ty</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="message">Tin nhắn</Label>
            <textarea
              id="message"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Đang gửi..." : "Gửi yêu cầu demo"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

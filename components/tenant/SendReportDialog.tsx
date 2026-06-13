"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Calendar, X, Loader2 } from "lucide-react";

interface SendReportDialogProps {
  endpoint: "/api/tenant/revenue/report" | "/api/super-admin/revenue/report";
  defaultEmail: string;
  buttonLabel?: string;
  buttonClassName?: string;
}

export function SendReportDialog({
  endpoint,
  defaultEmail,
  buttonLabel = "Gửi báo cáo qua Email",
  buttonClassName,
}: SendReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [rangeDays, setRangeDays] = useState("30");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();

    if (!email) {
      toast.error("Vui lòng nhập địa chỉ email nhận");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rangeDays: Number(rangeDays),
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gửi báo cáo thất bại");
        return;
      }

      toast.success(
        data.simulated
          ? "Đã giả lập gửi báo cáo thành công! (Kiểm tra console backend)"
          : "Báo cáo doanh thu đã được gửi tới email của bạn!"
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error sending report email:", error);
      toast.error("Có lỗi xảy ra khi kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
          setEmail(defaultEmail);
        }}
        className={buttonClassName}
        variant="outline"
        size="sm"
      >
        <Mail className="h-4 w-4 mr-1.5" />
        <span>{buttonLabel}</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-fade-in">
          <Card className="relative w-full max-w-md bg-white p-6 shadow-2xl rounded-xl border border-slate-100">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 rounded-full p-1 text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title */}
            <div className="mb-5">
              <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                Gửi báo cáo doanh thu
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Hệ thống sẽ tổng hợp doanh thu và gửi tệp giao dịch chi tiết (.xlsx) đính kèm tới hòm thư của bạn.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSend} className="space-y-4">
              {/* Range Select */}
              <div className="space-y-1.5">
                <Label htmlFor="rangeDays" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Kỳ báo cáo</span>
                </Label>
                <select
                  id="rangeDays"
                  value={rangeDays}
                  onChange={(e) => setRangeDays(e.target.value)}
                  className="w-full h-8 px-2 text-sm bg-white border border-slate-200 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="7">7 ngày gần nhất</option>
                  <option value="30">30 ngày gần nhất</option>
                  <option value="90">90 ngày gần nhất</option>
                  <option value="180">180 ngày gần nhất</option>
                  <option value="365">365 ngày gần nhất</option>
                </select>
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email nhận báo cáo</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-8"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button type="submit" size="sm" disabled={loading} className="min-w-[90px]">
                  {loading ? (
                    <>
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      <span>Đang gửi</span>
                    </>
                  ) : (
                    <span>Gửi ngay</span>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}

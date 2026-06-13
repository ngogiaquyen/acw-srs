"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpCircle, X, BookOpen, Info } from "lucide-react";

export interface TenantSettingsFormData {
  sepayBankAccount: string;
  sepayBankCode: string;
  sepayAccountName: string;
  sepayWebhookSecret: string;
}

const defaultValues: TenantSettingsFormData = {
  sepayBankAccount: "",
  sepayBankCode: "",
  sepayAccountName: "",
  sepayWebhookSecret: "",
};

export function SettingsForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<TenantSettingsFormData>(defaultValues);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Fetch initial data
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/tenant/settings");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            sepayBankAccount: data.sepayBankAccount ?? "",
            sepayBankCode: data.sepayBankCode ?? "",
            sepayAccountName: data.sepayAccountName ?? "",
            sepayWebhookSecret: data.sepayWebhookSecret ?? "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoadingInitial(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await fetch("/api/tenant/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sepayBankAccount: formData.sepayBankAccount || null,
          sepayBankCode: formData.sepayBankCode || null,
          sepayAccountName: formData.sepayAccountName || null,
          sepayWebhookSecret: formData.sepayWebhookSecret || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Không thể lưu cấu hình");
        return;
      }

      setSuccess("Cập nhật cấu hình thành công!");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Có lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  }

  if (loadingInitial) {
    return (
      <Card className="p-3 md:p-6">
        <p className="text-center text-muted-foreground">Đang tải...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-md border p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Cấu hình SePay (thanh toán)</h3>
              <p className="text-xs text-muted-foreground">
                Cấu hình tài khoản ngân hàng để nhận thanh toán từ khách hàng qua SePay.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowGuide(true)}
              className="text-xs flex items-center gap-1.5 self-start sm:self-center bg-secondary/30 hover:bg-secondary/70 transition-all duration-200"
            >
              <HelpCircle className="h-4 w-4 text-primary" />
              Xem hướng dẫn
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sepayBankAccount">Số tài khoản ngân hàng</Label>
              <Input
                id="sepayBankAccount"
                value={formData.sepayBankAccount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayBankAccount: e.target.value }))
                }
                placeholder="VD: 10575000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayBankCode">Mã ngân hàng</Label>
              <Input
                id="sepayBankCode"
                value={formData.sepayBankCode}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayBankCode: e.target.value }))
                }
                placeholder="VD: VTB, VCB, MB, TPB..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayAccountName">Tên chủ tài khoản</Label>
              <Input
                id="sepayAccountName"
                value={formData.sepayAccountName}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayAccountName: e.target.value }))
                }
                placeholder="VD: NGUYEN VAN A"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sepayWebhookSecret">Webhook Secret</Label>
              <Input
                id="sepayWebhookSecret"
                type="password"
                value={formData.sepayWebhookSecret}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, sepayWebhookSecret: e.target.value }))
                }
                placeholder="Secret từ SePay dashboard"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-green-500">{success}</p>}

        <div className="flex items-center gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </form>

      {/* Modal Hướng dẫn */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col">
            
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">Hướng dẫn tích hợp thanh toán SePay</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-sm">
              <div className="bg-primary/5 border border-primary/10 rounded-lg p-3.5 text-xs text-primary flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Hệ thống ACW-SRS liên kết với <strong>SePay Webhook</strong> để nhận biến động số dư tự động theo thời gian thực, tự động đối soát giao dịch và bật máy rửa xe qua IoT.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">1</span>
                  <h4 className="font-semibold text-foreground">Bước 1: Lấy Token Webhook từ SePay</h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    Đăng nhập vào tài khoản của bạn tại <a href="https://sepay.vn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">sepay.vn</a>. Đi tới mục <strong>Tích hợp Webhook</strong> &rarr; chọn <strong>Thêm mới Webhook</strong>. Sao chép (Copy) mã <strong>API Token/Secret Token</strong> được cấp.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">2</span>
                  <h4 className="font-semibold text-foreground">Bước 2: Cấu hình Webhook URL trên SePay</h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    Trong phần cấu hình Webhook ở SePay, điền URL nhận dữ liệu của dự án:
                  </p>
                  <div className="relative mt-1.5 flex items-center gap-2 rounded bg-muted p-2.5 font-mono text-[11px] text-foreground border border-border">
                    <span className="break-all select-all">https://wash.wyndev.space/api/public/payment/callback</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
                    Chọn sự kiện: <strong>Nhận tiền (Thanh toán thành công)</strong>.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">3</span>
                  <h4 className="font-semibold text-foreground">Bước 3: Điền cấu hình vào trang Cài đặt</h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    Nhập thông tin tài khoản ngân hàng của bạn vào form bên dưới (Số tài khoản, Mã ngân hàng như VCB, MB, TPB..., Tên chủ tài khoản). Dán mã Token bí mật lấy ở Bước 1 vào ô <strong>Webhook Secret</strong>. Sau đó nhấn <strong>Lưu cấu hình</strong>.
                  </p>
                </div>

                <div className="relative pl-6 border-l-2 border-primary/20">
                  <span className="absolute -left-[9px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">4</span>
                  <h4 className="font-semibold text-foreground">Bước 4: Thiết lập thiết bị ESP32</h4>
                  <p className="text-muted-foreground text-xs mt-1 leading-relaxed">
                    Khi tạo thiết bị trên trang <strong>Quản lý thiết bị</strong>, hệ thống sẽ cấp một <strong>Mã thanh toán (Payment Code)</strong> cố định (ví dụ: <code>DV0011</code>). 
                    Hãy đảm bảo <strong>Device ID</strong> cấu hình trên ESP32 khớp hoàn toàn với Device ID đã đăng ký trên Web, và nạp tiền với nội dung chuyển khoản chứa chính xác mã thanh toán này.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t flex justify-end bg-card">
              <Button type="button" onClick={() => setShowGuide(false)} size="sm">
                Tôi đã hiểu
              </Button>
            </div>

          </div>
        </div>
      )}
    </Card>
  );
}

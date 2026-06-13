import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface TenantDetailData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  license_max_devices: number;
  subscription_status: "active" | "suspended" | "expired";
  subscription_start_date: string | null;
  subscription_end_date: string | null;
  allow_expired_access: number | boolean;
  is_active: number | boolean;
  // SePay configuration
  sepay_bank_account: string | null;
  sepay_bank_code: string | null;
  sepay_account_name: string | null;
  sepay_webhook_secret: string | null;
  created_at: string;
  updated_at: string;
}

interface TenantDetailProps {
  tenant: TenantDetailData;
}

export function TenantDetail({ tenant }: TenantDetailProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{tenant.name}</h2>
          <p className="text-sm text-muted-foreground">Người thuê #{tenant.id}</p>
        </div>

        <Button asChild variant="outline">
          <Link href={`/super-admin/tenants/${tenant.id}/edit`}>Chỉnh sửa</Link>
        </Button>
      </div>

      <dl className="grid gap-4 md:grid-cols-2">
        <div>
          <dt className="text-xs text-muted-foreground">Email</dt>
          <dd className="font-medium">{tenant.email}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Số điện thoại</dt>
          <dd className="font-medium">{tenant.phone ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">License tối đa</dt>
          <dd className="font-medium">{tenant.license_max_devices}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Subscription</dt>
          <dd className="font-medium">{tenant.subscription_status}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Ngày bắt đầu</dt>
          <dd className="font-medium">{tenant.subscription_start_date ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Ngày kết thúc</dt>
          <dd className="font-medium">{tenant.subscription_end_date ?? "-"}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Cho phép dùng khi hết hạn</dt>
          <dd className="font-medium">
            {tenant.allow_expired_access ? "Cho phép" : "Không cho phép"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Trạng thái hoạt động</dt>
          <dd className="font-medium">
            {tenant.is_active ? "Đang kích hoạt" : "Vô hiệu hóa"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Địa chỉ</dt>
          <dd className="font-medium">{tenant.address ?? "-"}</dd>
        </div>
      </dl>

      {(tenant.sepay_bank_account || tenant.sepay_bank_code) && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="text-sm font-medium mb-3">Cấu hình SePay</h3>
          <dl className="grid gap-4 md:grid-cols-2">
            <div>
              <dt className="text-xs text-muted-foreground">Số tài khoản</dt>
              <dd className="font-medium">{tenant.sepay_bank_account ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Mã ngân hàng</dt>
              <dd className="font-medium">{tenant.sepay_bank_code ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Tên chủ tài khoản</dt>
              <dd className="font-medium">{tenant.sepay_account_name ?? "-"}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Webhook Secret</dt>
              <dd className="font-medium">
                {tenant.sepay_webhook_secret ? "******" : "-"}
              </dd>
            </div>
          </dl>
        </div>
      )}
    </Card>
  );
}

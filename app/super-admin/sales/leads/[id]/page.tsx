import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getLeadById } from "@/lib/db/leads";

function statusVariant(status: string) {
  if (status === "converted") return "default" as const;
  if (status === "lost") return "destructive" as const;
  if (status === "qualified") return "secondary" as const;
  return "outline" as const;
}

interface Params {
  params: { id: string };
}

export default async function LeadDetailPage({ params }: Params) {
  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">ID không hợp lệ</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/leads">Quay lại</Link>
        </Button>
      </div>
    );
  }

  const lead = await getLeadById(id);
  if (!lead) {
    return (
      <div className="space-y-6">
        <p className="text-red-500">Không tìm thấy lead</p>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/leads">Quay lại</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Chi tiết Lead</h2>
          <p className="text-sm text-muted-foreground">Lead #{lead.id}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/super-admin/sales/leads">Quay lại</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin liên hệ</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên:</span>
              <span className="font-medium">{lead.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{lead.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Điện thoại:</span>
              <span className="font-medium">{lead.phone || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Công ty:</span>
              <span className="font-medium">{lead.company || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Địa chỉ:</span>
              <span className="font-medium">{lead.address || "-"}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-base font-medium">Thông tin khác</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nguồn:</span>
              <span className="font-medium">{lead.source}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày tạo:</span>
              <span className="font-medium">{new Date(lead.created_at).toLocaleString("vi-VN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ngày cập nhật:</span>
              <span className="font-medium">{new Date(lead.updated_at).toLocaleString("vi-VN")}</span>
            </div>
          </div>
        </Card>
      </div>

      {lead.message && (
        <Card className="p-6">
          <h3 className="mb-2 text-base font-medium">Tin nhắn</h3>
          <p className="text-sm text-muted-foreground">{lead.message}</p>
        </Card>
      )}

      {lead.notes && (
        <Card className="p-6">
          <h3 className="mb-2 text-base font-medium">Ghi chú</h3>
          <p className="text-sm text-muted-foreground">{lead.notes}</p>
        </Card>
      )}
    </div>
  );
}

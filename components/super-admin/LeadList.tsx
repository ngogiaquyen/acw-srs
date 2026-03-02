"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface LeadItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  source: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  created_at: Date | string;
}

interface Props {
  leads: LeadItem[];
}

function statusVariant(status: LeadItem["status"]) {
  if (status === "converted") return "default" as const;
  if (status === "lost") return "destructive" as const;
  if (status === "qualified") return "secondary" as const;
  return "outline" as const;
}

export function LeadList({ leads }: Props) {
  return (
    <Card className="p-4">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-2 py-2">ID</th>
              <th className="px-2 py-2">Tên</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Điện thoại</th>
              <th className="px-2 py-2">Công ty</th>
              <th className="px-2 py-2">Nguồn</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Ngày tạo</th>
              <th className="px-2 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b">
                <td className="px-2 py-2">#{lead.id}</td>
                <td className="px-2 py-2">{lead.name}</td>
                <td className="px-2 py-2">{lead.email}</td>
                <td className="px-2 py-2">{lead.phone || "-"}</td>
                <td className="px-2 py-2">{lead.company || "-"}</td>
                <td className="px-2 py-2">{lead.source}</td>
                <td className="px-2 py-2">
                  <Badge variant={statusVariant(lead.status)}>{lead.status}</Badge>
                </td>
                <td className="px-2 py-2">{new Date(lead.created_at).toLocaleDateString("vi-VN")}</td>
                <td className="px-2 py-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/super-admin/sales/leads/${lead.id}`}>Xem</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {leads.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Chưa có lead.</p>
      )}
    </Card>
  );
}

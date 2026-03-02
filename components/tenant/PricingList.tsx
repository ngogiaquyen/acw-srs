"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface PricingItem {
  id: number;
  name: string;
  station_id: number | null;
  price: number;
  duration_minutes: number;
  is_active: number | boolean;
}

interface PricingListProps {
  pricingPackages: PricingItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PricingList({ pricingPackages }: PricingListProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = pricingPackages.filter((item) =>
    [item.name, item.station_id ? String(item.station_id) : "all"]
      .join(" ")
      .toLowerCase()
      .includes(keyword.trim().toLowerCase()),
  );

  async function handleDelete(id: number) {
    const ok = window.confirm("Bạn có chắc muốn vô hiệu hóa gói giá này?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/tenant/pricing/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        window.alert(data.error || "Không thể xóa gói giá");
        return;
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Có lỗi kết nối server");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Tìm theo tên gói giá..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="sm:max-w-md"
        />

        <Button asChild>
          <Link href="/tenant/pricing/new">Tạo gói giá</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Tên gói</th>
              <th className="px-3 py-2">Giá</th>
              <th className="px-3 py-2">Thời lượng</th>
              <th className="px-3 py-2">Trạm</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-3 py-3">#{item.id}</td>
                <td className="px-3 py-3 font-medium">{item.name}</td>
                <td className="px-3 py-3">{formatCurrency(Number(item.price))}</td>
                <td className="px-3 py-3">{item.duration_minutes} phút</td>
                <td className="px-3 py-3">{item.station_id ?? "Tất cả"}</td>
                <td className="px-3 py-3">
                  <Badge variant={item.is_active ? "default" : "outline"}>
                    {item.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tenant/pricing/${item.id}/edit`}>Sửa</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Không có gói giá phù hợp.</p>
      )}
    </Card>
  );
}

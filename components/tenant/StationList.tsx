"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface StationItem {
  id: number;
  name: string;
  address: string | null;
  is_active: number | boolean;
}

interface StationListProps {
  stations: StationItem[];
}

export function StationList({ stations }: StationListProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = stations.filter((station) =>
    [station.name, station.address ?? ""]
      .join(" ")
      .toLowerCase()
      .includes(keyword.trim().toLowerCase()),
  );

  async function handleDelete(id: number) {
    const ok = window.confirm("Bạn có chắc muốn vô hiệu hóa trạm này?");
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/tenant/stations/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        window.alert(data.error || "Không thể xóa trạm");
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
          placeholder="Tìm theo tên trạm, địa chỉ..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="sm:max-w-md"
        />
        <Button asChild>
          <Link href="/tenant/stations/new">Tạo trạm mới</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Tên trạm</th>
              <th className="px-3 py-2">Địa chỉ</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((station) => (
              <tr key={station.id} className="border-b">
                <td className="px-3 py-3">#{station.id}</td>
                <td className="px-3 py-3 font-medium">{station.name}</td>
                <td className="px-3 py-3">{station.address ?? "-"}</td>
                <td className="px-3 py-3">
                  <Badge variant={station.is_active ? "default" : "outline"}>
                    {station.is_active ? "Đang kích hoạt" : "Vô hiệu hóa"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tenant/stations/${station.id}`}>Xem</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/tenant/stations/${station.id}/edit`}>Sửa</Link>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(station.id)}
                      disabled={deletingId === station.id}
                    >
                      {deletingId === station.id ? "Đang xóa..." : "Xóa"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">Không có trạm phù hợp.</p>
      )}
    </Card>
  );
}

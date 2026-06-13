"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface TenantItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  license_max_devices: number;
  subscription_status: "active" | "suspended" | "expired";
  is_active: number | boolean;
  created_at: Date | string;
}

interface TenantListProps {
  tenants: TenantItem[];
}

const ITEMS_PER_PAGE = 10;

export function TenantList({ tenants }: TenantListProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const normalized = keyword.trim().toLowerCase();

    return tenants.filter((tenant) => {
      const matchesKeyword = normalized
        ? [tenant.name, tenant.email, tenant.phone ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(normalized)
        : true;

      const isActive = Boolean(tenant.is_active);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesKeyword && matchesStatus;
    });
  }, [tenants, keyword, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  async function handleDelete(id: number) {
    setDeletingId(id);

    try {
      const res = await fetch(`/api/super-admin/tenants/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        window.alert(data.error || "Không thể xóa tenant");
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

  function handleKeywordChange(value: string) {
    setKeyword(value);
    setPage(1);
  }

  function handleStatusChange(value: "all" | "active" | "inactive") {
    setStatusFilter(value);
    setPage(1);
  }

  return (
    <Card className="p-3 md:p-6">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="sm:w-80"
          />

          <select
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            value={statusFilter}
            onChange={(e) =>
              handleStatusChange(e.target.value as "all" | "active" | "inactive")
            }
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Vô hiệu hóa</option>
          </select>
        </div>

        <Button asChild>
          <Link href="/super-admin/tenants/new">Tạo người thuê mới</Link>
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Tên</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">SĐT</th>
              <th className="px-3 py-2">Giới hạn thiết bị</th>
              <th className="px-3 py-2">Trạng thái</th>
              <th className="px-3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((tenant) => (
              <tr key={tenant.id} className="border-b hover:bg-slate-50 transition-colors">
                <td className="px-3 py-3 text-xs text-muted-foreground">#{tenant.id}</td>
                <td className="px-3 py-3 font-medium">{tenant.name}</td>
                <td className="px-3 py-3 text-xs">{tenant.email}</td>
                <td className="px-3 py-3 text-xs">{tenant.phone ?? "-"}</td>
                <td className="px-3 py-3">{tenant.license_max_devices}</td>
                <td className="px-3 py-3">
                  <Badge variant={tenant.is_active ? "default" : "outline"} className="text-[10px]">
                    {tenant.is_active ? "Active" : "Disabled"}
                  </Badge>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" title="Xem">
                      <Link href={`/super-admin/tenants/${tenant.id}`}>👁</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0" title="Sửa">
                      <Link href={`/super-admin/tenants/${tenant.id}/edit`}>✎</Link>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={deletingId === tenant.id}
                          title="Xóa"
                        >
                          {deletingId === tenant.id ? "..." : "🗑"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Vô hiệu hóa người thuê này?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này sẽ đặt người thuê về trạng thái không hoạt động.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy</AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={() => handleDelete(tenant.id)}
                          >
                            Xác nhận xóa
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {paginated.map((tenant) => (
          <div key={tenant.id} className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">#{tenant.id}</span>
                <h4 className="font-bold text-slate-800">{tenant.name}</h4>
              </div>
              <div className="flex gap-1">
                <Badge variant={tenant.is_active ? "default" : "outline"} className="text-[10px]">
                  {tenant.is_active ? "Active" : "Disabled"}
                </Badge>
              </div>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="text-xs">{tenant.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SĐT:</span>
                <span className="text-xs">{tenant.phone ?? "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giới hạn License:</span>
                <span className="font-medium">{tenant.license_max_devices} thiết bị</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t pt-3">
              <Button asChild variant="outline" className="w-full text-xs h-9">
                <Link href={`/super-admin/tenants/${tenant.id}`}>Xem</Link>
              </Button>
              <Button asChild variant="outline" className="w-full text-xs h-9">
                <Link href={`/super-admin/tenants/${tenant.id}/edit`}>Sửa</Link>
              </Button>
              <Button
                variant="destructive"
                className="w-full text-xs h-9"
                onClick={() => handleDelete(tenant.id)}
                disabled={deletingId === tenant.id}
              >
                Xóa
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {paginated.length} / {filtered.length} người thuê
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {currentPage}/{totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Sau
          </Button>
        </div>
      </div>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Không có người thuê phù hợp.
        </p>
      )}
    </Card>
  );
}

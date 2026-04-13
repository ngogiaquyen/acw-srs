import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { Button } from "@/components/ui/button";
import { TenantSidebarNav } from "@/components/tenant/SidebarNav";

const navItems = [
  { href: "/tenant/dashboard", label: "Dashboard" },
  { href: "/tenant/devices", label: "Thiết bị" },
  { href: "/tenant/transactions", label: "Giao dịch" },
  { href: "/tenant/revenue", label: "Doanh thu" },
  { href: "/tenant/settings", label: "Cấu hình" },
];

interface TenantLayoutProps {
  children: React.ReactNode;
}

export async function TenantLayout({ children }: TenantLayoutProps) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated) {
    redirect("/login");
  }

  if (auth.user.role !== "TENANT_ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="sticky top-0 h-screen w-64 border-r bg-white px-4 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Tenant Admin</h2>
            <p className="text-xs text-muted-foreground">ACW-SRS Tenant Console</p>
          </div>

          <TenantSidebarNav items={navItems} />
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <h1 className="text-base font-semibold">Bảng điều khiển Tenant Admin</h1>
              <p className="text-xs text-muted-foreground">
                Xin chào, user #{auth.user.userId} • Tenant #{auth.user.tenantId}
              </p>
            </div>

            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="outline" size="sm">
                Đăng xuất
              </Button>
            </form>
          </header>

          <section className="p-6">{children}</section>
        </main>
      </div>
    </div>
  );
}

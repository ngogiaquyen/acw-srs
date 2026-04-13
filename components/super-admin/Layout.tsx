import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/super-admin/SidebarNav";

const navItems = [
  { href: "/super-admin/dashboard", label: "Dashboard" },
  { href: "/super-admin/tenants", label: "Tenants" },
  { href: "/super-admin/revenue", label: "Doanh thu" },
  { href: "/super-admin/simulate-payment", label: "🧪 Giả lập thanh toán" },
];

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

export async function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated) {
    redirect("/login");
  }

  if (auth.user.role !== "SUPER_ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="sticky top-0 h-screen w-64 border-r bg-white px-4 py-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Super Admin</h2>
            <p className="text-xs text-muted-foreground">ACW-SRS Console</p>
          </div>

          <SidebarNav items={navItems} />
        </aside>

        <main className="flex-1">
          <header className="flex items-center justify-between border-b bg-white px-6 py-4">
            <div>
              <h1 className="text-base font-semibold">Bảng điều khiển Super Admin</h1>
              <p className="text-xs text-muted-foreground">
                Xin chào, user #{auth.user.userId}
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

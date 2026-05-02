import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { TenantSidebar } from "@/components/tenant/Sidebar";

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
    <div className="min-h-screen bg-slate-50/50 lg:flex">
      <TenantSidebar user={auth.user} />
      
      <main className="flex-1">
        <header className="hidden lg:flex items-center justify-between border-b bg-white px-8 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Bảng điều khiển Tenant</h1>
            <p className="text-xs text-slate-500">
              Quản lý trạm rửa xe và thiết bị của bạn
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              ID: {auth.user.userId}
            </span>
          </div>
        </header>

        <section className="px-3 py-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

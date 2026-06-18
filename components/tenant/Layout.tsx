import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { findUserById } from "@/lib/db/users";
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

  const dbUser = await findUserById(auth.user.userId);
  if (!dbUser) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 lg:flex">
      <TenantSidebar user={dbUser} />
      
      <main className="flex-1">
        <header className="hidden lg:flex items-center justify-between border-b bg-white px-8 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Bảng điều khiển chủ trạm</h1>
            <p className="text-xs text-slate-500">
              Quản lý trạm rửa xe và thiết bị của bạn
            </p>
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

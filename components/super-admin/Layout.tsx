import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { SuperAdminSidebar } from "@/components/super-admin/Sidebar";

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
    <div className="min-h-screen bg-slate-50/50 lg:flex">
      <SuperAdminSidebar user={auth.user} />
      
      <main className="flex-1">
        <header className="hidden lg:flex items-center justify-between border-b bg-white px-8 py-4">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Hệ thống Quản trị</h1>
            <p className="text-xs text-slate-500">
              Quản lý toàn bộ hệ thống ACW-SRS
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground bg-blue-50 text-blue-600 border border-blue-100 px-2 py-1 rounded">
              Super Admin
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Cpu, CreditCard, BarChart, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
  { href: "/tenant/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tenant/devices", label: "Thiết bị", icon: Cpu },
  { href: "/tenant/transactions", label: "Giao dịch", icon: CreditCard },
  { href: "/tenant/revenue", label: "Doanh thu", icon: BarChart },
  { href: "/tenant/settings", label: "Cấu hình", icon: Settings },
];

export function TenantSidebar({ user }: { user: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Menu className="h-6 w-6 cursor-pointer" onClick={toggleSidebar} />
          <span className="font-bold">Bảng điều khiển chủ trạm</span>
        </div>
        <form action="/api/auth/logout" method="POST">
          <Button type="submit" variant="ghost" size="icon">
            <LogOut className="h-5 w-5" />
          </Button>
        </form>
      </header>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 lg:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:border-r",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="mb-8 flex items-center justify-between px-2">
            <div>
              <h2 className="text-xl font-bold text-primary">ACW-SRS</h2>
              <p className="text-xs text-muted-foreground">Quản trị chủ trạm</p>
            </div>
            <X className="h-6 w-6 cursor-pointer lg:hidden" onClick={toggleSidebar} />
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/tenant/dashboard" && pathname.startsWith(`${item.href}/`));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t pt-4 px-2">
            <p className="text-xs font-medium text-muted-foreground truncate" title={user.name}>
              {user.name}
            </p>
            <p className="text-[10px] text-muted-foreground/60 mb-4 truncate" title={user.email}>
              {user.email}
            </p>
            <form action="/api/auth/logout" method="POST">
              <Button type="submit" variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" size="sm">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}

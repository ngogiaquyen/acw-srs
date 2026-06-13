import { redirect } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";

export default async function Page() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated) {
    redirect("/login");
  }

  if (auth.user.role === "SUPER_ADMIN") {
    redirect("/super-admin/dashboard");
  } else if (auth.user.role === "TENANT_ADMIN") {
    redirect("/tenant/dashboard");
  }

  redirect("/login");
}
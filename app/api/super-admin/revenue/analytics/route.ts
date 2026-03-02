import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getSuperAdminRevenueAnalytics } from "@/lib/db/revenue";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    return null;
  }

  return auth.user;
}

export async function GET(request: Request) {
  const currentUser = ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const daysParam = searchParams.get("days");
    const days = daysParam ? Number.parseInt(daysParam, 10) : 30;

    const analytics = await getSuperAdminRevenueAnalytics(days);

    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/super-admin/revenue/analytics:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy analytics doanh thu" },
      { status: 500 },
    );
  }
}

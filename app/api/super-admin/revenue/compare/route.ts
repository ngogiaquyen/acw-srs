import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTenantRevenueComparison } from "@/lib/db/revenue";

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
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 10;

    const comparison = await getTenantRevenueComparison(limit);

    return NextResponse.json({ comparison }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/super-admin/revenue/compare:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy dữ liệu so sánh tenant" },
      { status: 500 },
    );
  }
}

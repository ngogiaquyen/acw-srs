import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getSuperAdminRevenueSummary } from "@/lib/db/revenue";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    return null;
  }

  return auth.user;
}

export async function GET() {
  const currentUser = ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const summary = await getSuperAdminRevenueSummary();
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/super-admin/revenue:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy dữ liệu doanh thu" },
      { status: 500 },
    );
  }
}

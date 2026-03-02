import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, resolveTenantAccess } from "@/lib/auth/middleware";
import { getTenantRevenueSummary } from "@/lib/db/tenant-revenue";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) return null;
  return auth.user;
}

export async function GET(request: Request) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const access = resolveTenantAccess(user, url.searchParams.get("tenant_id"));

  if (!access.ok || access.tenantId === undefined) {
    if (!access.ok) return access.response;
    return NextResponse.json({ error: "tenant_id là bắt buộc" }, { status: 400 });
  }

  try {
    const summary = await getTenantRevenueSummary(access.tenantId);
    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/tenant/revenue:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy doanh thu tenant" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getCurrentUserFromCookies, resolveTenantAccess } from "@/lib/auth/middleware";
import { getTenantRevenueAnalytics } from "@/lib/db/tenant-revenue";

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

  const daysParam = url.searchParams.get("days");
  const days = daysParam ? Number.parseInt(daysParam, 10) : 30;

  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localDate = new Date(today.getTime() - (offset * 60 * 1000));
  const endDate = localDate.toISOString().split('T')[0];

  const end = new Date(endDate);
  end.setDate(end.getDate() - (days - 1));
  const startDate = end.toISOString().split('T')[0];

  try {
    const analytics = await getTenantRevenueAnalytics(access.tenantId, startDate, endDate);
    return NextResponse.json({ analytics }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/tenant/revenue/analytics:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy analytics doanh thu tenant" },
      { status: 500 },
    );
  }
}

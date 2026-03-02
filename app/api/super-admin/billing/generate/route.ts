import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { generateMonthlyInvoicesJob } from "@/lib/db/billing-jobs";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

export async function POST() {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const result = await generateMonthlyInvoicesJob();

    return NextResponse.json(
      {
        message: `Đã tạo ${result.createdCount} hóa đơn`,
        invoices: result.invoices,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/super-admin/billing/generate:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo hóa đơn" }, { status: 500 });
  }
}

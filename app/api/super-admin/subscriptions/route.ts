import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { createSubscription, getSubscriptions } from "@/lib/db/subscriptions";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface SubscriptionBody {
  tenantId?: number;
  planName?: string;
  billingCycle?: "monthly" | "yearly";
  amount?: number;
  startDate?: string;
  endDate?: string;
  status?: "active" | "past_due" | "cancelled" | "expired";
  autoRenew?: boolean;
  isActive?: boolean;
}

export async function GET() {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const subscriptions = await getSubscriptions();
  return NextResponse.json({ subscriptions }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await request.json()) as SubscriptionBody;

    if (!body.tenantId || !body.planName || !body.billingCycle || body.amount === undefined || !body.startDate || !body.endDate) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc" }, { status: 400 });
    }

    const subscription = await createSubscription({
      tenantId: body.tenantId,
      planName: body.planName,
      billingCycle: body.billingCycle,
      amount: body.amount,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      status: body.status,
      autoRenew: body.autoRenew,
      isActive: body.isActive,
    });

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/super-admin/subscriptions:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo subscription" }, { status: 500 });
  }
}

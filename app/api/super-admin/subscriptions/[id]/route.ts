import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getSubscriptionById, updateSubscription } from "@/lib/db/subscriptions";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface Params {
  params: { id: string };
}

interface UpdateBody {
  planName?: string;
  billingCycle?: "monthly" | "yearly";
  amount?: number;
  startDate?: string;
  endDate?: string;
  status?: "active" | "past_due" | "cancelled" | "expired";
  autoRenew?: boolean;
  isActive?: boolean;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const subscription = await getSubscriptionById(id);
  if (!subscription) return NextResponse.json({ error: "Subscription không tồn tại" }, { status: 404 });

  return NextResponse.json({ subscription }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  try {
    const body = (await request.json()) as UpdateBody;

    const updated = await updateSubscription(id, {
      planName: body.planName,
      billingCycle: body.billingCycle,
      amount: body.amount,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      status: body.status,
      autoRenew: body.autoRenew,
      isActive: body.isActive,
    });

    if (!updated) {
      return NextResponse.json({ error: "Subscription không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ subscription: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/super-admin/subscriptions/[id]:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật subscription" }, { status: 500 });
  }
}

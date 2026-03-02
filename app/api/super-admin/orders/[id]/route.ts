import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { deleteOrder, getOrderById, updateOrder } from "@/lib/db/orders";
import { createTenant } from "@/lib/db/tenants";
import { createSubscription } from "@/lib/db/subscriptions";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface Params {
  params: { id: string };
}

interface UpdateBody {
  leadId?: number | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  packageName?: string;
  packageDescription?: string | null;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  currency?: string;
  status?: "draft" | "pending" | "confirmed" | "processing" | "delivered" | "completed" | "cancelled";
  paymentStatus?: "unpaid" | "partial" | "paid" | "refunded";
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  tenantId?: number | null;
  notes?: string | null;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const order = await getOrderById(id);
  if (!order) return NextResponse.json({ error: "Order không tồn tại" }, { status: 404 });

  return NextResponse.json({ order }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  try {
    const body = (await request.json()) as UpdateBody;

    // Nếu order status được cập nhật thành 'confirmed' và chưa có tenant_id, tự động tạo tenant
    if (body.status === "confirmed") {
      const existingOrder = await getOrderById(id);
      if (existingOrder && !existingOrder.tenant_id) {
        // Tạo tenant từ order information
        const tenant = await createTenant({
          name: body.customerName || existingOrder.customer_name,
          email: body.customerEmail || existingOrder.customer_email,
          phone: body.customerPhone || existingOrder.customer_phone,
          address: body.customerAddress || existingOrder.customer_address,
          licenseMaxDevices: 5, // Default license
          subscriptionStatus: "active",
          subscriptionStartDate: new Date(),
          subscriptionEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          isActive: true,
        });

        // Tạo subscription cho tenant
        const subscription = await createSubscription({
          tenantId: tenant.id,
          planName: body.packageName || existingOrder.package_name,
          billingCycle: "yearly",
          amount: Number(body.totalAmount || existingOrder.total_amount),
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
          status: "active",
          autoRenew: true,
          isActive: true,
        });

        // Cập nhật order với tenant_id
        body.tenantId = tenant.id;
      }
    }

    const updated = await updateOrder(id, {
      leadId: body.leadId,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      customerAddress: body.customerAddress,
      packageName: body.packageName,
      packageDescription: body.packageDescription,
      quantity: body.quantity,
      unitPrice: body.unitPrice,
      totalAmount: body.totalAmount,
      currency: body.currency,
      status: body.status,
      paymentStatus: body.paymentStatus,
      paymentMethod: body.paymentMethod,
      paymentTransactionId: body.paymentTransactionId,
      tenantId: body.tenantId,
      notes: body.notes,
    });

    if (!updated) {
      return NextResponse.json({ error: "Order không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ order: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/super-admin/orders/[id]:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật order" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const deleted = await deleteOrder(id);
  if (!deleted) return NextResponse.json({ error: "Order không tồn tại" }, { status: 404 });

  return NextResponse.json({ message: "Order đã được xóa" }, { status: 200 });
}

import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { createOrder, generateOrderNumber, getOrders } from "@/lib/db/orders";
import { handleDatabaseError } from "@/lib/utils/db-errors";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface OrderBody {
  leadId?: number | null;
  orderNumber?: string;
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

export async function GET() {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const orders = await getOrders();
  return NextResponse.json({ orders }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await request.json()) as OrderBody;

    if (!body.customerName || !body.customerEmail || !body.packageName || body.unitPrice === undefined || body.totalAmount === undefined) {
      return NextResponse.json(
        { error: "Thiếu dữ liệu bắt buộc (customerName, customerEmail, packageName, unitPrice, totalAmount)" },
        { status: 400 },
      );
    }

    const orderNumber = body.orderNumber || generateOrderNumber();

    const order = await createOrder({
      leadId: body.leadId,
      orderNumber,
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

    return NextResponse.json({ order }, { status: 201 });
  } catch (error: any) {
    console.error("Error in POST /api/super-admin/orders:", error);
    const dbErrorResponse = handleDatabaseError(error);
    if (dbErrorResponse) return dbErrorResponse;

    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo đơn hàng" },
      { status: 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getInvoiceById } from "@/lib/db/invoices";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const invoice = await getInvoiceById(id);
  if (!invoice) return NextResponse.json({ error: "Invoice không tồn tại" }, { status: 404 });

  return NextResponse.json({ invoice }, { status: 200 });
}

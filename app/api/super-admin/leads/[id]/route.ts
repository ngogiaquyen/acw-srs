import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { deleteLead, getLeadById, updateLead } from "@/lib/db/leads";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface Params {
  params: { id: string };
}

interface UpdateBody {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  message?: string | null;
  source?: string;
  status?: "new" | "contacted" | "qualified" | "converted" | "lost";
  assignedTo?: number | null;
  notes?: string | null;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const lead = await getLeadById(id);
  if (!lead) return NextResponse.json({ error: "Lead không tồn tại" }, { status: 404 });

  return NextResponse.json({ lead }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  try {
    const body = (await request.json()) as UpdateBody;

    const updated = await updateLead(id, {
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      address: body.address,
      message: body.message,
      source: body.source,
      status: body.status,
      assignedTo: body.assignedTo,
      notes: body.notes,
    });

    if (!updated) {
      return NextResponse.json({ error: "Lead không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ lead: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/super-admin/leads/[id]:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi cập nhật lead" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });

  const deleted = await deleteLead(id);
  if (!deleted) return NextResponse.json({ error: "Lead không tồn tại" }, { status: 404 });

  return NextResponse.json({ message: "Lead đã được xóa" }, { status: 200 });
}

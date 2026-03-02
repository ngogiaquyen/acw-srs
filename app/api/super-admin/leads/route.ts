import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { createLead, getLeads } from "@/lib/db/leads";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") return null;
  return auth.user;
}

interface LeadBody {
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

export async function GET() {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const leads = await getLeads();
  return NextResponse.json({ leads }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureSuperAdmin();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = (await request.json()) as LeadBody;

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc (name, email)" }, { status: 400 });
    }

    const lead = await createLead({
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

    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/super-admin/leads:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo lead" }, { status: 500 });
  }
}

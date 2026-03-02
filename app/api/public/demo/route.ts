import { NextResponse } from "next/server";
import { createLead } from "@/lib/db/leads";

interface DemoBody {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DemoBody;

    if (!body.name || !body.email) {
      return NextResponse.json({ error: "Thiếu dữ liệu bắt buộc (name, email)" }, { status: 400 });
    }

    const lead = await createLead({
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      company: body.company || null,
      address: body.address || null,
      message: body.message || null,
      source: "website",
      status: "new",
    });

    return NextResponse.json({ message: "Đã gửi yêu cầu demo thành công", lead }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/public/demo:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi gửi yêu cầu demo" }, { status: 500 });
  }
}

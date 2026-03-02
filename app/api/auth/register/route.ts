import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth/password";
import { createUser, findUserByEmail, type UserRole } from "@/lib/db/users";

interface RegisterBody {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  tenantId?: number | null;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RegisterBody;

    const { email, password, name, phone, role = "SUPER_ADMIN", tenantId = null } =
      body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "email, password, name là bắt buộc" },
        { status: 400 },
      );
    }

    const existing = await findUserByEmail(email);

    if (existing) {
      return NextResponse.json(
        { error: "Email đã được sử dụng" },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await createUser({
      email,
      passwordHash,
      role,
      tenantId,
      name,
      phone: phone ?? null,
    });

    const { password_hash, ...safeUser } = user;

    return NextResponse.json(
      {
        user: safeUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in /api/auth/register:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng ký" },
      { status: 500 },
    );
  }
}


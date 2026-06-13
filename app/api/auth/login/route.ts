import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth/password";
import { findUserByEmail } from "@/lib/db/users";
import { signAuthToken } from "@/lib/auth/jwt";

interface LoginBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LoginBody;
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "email và password là bắt buộc" },
        { status: 400 },
      );
    }

    const user = await findUserByEmail(email);

    if (!user || !user.is_active || (user.role === "TENANT_ADMIN" && !user.tenant_id)) {
      return NextResponse.json(
        { error: "Tài khoản hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    const passwordOk = await verifyPassword(password, user.password_hash);

    if (!passwordOk) {
      return NextResponse.json(
        { error: "Tài khoản hoặc mật khẩu không đúng" },
        { status: 401 },
      );
    }

    const token = await signAuthToken(user);

    const { password_hash, ...safeUser } = user;

    const response = NextResponse.json(
      {
        user: safeUser,
      },
      { status: 200 },
    );

    const isProd = process.env.NODE_ENV === "production";

    // Set cookie sử dụng NextResponse.cookies
    response.cookies.set({
      name: "auth_token",
      value: token,
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: isProd,
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
    });

    // Log để debug
    console.log("[LOGIN] Token created and cookie set for user:", safeUser.email, "Role:", safeUser.role);
    console.log("[LOGIN] Token length:", token.length);
    console.log("[LOGIN] Cookie will be set with maxAge:", 7 * 24 * 60 * 60);

    return response;
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi đăng nhập" },
      { status: 500 },
    );
  }
}


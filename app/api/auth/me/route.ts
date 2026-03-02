import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function GET(request: Request) {
  try {
    const header = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") ?? "";

    let token: string | null = null;

    if (header?.startsWith("Bearer ")) {
      token = header.slice("Bearer ".length);
    } else {
      const cookies = cookieHeader.split(";").map((c) => c.trim());
      const tokenCookie = cookies.find((c) => c.startsWith("auth_token="));
      if (tokenCookie) {
        token = tokenCookie.split("=")[1] ?? null;
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Chưa đăng nhập" },
        { status: 401 },
      );
    }

    const payload = await verifyAuthToken(token);

    return NextResponse.json(
      {
        user: payload,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    return NextResponse.json(
      { error: "Token không hợp lệ hoặc đã hết hạn" },
      { status: 401 },
    );
  }
}


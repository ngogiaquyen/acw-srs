import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Đăng xuất thành công" },
    { status: 200 },
  );

  response.headers.append(
    "Set-Cookie",
    ["auth_token=", "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"].join(
      "; ",
    ),
  );

  return response;
}


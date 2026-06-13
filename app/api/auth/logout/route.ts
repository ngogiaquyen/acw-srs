import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url), 303);

  response.headers.append(
    "Set-Cookie",
    ["auth_token=", "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0"].join(
      "; ",
    ),
  );

  return response;
}



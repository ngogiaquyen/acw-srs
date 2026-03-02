import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAuthToken } from "@/lib/auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua middleware cho login page
  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/super-admin") || pathname.startsWith("/tenant")) {
    const token = request.cookies.get("auth_token")?.value;

    console.log("[MIDDLEWARE] Path:", pathname);
    console.log("[MIDDLEWARE] Token exists:", !!token);
    console.log("[MIDDLEWARE] All cookies:", request.cookies.getAll().map(c => c.name));

    if (!token) {
      console.log("[MIDDLEWARE] No token, redirecting to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const payload = await verifyAuthToken(token);
      console.log("[MIDDLEWARE] Token verified, role:", payload.role);

      if (pathname.startsWith("/super-admin") && payload.role !== "SUPER_ADMIN") {
        console.log("[MIDDLEWARE] Wrong role for super-admin, redirecting to /");
        return NextResponse.redirect(new URL("/", request.url));
      }

      if (pathname.startsWith("/tenant") && payload.role !== "TENANT_ADMIN") {
        console.log("[MIDDLEWARE] Wrong role for tenant, redirecting to /");
        return NextResponse.redirect(new URL("/", request.url));
      }

      console.log("[MIDDLEWARE] Access granted");
      return NextResponse.next();
    } catch (error) {
      console.error("[MIDDLEWARE] Token verification failed:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/super-admin/:path*", "/tenant/:path*"],
};

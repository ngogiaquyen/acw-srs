import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { AuthTokenPayload } from "./jwt";
import { verifyAuthToken } from "./jwt";

export async function getAuthTokenFromCookies(): Promise<string | null> {
  const store = await cookies();
  const token = store.get("auth_token");
  return token?.value ?? null;
}

export async function getCurrentUserFromCookies():
  | Promise<{ isAuthenticated: true; user: AuthTokenPayload }>
  | Promise<{ isAuthenticated: false; user: null }> {
  const token = await getAuthTokenFromCookies();

  if (!token) {
    return { isAuthenticated: false, user: null };
  }

  try {
    const payload = await verifyAuthToken(token);
    return { isAuthenticated: true, user: payload };
  } catch {
    return { isAuthenticated: false, user: null };
  }
}

export function resolveTenantAccess(
  user: AuthTokenPayload,
  tenantIdParam?: string | null,
):
  | { ok: true; tenantId?: number }
  | { ok: false; response: NextResponse } {
  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
          { status: 400 },
        ),
      };
    }

    return {
      ok: true,
      tenantId: user.tenantId,
    };
  }

  if (user.role === "SUPER_ADMIN") {
    if (!tenantIdParam) {
      return { ok: true };
    }

    const tenantId = Number.parseInt(tenantIdParam, 10);
    if (Number.isNaN(tenantId)) {
      return {
        ok: false,
        response: NextResponse.json({ error: "tenant_id không hợp lệ" }, { status: 400 }),
      };
    }

    return {
      ok: true,
      tenantId,
    };
  }

  return {
    ok: false,
    response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
  };
}
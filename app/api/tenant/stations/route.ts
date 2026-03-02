import { NextResponse } from "next/server";
import {
  getCurrentUserFromCookies,
  resolveTenantAccess,
} from "@/lib/auth/middleware";
import {
  createStation,
  getAllStations,
  getStationsByTenantId,
  type CreateStationInput,
} from "@/lib/db/stations";
import {
  validateStationPayload,
  type StationPayload,
} from "@/lib/utils/validation";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated) {
    return null;
  }

  return auth.user;
}

export async function GET(request: Request) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const access = resolveTenantAccess(user, url.searchParams.get("tenant_id"));

  if (!access.ok) {
    return access.response;
  }

  if (access.tenantId !== undefined) {
    const stations = await getStationsByTenantId(access.tenantId);
    return NextResponse.json({ stations }, { status: 200 });
  }

  const stations = await getAllStations();
  return NextResponse.json({ stations }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as StationPayload & {
      tenantId?: number;
    };

    const { valid, errors } = validateStationPayload(body, { isCreate: true });

    if (!valid) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: errors },
        { status: 400 },
      );
    }

    const access = resolveTenantAccess(
      user,
      user.role === "SUPER_ADMIN" ? String(body.tenantId ?? "") : null,
    );

    if (!access.ok || access.tenantId === undefined) {
      if (!access.ok) {
        return access.response;
      }

      return NextResponse.json(
        { error: "tenantId là bắt buộc khi tạo trạm với Super Admin" },
        { status: 400 },
      );
    }

    const input: CreateStationInput = {
      tenantId: access.tenantId,
      name: body.name!,
      address: body.address ?? null,
      latitude: body.latitude ?? null,
      longitude: body.longitude ?? null,
      qrCode: body.qrCode!,
      isActive: body.isActive ?? true,
    };

    const station = await createStation(input);

    return NextResponse.json({ station }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tenant/stations:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo trạm" },
      { status: 500 },
    );
  }
}

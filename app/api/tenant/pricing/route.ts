import { NextResponse } from "next/server";
import {
  getCurrentUserFromCookies,
  resolveTenantAccess,
} from "@/lib/auth/middleware";
import {
  createPricingPackage,
  getAllPricingPackages,
  getPricingPackagesByTenantId,
  type CreatePricingPackageInput,
} from "@/lib/db/pricing";
import { getStationByIdAndTenantId } from "@/lib/db/stations";
import {
  validatePricingPayload,
  type PricingPayload,
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
  const stationIdParam = url.searchParams.get("station_id");

  const stationId = stationIdParam ? Number.parseInt(stationIdParam, 10) : undefined;
  if (stationIdParam && Number.isNaN(stationId)) {
    return NextResponse.json({ error: "station_id không hợp lệ" }, { status: 400 });
  }

  const access = resolveTenantAccess(user, url.searchParams.get("tenant_id"));
  if (!access.ok) {
    return access.response;
  }

  if (access.tenantId !== undefined) {
    const pricingPackages = await getPricingPackagesByTenantId(access.tenantId, {
      stationId,
    });
    return NextResponse.json({ pricingPackages }, { status: 200 });
  }

  const pricingPackages = await getAllPricingPackages({ stationId });
  return NextResponse.json({ pricingPackages }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as PricingPayload & { tenantId?: number };

    const { valid, errors } = validatePricingPayload(body, { isCreate: true });
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
        { error: "tenantId là bắt buộc khi tạo gói giá với Super Admin" },
        { status: 400 },
      );
    }

    const tenantId = access.tenantId;

    if (body.stationId !== undefined && body.stationId !== null) {
      const station = await getStationByIdAndTenantId(body.stationId, tenantId);
      if (!station) {
        return NextResponse.json(
          { error: "stationId không tồn tại hoặc không thuộc tenant" },
          { status: 400 },
        );
      }
    }

    const input: CreatePricingPackageInput = {
      tenantId,
      stationId: body.stationId ?? null,
      name: body.name!,
      price: body.price!,
      durationMinutes: body.durationMinutes!,
      isActive: body.isActive ?? true,
    };

    const pricingPackage = await createPricingPackage(input);

    return NextResponse.json({ pricingPackage }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tenant/pricing:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo gói giá" },
      { status: 500 },
    );
  }
}

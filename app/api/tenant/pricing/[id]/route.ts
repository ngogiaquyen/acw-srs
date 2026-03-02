import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  getPricingPackageById,
  getPricingPackageByIdAndTenantId,
  softDeletePricingPackage,
  updatePricingPackage,
  type UpdatePricingPackageInput,
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

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number.parseInt(params.id, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  let pricingPackage;

  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }
    pricingPackage = await getPricingPackageByIdAndTenantId(id, user.tenantId);
  } else if (user.role === "SUPER_ADMIN") {
    pricingPackage = await getPricingPackageById(id);
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!pricingPackage) {
    return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
  }

  return NextResponse.json({ pricingPackage }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number.parseInt(params.id, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as PricingPayload;

    const { valid, errors } = validatePricingPayload(body, { isCreate: false });

    if (!valid) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: errors },
        { status: 400 },
      );
    }

    let tenantIdForOwnership: number | null = null;

    if (user.role === "TENANT_ADMIN") {
      if (!user.tenantId) {
        return NextResponse.json(
          { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
          { status: 400 },
        );
      }

      const owned = await getPricingPackageByIdAndTenantId(id, user.tenantId);
      if (!owned) {
        return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
      }

      tenantIdForOwnership = user.tenantId;
    } else if (user.role === "SUPER_ADMIN") {
      const pricingPackage = await getPricingPackageById(id);
      if (!pricingPackage) {
        return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
      }

      tenantIdForOwnership = pricingPackage.tenant_id;
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (body.stationId !== undefined && body.stationId !== null) {
      const station = await getStationByIdAndTenantId(body.stationId, tenantIdForOwnership);
      if (!station) {
        return NextResponse.json(
          { error: "stationId không tồn tại hoặc không thuộc tenant" },
          { status: 400 },
        );
      }
    }

    const input: UpdatePricingPackageInput = {
      stationId: body.stationId,
      name: body.name,
      price: body.price,
      durationMinutes: body.durationMinutes,
      isActive: body.isActive,
    };

    const updated = await updatePricingPackage(id, input);

    if (!updated) {
      return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ pricingPackage: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/tenant/pricing/[id]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật gói giá" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number.parseInt(params.id, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }
    const owned = await getPricingPackageByIdAndTenantId(id, user.tenantId);
    if (!owned) {
      return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
    }
  } else if (user.role === "SUPER_ADMIN") {
    const pricingPackage = await getPricingPackageById(id);
    if (!pricingPackage) {
      return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await softDeletePricingPackage(id);

  return NextResponse.json(
    { message: "Gói giá đã được vô hiệu hóa" },
    { status: 200 },
  );
}

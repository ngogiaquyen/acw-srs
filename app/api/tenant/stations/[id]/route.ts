import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  getStationById,
  getStationByIdAndTenantId,
  softDeleteStation,
  updateStation,
  type UpdateStationInput,
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

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  let station;

  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }
    station = await getStationByIdAndTenantId(id, user.tenantId);
  } else if (user.role === "SUPER_ADMIN") {
    station = await getStationById(id);
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!station) {
    return NextResponse.json({ error: "Trạm không tồn tại" }, { status: 404 });
  }

  return NextResponse.json({ station }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as StationPayload;

    const { valid, errors } = validateStationPayload(body, { isCreate: false });

    if (!valid) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: errors },
        { status: 400 },
      );
    }

    // Kiểm tra ownership trước khi update
    if (user.role === "TENANT_ADMIN") {
      if (!user.tenantId) {
        return NextResponse.json(
          { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
          { status: 400 },
        );
      }
      const owned = await getStationByIdAndTenantId(id, user.tenantId);
      if (!owned) {
        return NextResponse.json({ error: "Trạm không tồn tại" }, { status: 404 });
      }
    } else if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const input: UpdateStationInput = {
      name: body.name,
      address: body.address,
      latitude: body.latitude ?? undefined,
      longitude: body.longitude ?? undefined,
      isActive: body.isActive,
    };

    const updated = await updateStation(id, input);

    if (!updated) {
      return NextResponse.json({ error: "Trạm không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ station: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/tenant/stations/[id]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật trạm" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  // Chỉ Tenant Admin của trạm đó hoặc Super Admin mới được xoá (soft delete)
  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }
    const owned = await getStationByIdAndTenantId(id, user.tenantId);
    if (!owned) {
      return NextResponse.json({ error: "Trạm không tồn tại" }, { status: 404 });
    }
  } else if (user.role === "SUPER_ADMIN") {
    const station = await getStationById(id);
    if (!station) {
      return NextResponse.json({ error: "Trạm không tồn tại" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await softDeleteStation(id);

  return NextResponse.json({ message: "Trạm đã được vô hiệu hóa" }, { status: 200 });
}


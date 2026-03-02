import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  getDeviceById,
  getDeviceByIdAndTenantId,
  softDeleteDevice,
  updateDevice,
  type UpdateDeviceInput,
} from "@/lib/db/devices";
import { getStationByIdAndTenantId } from "@/lib/db/stations";
import { validateDevicePayload, type DevicePayload } from "@/lib/utils/validation";

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

  let device;

  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }
    device = await getDeviceByIdAndTenantId(id, user.tenantId);
  } else if (user.role === "SUPER_ADMIN") {
    device = await getDeviceById(id);
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!device) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  return NextResponse.json({ device }, { status: 200 });
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
    const body = (await request.json()) as DevicePayload;

    const { valid, errors } = validateDevicePayload(body, { isCreate: false });
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

      const owned = await getDeviceByIdAndTenantId(id, user.tenantId);
      if (!owned) {
        return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
      }
      tenantIdForOwnership = user.tenantId;
    } else if (user.role === "SUPER_ADMIN") {
      const device = await getDeviceById(id);
      if (!device) {
        return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
      }
      tenantIdForOwnership = device.tenant_id;
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

    const input: UpdateDeviceInput = {
      stationId: body.stationId,
      name: body.name,
      status: body.status,
      firmwareVersion: body.firmwareVersion,
      isActive: body.isActive,
    };

    const updated = await updateDevice(id, input);

    if (!updated) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ device: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/tenant/devices/[id]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật thiết bị" },
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
    const owned = await getDeviceByIdAndTenantId(id, user.tenantId);
    if (!owned) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }
  } else if (user.role === "SUPER_ADMIN") {
    const device = await getDeviceById(id);
    if (!device) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await softDeleteDevice(id);

  return NextResponse.json({ message: "Thiết bị đã được vô hiệu hóa" }, { status: 200 });
}

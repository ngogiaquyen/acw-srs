import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  getDeviceById,
  getDeviceByIdAndTenantId,
  deleteDevice,
  updateDevice,
  type UpdateDeviceInput,
} from "@/lib/db/devices";
import { validateDevicePayload, type DevicePayload } from "@/lib/utils/validation";
import { handleDatabaseError } from "@/lib/utils/db-errors";

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

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
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

    const existingDevice = await getDeviceById(id);
    if (!existingDevice) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    if (user.role === "TENANT_ADMIN") {
      if (!user.tenantId) {
        return NextResponse.json(
          { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
          { status: 400 },
        );
      }

      if (existingDevice.tenant_id !== user.tenantId) {
        return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
      }

      const { getTenantById } = await import("@/lib/db/tenants");
      const tenant = await getTenantById(user.tenantId);
      if (tenant && tenant.subscription_status === "expired" && !tenant.allow_expired_access) {
        return NextResponse.json(
          { error: "Tài khoản của bạn đã hết hạn. Vui lòng gia hạn để cập nhật thiết bị." },
          { status: 403 }
        );
      }
    } else if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const input: UpdateDeviceInput = {
      deviceId: body.deviceId,
      name: body.name,
      paymentCode: body.paymentCode,
      webUsername: body.webUsername,
      webPassword: body.webPassword,
      firmwareVersion: body.firmwareVersion,
      isActive: body.isActive,
      pricePerMinute: body.pricePerMinute,
    };

    let updated;
    try {
      updated = await updateDevice(id, input);
    } catch (err: any) {
      const dbErrorResponse = handleDatabaseError(err);
      if (dbErrorResponse) return dbErrorResponse;
      throw err;
    }

    if (!updated) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    // Auto-queue config command on credentials change
    if (
      updated.web_username !== existingDevice.web_username ||
      updated.web_password !== existingDevice.web_password
    ) {
      try {
        const { createDeviceCommand } = await import("@/lib/db/device-commands");
        await createDeviceCommand({
          deviceId: updated.id,
          commandType: "config",
          commandData: {
            webUsername: updated.web_username,
            webPassword: updated.web_password,
          },
        });
      } catch (err) {
        console.error("Failed to auto-queue config command on device update:", err);
      }
    }

    return NextResponse.json({ device: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error in PUT /api/tenant/devices/[id]:", error);
    const dbErrorResponse = handleDatabaseError(error);
    if (dbErrorResponse) return dbErrorResponse;

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

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
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

    const { getTenantById } = await import("@/lib/db/tenants");
    const tenant = await getTenantById(user.tenantId);
    if (tenant && tenant.subscription_status === "expired" && !tenant.allow_expired_access) {
      return NextResponse.json(
        { error: "Tài khoản của bạn đã hết hạn. Vui lòng gia hạn để xóa thiết bị." },
        { status: 403 }
      );
    }
  } else if (user.role === "SUPER_ADMIN") {
    const device = await getDeviceById(id);
    if (!device) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteDevice(id);

  return NextResponse.json({ message: "Đã xóa thiết bị" }, { status: 200 });
}

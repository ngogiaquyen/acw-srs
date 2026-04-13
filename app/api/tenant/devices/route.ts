import { NextResponse } from "next/server";
import {
  getCurrentUserFromCookies,
  resolveTenantAccess,
} from "@/lib/auth/middleware";
import {
  createDevice,
  getAllDevices,
  getDevicesByTenantId,
  getDeviceByDeviceId,
  type CreateDeviceInput,
} from "@/lib/db/devices";
import { findTenantAdminByTenantId } from "@/lib/db/users";
import { validateDevicePayload, type DevicePayload } from "@/lib/utils/validation";

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
    const devices = await getDevicesByTenantId(access.tenantId);
    return NextResponse.json({ devices }, { status: 200 });
  }

  const devices = await getAllDevices();
  return NextResponse.json({ devices }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureAuthenticated();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (user.role === "TENANT_ADMIN") {
    return NextResponse.json(
      { error: "Tenant không có quyền tạo thiết bị. Vui lòng liên hệ Super Admin." },
      { status: 403 },
    );
  }

  try {
    const body = (await request.json()) as DevicePayload & {
      tenantId?: number;
    };

    const { valid, errors } = validateDevicePayload(body, { isCreate: true });

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
        { error: "tenantId là bắt buộc khi tạo thiết bị với Super Admin" },
        { status: 400 },
      );
    }

    const tenantId = access.tenantId;

    const existed = await getDeviceByDeviceId(body.deviceId!);
    if (existed) {
      return NextResponse.json({ error: "deviceId đã tồn tại" }, { status: 409 });
    }

    const input: CreateDeviceInput = {
      tenantId,
      deviceId: body.deviceId!,
      name: body.name!,
      paymentCode: body.paymentCode ?? null,
      webUsername: body.webUsername ?? (await findTenantAdminByTenantId(tenantId))?.email ?? null,
      webPassword: body.webPassword ?? null,
      firmwareVersion: body.firmwareVersion ?? null,
      isActive: body.isActive ?? true,
      pricePerMinute: body.pricePerMinute ?? null,
    };

    const device = await createDevice(input);

    return NextResponse.json({ device }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tenant/devices:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo thiết bị" },
      { status: 500 },
    );
  }
}

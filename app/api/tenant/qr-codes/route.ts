import { NextResponse } from "next/server";
import {
  getCurrentUserFromCookies,
  resolveTenantAccess,
} from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";
import {
  createQrCode,
  getAllQrCodes,
  getQrCodeByCode,
  getQrCodesByTenantId,
} from "@/lib/db/qr-codes";
import { getStationByIdAndTenantId } from "@/lib/db/stations";
import { validateQrCodePayload, type QrCodePayload } from "@/lib/utils/validation";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) return null;
  return auth.user;
}

export async function GET(request: Request) {
  const user = await ensureAuthenticated();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(request.url);
  const access = resolveTenantAccess(user, url.searchParams.get("tenant_id"));
  if (!access.ok) return access.response;

  if (access.tenantId !== undefined) {
    const qrCodes = await getQrCodesByTenantId(access.tenantId);
    return NextResponse.json({ qrCodes }, { status: 200 });
  }

  const qrCodes = await getAllQrCodes();
  return NextResponse.json({ qrCodes }, { status: 200 });
}

export async function POST(request: Request) {
  const user = await ensureAuthenticated();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await request.json()) as QrCodePayload & { tenantId?: number };

    const { valid, errors } = validateQrCodePayload(body, { isCreate: true });
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
      if (!access.ok) return access.response;
      return NextResponse.json(
        { error: "tenantId là bắt buộc khi tạo QR với Super Admin" },
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

    if (body.deviceId !== undefined && body.deviceId !== null) {
      const device = await getDeviceByIdAndTenantId(body.deviceId, tenantId);
      if (!device) {
        return NextResponse.json(
          { error: "deviceId không tồn tại hoặc không thuộc tenant" },
          { status: 400 },
        );
      }
    }

    const existed = await getQrCodeByCode(body.code!);
    if (existed) {
      return NextResponse.json({ error: "code đã tồn tại" }, { status: 409 });
    }

    const qrCode = await createQrCode({
      tenantId,
      stationId: body.stationId ?? null,
      deviceId: body.deviceId ?? null,
      code: body.code!,
      label: body.label ?? null,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ qrCode }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tenant/qr-codes:", error);
    return NextResponse.json({ error: "Đã xảy ra lỗi khi tạo QR code" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  deactivateTenant,
  getTenantById,
  updateTenant,
  type UpdateTenantInput,
} from "@/lib/db/tenants";
import {
  validateTenantPayload,
  type TenantPayload,
} from "@/lib/utils/validation";

async function ensureSuperAdmin() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
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
  const currentUser = await ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const tenant = await getTenantById(id);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant không tồn tại" }, { status: 404 });
  }

  return NextResponse.json({ tenant }, { status: 200 });
}

export async function PUT(request: Request, { params }: Params) {
  const currentUser = await ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  try {
    const body = (await request.json()) as TenantPayload;

    const { valid, errors } = validateTenantPayload(body, { isCreate: false });

    if (!valid) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: errors },
        { status: 400 },
      );
    }

    const input: UpdateTenantInput = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      licenseMaxDevices: body.licenseMaxDevices,
      subscriptionStatus: body.subscriptionStatus,
      subscriptionStartDate: body.subscriptionStartDate
        ? new Date(body.subscriptionStartDate)
        : undefined,
      subscriptionEndDate: body.subscriptionEndDate
        ? new Date(body.subscriptionEndDate)
        : undefined,
      isActive: body.isActive,
      sepayBankAccount: body.sepayBankAccount,
      sepayBankCode: body.sepayBankCode,
      sepayAccountName: body.sepayAccountName,
      sepayWebhookSecret: body.sepayWebhookSecret,
    };

    const updated = await updateTenant(id, input);

    if (!updated) {
      return NextResponse.json({ error: "Tenant không tồn tại" }, { status: 404 });
    }

    return NextResponse.json({ tenant: updated }, { status: 200 });
  } catch (error) {
    console.error("Error in PUT /api/super-admin/tenants/[id]:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật tenant" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const currentUser = await ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const tenant = await getTenantById(id);

  if (!tenant) {
    return NextResponse.json({ error: "Tenant không tồn tại" }, { status: 404 });
  }

  await deactivateTenant(id);

  return NextResponse.json({ message: "Tenant đã được vô hiệu hóa" }, { status: 200 });
}


import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  createTenant,
  getTenants,
  type CreateTenantInput,
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

export async function GET() {
  const currentUser = await ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tenants = await getTenants();

  return NextResponse.json({ tenants }, { status: 200 });
}

export async function POST(request: Request) {
  const currentUser = await ensureSuperAdmin();

  if (!currentUser) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as TenantPayload;

    const { valid, errors } = validateTenantPayload(body, { isCreate: true });

    if (!valid) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: errors },
        { status: 400 },
      );
    }

    const input: CreateTenantInput = {
      name: body.name!,
      email: body.email!,
      phone: body.phone ?? null,
      address: body.address ?? null,
      licenseMaxDevices: body.licenseMaxDevices,
      subscriptionStatus: body.subscriptionStatus,
      subscriptionStartDate: body.subscriptionStartDate
        ? new Date(body.subscriptionStartDate)
        : null,
      subscriptionEndDate: body.subscriptionEndDate
        ? new Date(body.subscriptionEndDate)
        : null,
      allowExpiredAccess: body.allowExpiredAccess ?? false,
      isActive: body.isActive ?? true,
      sepayBankAccount: body.sepayBankAccount ?? null,
      sepayBankCode: body.sepayBankCode ?? null,
      sepayAccountName: body.sepayAccountName ?? null,
      sepayWebhookSecret: body.sepayWebhookSecret ?? null,
    };

    const tenant = await createTenant(input);

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/super-admin/tenants:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tạo tenant" },
      { status: 500 },
    );
  }
}


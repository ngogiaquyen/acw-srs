import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import {
  deactivateTenant,
  deleteTenant,
  getTenantById,
  updateTenant,
  type UpdateTenantInput,
} from "@/lib/db/tenants";
import {
  validateTenantPayload,
  type TenantPayload,
} from "@/lib/utils/validation";
import { handleDatabaseError } from "@/lib/utils/db-errors";

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

  const { findTenantAdminByTenantId } = await import("@/lib/db/users");
  const admin = await findTenantAdminByTenantId(id);

  return NextResponse.json({
    tenant,
    admin: admin ? { name: admin.name, email: admin.email } : null
  }, { status: 200 });
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
        { error: `Dữ liệu không hợp lệ: ${errors.join("; ")}`, details: errors },
        { status: 400 },
      );
    }

    const { findTenantAdminByTenantId, findUserByEmail, updateOrCreateTenantAdmin } = await import("@/lib/db/users");
    const currentAdmin = await findTenantAdminByTenantId(id);

    // Check if changing email and email is already taken
    if (body.email) {
      if (!currentAdmin || currentAdmin.email !== body.email) {
        const existingUser = await findUserByEmail(body.email);
        if (existingUser) {
          return NextResponse.json(
            { error: "Email này đã được sử dụng bởi một tài khoản khác" },
            { status: 400 },
          );
        }
      }
    }

    if (!currentAdmin && !body.adminPassword) {
      return NextResponse.json(
        { error: "Mật khẩu admin là bắt buộc khi tạo tài khoản quản trị mới" },
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
      allowExpiredAccess: body.allowExpiredAccess,
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

    // Sync admin user details (name, email, and password if provided)
    const adminName = updated.name;
    const adminEmail = updated.email;
    let passwordHash: string | undefined;
    if (body.adminPassword) {
      const { hashPassword } = await import("@/lib/auth/password");
      passwordHash = await hashPassword(body.adminPassword);
    }

    await updateOrCreateTenantAdmin(id, {
      name: adminName,
      email: adminEmail,
      passwordHash,
    });

    return NextResponse.json({ tenant: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error in PUT /api/super-admin/tenants/[id]:", error);
    const dbErrorResponse = handleDatabaseError(error);
    if (dbErrorResponse) return dbErrorResponse;

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

  await deleteTenant(id);

  return NextResponse.json({ message: "Tenant đã được xóa khỏi hệ thống" }, { status: 200 });
}


import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getTenantById, updateTenant, type UpdateTenantInput } from "@/lib/db/tenants";

interface SePayConfigPayload {
  sepayBankAccount?: string | null;
  sepayBankCode?: string | null;
  sepayAccountName?: string | null;
  sepayWebhookSecret?: string | null;
}

export async function GET() {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const tenant = await getTenantById(auth.user.tenantId);

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    // Only return SePay configuration (not all tenant data)
    return NextResponse.json(
      {
        sepayBankAccount: tenant.sepay_bank_account,
        sepayBankCode: tenant.sepay_bank_code,
        sepayAccountName: tenant.sepay_account_name,
        sepayWebhookSecret: tenant.sepay_webhook_secret,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET /api/tenant/settings:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi lấy thông tin cấu hình" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as SePayConfigPayload;

    const updateInput: UpdateTenantInput = {
      sepayBankAccount: body.sepayBankAccount || null,
      sepayBankCode: body.sepayBankCode || null,
      sepayAccountName: body.sepayAccountName || null,
      sepayWebhookSecret: body.sepayWebhookSecret || null,
    };

    const updated = await updateTenant(auth.user.tenantId, updateInput);

    if (!updated) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Cập nhật cấu hình SePay thành công",
        sepayBankAccount: updated.sepay_bank_account,
        sepayBankCode: updated.sepay_bank_code,
        sepayAccountName: updated.sepay_account_name,
        sepayWebhookSecret: updated.sepay_webhook_secret,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PUT /api/tenant/settings:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi cập nhật cấu hình" },
      { status: 500 },
    );
  }
}

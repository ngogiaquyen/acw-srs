import { NextResponse } from "next/server";
import { getDeviceByDeviceId } from "@/lib/db/devices";
import { getTenantById } from "@/lib/db/tenants";
import { initPayment, type TenantSePayConfig } from "@/lib/payment/sepay";

interface InitPaymentPayload {
  deviceId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InitPaymentPayload;

    if (!body.deviceId) {
      return NextResponse.json(
        { error: "deviceId là bắt buộc" },
        { status: 400 },
      );
    }

    const device = await getDeviceByDeviceId(body.deviceId);
    if (!device || !device.is_active) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    if (!device.price_per_minute || device.price_per_minute <= 0) {
      return NextResponse.json(
        { error: "Thiết bị chưa thiết lập giá/phút" },
        { status: 400 },
      );
    }

    const tenant = await getTenantById(device.tenant_id);
    if (tenant && !tenant.allow_expired_access && tenant.subscription_status === "expired") {
      return NextResponse.json({ error: "Tenant đã hết hạn sử dụng" }, { status: 403 });
    }

    let tenantSePayConfig: TenantSePayConfig | null = null;

    if (tenant?.sepay_bank_account && tenant?.sepay_bank_code) {
      tenantSePayConfig = {
        bankAccount: tenant.sepay_bank_account,
        bankCode: tenant.sepay_bank_code,
        accountName: tenant.sepay_account_name || "",
      };
    }

    const transferContent =
      device.payment_code ||
      `DV${device.tenant_id.toString().padStart(3, "0")}${device.device_id}`;

    const payment = initPayment(
      {
        amount: 0,
        transferContent,
      },
      tenantSePayConfig,
    );

    return NextResponse.json(
      {
        paymentUrl: payment.paymentUrl,
        // Static QR does not represent a payment session; keep this field for backward compatibility.
        paymentTransactionId: payment.paymentTransactionId,
        transferContent,
        paymentCode: transferContent,
        deviceId: device.device_id,
        pricePerMinute: device.price_per_minute,
        mode: "static_qr",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in POST /api/public/payment/init:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi khởi tạo thanh toán" },
      { status: 500 },
    );
  }
}

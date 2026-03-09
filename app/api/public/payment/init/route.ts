import { NextResponse } from "next/server";
import { getDeviceByDeviceId } from "@/lib/db/devices";
import { getTenantById } from "@/lib/db/tenants";
import { initPayment, type TenantSePayConfig } from "@/lib/payment/sepay";

interface InitPaymentPayload {
  deviceId?: string;
  amount?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InitPaymentPayload;

    if (!body.deviceId || body.amount === undefined) {
      return NextResponse.json(
        { error: "deviceId và amount là bắt buộc" },
        { status: 400 },
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: "Số tiền phải lớn hơn 0" },
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

    const addedMinutes = Math.floor(body.amount / device.price_per_minute);
    if (addedMinutes <= 0) {
      return NextResponse.json(
        { error: "Số tiền không đủ để sử dụng thiết bị" },
        { status: 400 },
      );
    }

    const tenant = await getTenantById(device.tenant_id);
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
        amount: body.amount,
        transferContent,
      },
      tenantSePayConfig,
    );

    return NextResponse.json(
      {
        paymentUrl: payment.paymentUrl,
        paymentTransactionId: payment.paymentTransactionId,
        transferContent,
        paymentCode: transferContent,
        deviceId: device.device_id,
        amount: body.amount,
        addedMinutes,
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

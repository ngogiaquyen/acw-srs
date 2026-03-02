import { NextResponse } from "next/server";
import { getDeviceByDeviceId } from "@/lib/db/devices";
import { getPricingPackageById } from "@/lib/db/pricing";
import { getStationById } from "@/lib/db/stations";
import { createTransaction } from "@/lib/db/transactions";
import { initPayment } from "@/lib/payment/mock";

interface InitPaymentPayload {
  deviceId?: string;
  pricingPackageId?: number;
  paymentMethod?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InitPaymentPayload;

    if (!body.deviceId || !body.pricingPackageId) {
      return NextResponse.json(
        { error: "deviceId và pricingPackageId là bắt buộc" },
        { status: 400 },
      );
    }

    const device = await getDeviceByDeviceId(body.deviceId);
    if (!device || !device.is_active) {
      return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
    }

    if (!device.station_id) {
      return NextResponse.json(
        { error: "Thiết bị chưa được gán station" },
        { status: 400 },
      );
    }

    const station = await getStationById(device.station_id);
    if (!station || !station.is_active) {
      return NextResponse.json({ error: "Station không tồn tại" }, { status: 404 });
    }

    const pricingPackage = await getPricingPackageById(body.pricingPackageId);
    if (!pricingPackage || !pricingPackage.is_active) {
      return NextResponse.json({ error: "Gói giá không tồn tại" }, { status: 404 });
    }

    if (pricingPackage.tenant_id !== device.tenant_id) {
      return NextResponse.json(
        { error: "Gói giá không thuộc tenant của thiết bị" },
        { status: 400 },
      );
    }

    if (
      pricingPackage.station_id !== null &&
      pricingPackage.station_id !== device.station_id
    ) {
      return NextResponse.json(
        { error: "Gói giá không áp dụng cho station của thiết bị" },
        { status: 400 },
      );
    }

    const qrCode = `${body.deviceId}-${Date.now()}`;

    const transaction = await createTransaction({
      tenantId: device.tenant_id,
      stationId: device.station_id,
      deviceId: device.id,
      pricingPackageId: pricingPackage.id,
      qrCode,
      amount: pricingPackage.price,
      durationMinutes: pricingPackage.duration_minutes,
      status: "pending",
      paymentMethod: body.paymentMethod ?? "mock",
      paymentTransactionId: null,
    });

    const payment = initPayment({
      transactionId: transaction.id,
      amount: transaction.amount,
    });

    return NextResponse.json(
      {
        transaction,
        paymentUrl: payment.paymentUrl,
        paymentTransactionId: payment.paymentTransactionId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/public/payment/init:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi khởi tạo thanh toán" },
      { status: 500 },
    );
  }
}

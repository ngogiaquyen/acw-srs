import { NextResponse } from "next/server";
import { getQrCodeByCode } from "@/lib/db/qr-codes";

interface Params {
  params: {
    code: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const qrCode = await getQrCodeByCode(params.code);

  if (!qrCode || !qrCode.is_active) {
    return NextResponse.json({ error: "QR code không tồn tại" }, { status: 404 });
  }

  return NextResponse.json(
    {
      qrCode: {
        id: qrCode.id,
        code: qrCode.code,
        tenantId: qrCode.tenant_id,
        stationId: qrCode.station_id,
        deviceId: qrCode.device_id,
        label: qrCode.label,
      },
    },
    { status: 200 },
  );
}

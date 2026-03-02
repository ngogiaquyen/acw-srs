import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getQrCodeById, getQrCodeByIdAndTenantId } from "@/lib/db/qr-codes";

async function ensureAuthenticated() {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) return null;
  return auth.user;
}

interface Params {
  params: {
    id: string;
  };
}

export async function GET(_request: Request, { params }: Params) {
  const user = await ensureAuthenticated();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number.parseInt(params.id, 10);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  let qrCode;

  if (user.role === "TENANT_ADMIN") {
    if (!user.tenantId) {
      return NextResponse.json(
        { error: "Tài khoản tenant không hợp lệ (không có tenantId)" },
        { status: 400 },
      );
    }

    qrCode = await getQrCodeByIdAndTenantId(id, user.tenantId);
  } else if (user.role === "SUPER_ADMIN") {
    qrCode = await getQrCodeById(id);
  } else {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!qrCode) {
    return NextResponse.json({ error: "QR code không tồn tại" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const publicQrUrl = `${appUrl}/api/public/qr/${qrCode.code}`;

  const dataUrl = await QRCode.toDataURL(publicQrUrl, {
    width: 512,
    margin: 2,
  });

  return NextResponse.json(
    {
      qrCode,
      format: "png-base64",
      dataUrl,
      publicQrUrl,
    },
    { status: 200 },
  );
}

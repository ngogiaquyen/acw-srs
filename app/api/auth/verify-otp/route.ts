import { NextResponse } from "next/server";
import { findValidOTP } from "@/lib/db/password-reset";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Thiếu email hoặc mã xác thực" }, { status: 400 });
    }

    const resetRecord = await findValidOTP(email, otp);

    if (!resetRecord) {
      return NextResponse.json({ error: "Mã xác thực không hợp lệ hoặc đã hết hạn" }, { status: 400 });
    }

    return NextResponse.json({ message: "Xác thực thành công", success: true });

  } catch (error) {
    console.error("[VERIFY_OTP_API]", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi xác thực OTP" }, { status: 500 });
  }
}

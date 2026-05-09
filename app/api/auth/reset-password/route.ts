import { NextResponse } from "next/server";
import { findValidOTP, markTokenAsUsed } from "@/lib/db/password-reset";
import { updateUserPassword } from "@/lib/db/users";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { email, otp, password } = await request.json();

    if (!email || !otp || !password) {
      return NextResponse.json({ error: "Thiếu thông tin email, mã xác thực hoặc mật khẩu mới" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Mật khẩu phải có ít nhất 6 ký tự" }, { status: 400 });
    }

    // Kiểm tra OTP có hợp lệ không
    const resetRecord = await findValidOTP(email, otp);

    if (!resetRecord) {
      return NextResponse.json({ error: "Mã xác thực không hợp lệ hoặc đã hết hạn" }, { status: 400 });
    }

    // Băm mật khẩu mới
    const passwordHash = await bcrypt.hash(password, 10);

    // Cập nhật mật khẩu
    const success = await updateUserPassword(resetRecord.email, passwordHash);

    if (!success) {
      return NextResponse.json({ error: "Không thể cập nhật mật khẩu" }, { status: 500 });
    }

    // Đánh dấu token đã sử dụng
    await markTokenAsUsed(resetRecord.id);

    return NextResponse.json({ message: "Mật khẩu của bạn đã được cập nhật thành công!" });

  } catch (error) {
    console.error("[RESET_PASSWORD_API]", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi đặt lại mật khẩu" }, { status: 500 });
  }
}

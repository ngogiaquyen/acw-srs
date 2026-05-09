import { NextResponse } from "next/server";
import { findUserByEmail } from "@/lib/db/users";
import { createPasswordResetToken, invalidateAllTokensForEmail } from "@/lib/db/password-reset";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email là bắt buộc" }, { status: 400 });
    }

    const user = await findUserByEmail(email);

    // Vì lý do bảo mật, chúng ta không nên báo email không tồn tại
    // Nhưng với hệ thống nội bộ/đồ án, báo lỗi để dễ debug cũng ok.
    if (!user) {
      return NextResponse.json({ 
        message: "Nếu email tồn tại trong hệ thống, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu." 
      });
    }

    // Vô hiệu hóa các token cũ
    await invalidateAllTokensForEmail(email);

    // Tạo mã OTP 4 số ngẫu nhiên
    const token = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 phút

    await createPasswordResetToken(email, token, expiresAt);

    // GIẢ LẬP GỬI EMAIL: In ra console để demo
    const resetUrl = `${new URL(request.url).origin}/reset-password?token=${token}`;
    console.log("==========================================");
    console.log("YÊU CẦU QUÊN MẬT KHẨU CHO EMAIL:", email);
    console.log("TOKEN:", token);
    console.log("LINK ĐẶT LẠI MẬT KHẨU:", resetUrl);
    console.log("==========================================");

    // Trả về cả token trong response để demo cho nhanh (nếu cần)
    return NextResponse.json({ 
      message: "Yêu cầu đã được ghi nhận. Vui lòng kiểm tra email (hoặc console server) để lấy link đặt lại mật khẩu.",
      demo_token: token // Chỉ dùng cho mục đích demo/đồ án
    });

  } catch (error) {
    console.error("[FORGOT_PASSWORD_API]", error);
    return NextResponse.json({ error: "Có lỗi xảy ra khi xử lý yêu cầu" }, { status: 500 });
  }
}

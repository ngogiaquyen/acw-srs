import { NextResponse } from "next/server";
import {
  getTransactionById,
  updateTransaction,
  updateTransactionStatus,
} from "@/lib/db/transactions";
import { verifyPaymentCallback } from "@/lib/payment/mock";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const verified = verifyPaymentCallback({
      transactionId: searchParams.get("transaction_id"),
      status: searchParams.get("status"),
      paymentTransactionId: searchParams.get("payment_transaction_id"),
    });

    if (!verified.valid || !verified.transactionId) {
      return NextResponse.json(
        { error: "Callback không hợp lệ" },
        { status: 400 },
      );
    }

    const transaction = await getTransactionById(verified.transactionId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction không tồn tại" },
        { status: 404 },
      );
    }

    await updateTransaction(transaction.id, {
      paymentTransactionId: verified.paymentTransactionId,
    });

    if (verified.success) {
      const updated = await updateTransactionStatus(transaction.id, "completed");
      return NextResponse.json(
        { message: "Thanh toán thành công", transaction: updated },
        { status: 200 },
      );
    }

    const updated = await updateTransactionStatus(transaction.id, "failed");

    return NextResponse.json(
      { message: "Thanh toán thất bại", transaction: updated },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in GET /api/public/payment/callback:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý callback" },
      { status: 500 },
    );
  }
}

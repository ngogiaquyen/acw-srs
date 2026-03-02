import crypto from "crypto";

interface InitPaymentInput {
  transactionId: number;
  amount: number;
}

interface VerifyCallbackInput {
  transactionId?: string | null;
  status?: string | null;
  paymentTransactionId?: string | null;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export function initPayment(input: InitPaymentInput): {
  paymentUrl: string;
  paymentTransactionId: string;
} {
  const paymentTransactionId = `MOCK-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const baseUrl = getAppUrl();

  const paymentUrl = `${baseUrl}/api/public/payment/callback?transaction_id=${input.transactionId}&status=success&payment_transaction_id=${paymentTransactionId}&amount=${input.amount}`;

  return { paymentUrl, paymentTransactionId };
}

export function verifyPaymentCallback(input: VerifyCallbackInput): {
  valid: boolean;
  success: boolean;
  transactionId: number | null;
  paymentTransactionId: string | null;
} {
  const transactionId = input.transactionId
    ? Number.parseInt(input.transactionId, 10)
    : NaN;

  if (Number.isNaN(transactionId) || !input.status) {
    return {
      valid: false,
      success: false,
      transactionId: null,
      paymentTransactionId: null,
    };
  }

  return {
    valid: true,
    success: input.status.toLowerCase() === "success",
    transactionId,
    paymentTransactionId: input.paymentTransactionId ?? null,
  };
}

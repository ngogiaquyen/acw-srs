interface InitPaymentInput {
  amount: number;
  transferContent?: string;
}

export interface TenantSePayConfig {
  bankAccount: string;
  bankCode: string;
  accountName: string;
}

interface VerifyCallbackInput {
  headers?: Headers;
  body?: unknown;
  transactionId?: string | null;
  status?: string | null;
  paymentTransactionId?: string | null;
}

interface SePayWebhookBody {
  id?: string | number;
  transferType?: string;
  transferAmount?: string | number;
  content?: string;
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

function getSePayQrBaseUrl() {
  return process.env.SEPAY_QR_BASE_URL || "https://qr.sepay.vn/img";
}

export function initPayment(
  input: InitPaymentInput,
  tenantConfig: TenantSePayConfig | null,
): {
  paymentUrl: string;
  paymentTransactionId: string;
} {
  if (!tenantConfig?.bankAccount || !tenantConfig?.bankCode) {
    return {
      paymentUrl: `${getAppUrl()}/payment-config-missing`,
      paymentTransactionId: "SEPAY-CONFIG-MISSING",
    };
  }

  const description = input.transferContent || "PAYMENT";

  const query = new URLSearchParams({
    acc: tenantConfig.bankAccount,
    bank: tenantConfig.bankCode,
    amount: String(input.amount),
    des: description,
  });

  if (tenantConfig.accountName) {
    query.set("name", tenantConfig.accountName);
  }

  return {
    paymentUrl: `${getSePayQrBaseUrl()}?${query.toString()}`,
    paymentTransactionId: `SEPAY-STATIC-${Date.now()}`,
  };
}

export function verifyPaymentCallback(input: VerifyCallbackInput, webhookSecret?: string | null): {
  valid: boolean;
  success: boolean;
  transactionId: number | null;
  paymentTransactionId: string | null;
} {
  if (input.body && typeof input.body === "object") {
    const headerToken =
      input.headers?.get("x-sepay-token") || input.headers?.get("authorization");

    if (webhookSecret && (!headerToken || !headerToken.includes(webhookSecret))) {
      return {
        valid: false,
        success: false,
        transactionId: null,
        paymentTransactionId: null,
      };
    }

    const payload = input.body as SePayWebhookBody;
    const transferType = (payload.transferType || "").toLowerCase();
    const amount = Number(payload.transferAmount || 0);

    return {
      valid: true,
      success: transferType !== "out" && amount > 0,
      transactionId: null,
      paymentTransactionId: payload.id ? String(payload.id) : null,
    };
  }

  return {
    valid: false,
    success: false,
    transactionId: null,
    paymentTransactionId: input.paymentTransactionId ?? null,
  };
}

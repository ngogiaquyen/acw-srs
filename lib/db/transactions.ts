import { pool } from "./connection";

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface TransactionRecord {
  id: number;
  tenant_id: number;
  station_id: number;
  device_id: number;
  pricing_package_id: number;
  qr_code: string;
  amount: number;
  duration_minutes: number;
  status: TransactionStatus;
  payment_method: string | null;
  payment_transaction_id: string | null;
  started_at: Date | null;
  ended_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTransactionInput {
  tenantId: number;
  stationId: number;
  deviceId: number;
  pricingPackageId: number;
  qrCode: string;
  amount: number;
  durationMinutes: number;
  status?: TransactionStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
}

export interface UpdateTransactionInput {
  status?: TransactionStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
}

export async function getTransactionsByTenantId(
  tenantId: number,
  options?: { stationId?: number; deviceId?: number; status?: TransactionStatus },
): Promise<TransactionRecord[]> {
  const whereClauses = ["tenant_id = ?"];
  const values: unknown[] = [tenantId];

  if (options?.stationId !== undefined) {
    whereClauses.push("station_id = ?");
    values.push(options.stationId);
  }

  if (options?.deviceId !== undefined) {
    whereClauses.push("device_id = ?");
    values.push(options.deviceId);
  }

  if (options?.status !== undefined) {
    whereClauses.push("status = ?");
    values.push(options.status);
  }

  const [rows] = await pool.query(
    `SELECT * FROM transactions WHERE ${whereClauses.join(" AND ")} ORDER BY created_at DESC`,
    values,
  );

  return rows as TransactionRecord[];
}

export async function getTransactionById(
  id: number,
): Promise<TransactionRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE id = ? LIMIT 1",
    [id],
  );

  const result = rows as TransactionRecord[];
  return result[0] ?? null;
}

export async function getTransactionByPaymentTransactionId(
  paymentTransactionId: string,
): Promise<TransactionRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE payment_transaction_id = ? LIMIT 1",
    [paymentTransactionId],
  );

  const result = rows as TransactionRecord[];
  return result[0] ?? null;
}

export async function getTransactionByQRCode(
  qrCode: string,
): Promise<TransactionRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM transactions WHERE qr_code = ? ORDER BY created_at DESC LIMIT 1",
    [qrCode],
  );

  const result = rows as TransactionRecord[];
  return result[0] ?? null;
}

export async function getActiveTransactionByDeviceId(
  deviceId: number,
): Promise<TransactionRecord | null> {
  const [rows] = await pool.query(
    `
    SELECT * FROM transactions
    WHERE device_id = ?
      AND status = 'completed'
      AND started_at IS NOT NULL
      AND ended_at IS NULL
    ORDER BY started_at DESC
    LIMIT 1
  `,
    [deviceId],
  );

  const result = rows as TransactionRecord[];
  return result[0] ?? null;
}

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<TransactionRecord> {
  const {
    tenantId,
    stationId,
    deviceId,
    pricingPackageId,
    qrCode,
    amount,
    durationMinutes,
    status = "pending",
    paymentMethod = null,
    paymentTransactionId = null,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO transactions (
      tenant_id,
      station_id,
      device_id,
      pricing_package_id,
      qr_code,
      amount,
      duration_minutes,
      status,
      payment_method,
      payment_transaction_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      tenantId,
      stationId,
      deviceId,
      pricingPackageId,
      qrCode,
      amount,
      durationMinutes,
      status,
      paymentMethod,
      paymentTransactionId,
    ],
  );

  const insertResult = result as { insertId: number };
  const created = await getTransactionById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created transaction");
  }

  return created;
}

export async function updateTransaction(
  id: number,
  input: UpdateTransactionInput,
): Promise<TransactionRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }

  if (input.paymentMethod !== undefined) {
    fields.push("payment_method = ?");
    values.push(input.paymentMethod);
  }

  if (input.paymentTransactionId !== undefined) {
    fields.push("payment_transaction_id = ?");
    values.push(input.paymentTransactionId);
  }

  if (input.startedAt !== undefined) {
    fields.push("started_at = ?");
    values.push(input.startedAt);
  }

  if (input.endedAt !== undefined) {
    fields.push("ended_at = ?");
    values.push(input.endedAt);
  }

  if (fields.length === 0) {
    return getTransactionById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE transactions
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
    values,
  );

  return getTransactionById(id);
}

export async function startTransaction(
  id: number,
): Promise<TransactionRecord | null> {
  await pool.query(
    "UPDATE transactions SET started_at = NOW(), status = 'completed' WHERE id = ?",
    [id],
  );

  return getTransactionById(id);
}

export async function endTransaction(
  id: number,
): Promise<TransactionRecord | null> {
  await pool.query("UPDATE transactions SET ended_at = NOW() WHERE id = ?", [id]);

  return getTransactionById(id);
}

export async function updateTransactionStatus(
  id: number,
  status: TransactionStatus,
): Promise<TransactionRecord | null> {
  await pool.query("UPDATE transactions SET status = ? WHERE id = ?", [status, id]);

  return getTransactionById(id);
}

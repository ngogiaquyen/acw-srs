import { pool } from "./connection";

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface TransactionRecord {
  id: number;
  tenant_id: number;
  device_id: number;
  pricing_package_id: number | null;
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
  deviceId: number;
  pricingPackageId?: number | null;
  qrCode: string;
  amount: number;
  durationMinutes: number;
  status?: TransactionStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
}

export interface UpdateTransactionInput {
  pricingPackageId?: number | null;
  qrCode?: string;
  amount?: number;
  durationMinutes?: number;
  status?: TransactionStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  startedAt?: Date | null;
  endedAt?: Date | null;
}

export async function getTransactionById(id: number): Promise<TransactionRecord | null> {
  const [rows] = await pool.query("SELECT * FROM transactions WHERE id = ? LIMIT 1", [id]);
  const result = rows as TransactionRecord[];
  return result[0] ?? null;
}

export interface TransactionWithDevice extends TransactionRecord {
  device_name: string;
  device_code: string;
}

export async function getTransactionsByTenantId(tenantId: number, deviceId: number | null = null): Promise<TransactionWithDevice[]> {
  let query = `
     SELECT t.*, d.name AS device_name, d.device_id AS device_code
     FROM transactions t
     LEFT JOIN devices d ON d.id = t.device_id
     WHERE t.tenant_id = ?
  `;
  const params: any[] = [tenantId];
  
  if (deviceId !== null) {
    query += ` AND t.device_id = ?`;
    params.push(deviceId);
  }
  
  query += ` ORDER BY t.created_at DESC`;

  const [rows] = await pool.query(query, params);
  return rows as TransactionWithDevice[];
}

export async function getActiveTransactionByDeviceId(deviceId: number): Promise<TransactionRecord | null> {
  const [rows] = await pool.query(
    `
      SELECT *
      FROM transactions
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

export async function getActiveTransactionsByDeviceIds(
  deviceIds: number[],
): Promise<Map<number, TransactionRecord>> {
  if (deviceIds.length === 0) return new Map();

  const placeholders = deviceIds.map(() => "?").join(", ");
  const [rows] = await pool.query(
    `
      SELECT * FROM transactions
      WHERE device_id IN (${placeholders})
        AND status = 'completed'
        AND started_at IS NOT NULL
        AND ended_at IS NULL
      ORDER BY device_id, started_at DESC
    `,
    deviceIds,
  );

  const result = new Map<number, TransactionRecord>();
  for (const row of rows as TransactionRecord[]) {
    if (!result.has(row.device_id)) {
      result.set(row.device_id, row);
    }
  }
  return result;
}

export function computeRemainingSeconds(tx: TransactionRecord): number {
  const startedAt = new Date(tx.started_at!).getTime();
  const endAt = startedAt + tx.duration_minutes * 60 * 1000;
  return Math.max(0, Math.floor((endAt - Date.now()) / 1000));
}

export async function createTransaction(input: CreateTransactionInput): Promise<TransactionRecord> {
  const {
    tenantId,
    deviceId,
    pricingPackageId = null,
    qrCode,
    amount,
    durationMinutes,
    status = "pending",
    paymentMethod = null,
    paymentTransactionId = null,
    startedAt = null,
    endedAt = null,
  } = input;

  const [result] = await pool.query(
    `
      INSERT INTO transactions (
        tenant_id,
        device_id,
        pricing_package_id,
        qr_code,
        amount,
        duration_minutes,
        status,
        payment_method,
        payment_transaction_id,
        started_at,
        ended_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      tenantId,
      deviceId,
      pricingPackageId,
      qrCode,
      amount,
      durationMinutes,
      status,
      paymentMethod,
      paymentTransactionId,
      startedAt,
      endedAt,
    ],
  );

  const insertId = (result as { insertId: number }).insertId;
  const created = await getTransactionById(insertId);

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

  if (input.pricingPackageId !== undefined) {
    fields.push("pricing_package_id = ?");
    values.push(input.pricingPackageId);
  }
  if (input.qrCode !== undefined) {
    fields.push("qr_code = ?");
    values.push(input.qrCode);
  }
  if (input.amount !== undefined) {
    fields.push("amount = ?");
    values.push(input.amount);
  }
  if (input.durationMinutes !== undefined) {
    fields.push("duration_minutes = ?");
    values.push(input.durationMinutes);
  }
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

  await pool.query(`UPDATE transactions SET ${fields.join(", ")} WHERE id = ?`, values);

  return getTransactionById(id);
}

export async function updateTransactionStatus(
  id: number,
  status: TransactionStatus,
): Promise<TransactionRecord | null> {
  await pool.query("UPDATE transactions SET status = ? WHERE id = ?", [status, id]);
  return getTransactionById(id);
}

export async function startTransaction(id: number): Promise<TransactionRecord | null> {
  await pool.query(
    `
      UPDATE transactions
      SET started_at = NOW(), status = 'completed'
      WHERE id = ?
        AND status = 'completed'
        AND started_at IS NULL
    `,
    [id],
  );

  return getTransactionById(id);
}

export async function endTransaction(id: number): Promise<TransactionRecord | null> {
  await pool.query(
    `
      UPDATE transactions
      SET ended_at = NOW()
      WHERE id = ?
        AND started_at IS NOT NULL
        AND ended_at IS NULL
    `,
    [id],
  );

  return getTransactionById(id);
}

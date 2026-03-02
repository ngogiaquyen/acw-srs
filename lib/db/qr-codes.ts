import { pool } from "./connection";

export interface QrCodeRecord {
  id: number;
  tenant_id: number;
  station_id: number | null;
  device_id: number | null;
  code: string;
  label: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateQrCodeInput {
  tenantId: number;
  stationId?: number | null;
  deviceId?: number | null;
  code: string;
  label?: string | null;
  isActive?: boolean;
}

export async function getQrCodesByTenantId(
  tenantId: number,
): Promise<QrCodeRecord[]> {
  const [rows] = await pool.query(
    "SELECT * FROM qr_codes WHERE tenant_id = ? ORDER BY created_at DESC",
    [tenantId],
  );

  return rows as QrCodeRecord[];
}

export async function getAllQrCodes(): Promise<QrCodeRecord[]> {
  const [rows] = await pool.query("SELECT * FROM qr_codes ORDER BY created_at DESC");
  return rows as QrCodeRecord[];
}

export async function getQrCodeById(id: number): Promise<QrCodeRecord | null> {
  const [rows] = await pool.query("SELECT * FROM qr_codes WHERE id = ? LIMIT 1", [id]);
  const result = rows as QrCodeRecord[];
  return result[0] ?? null;
}

export async function getQrCodeByIdAndTenantId(
  id: number,
  tenantId: number,
): Promise<QrCodeRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM qr_codes WHERE id = ? AND tenant_id = ? LIMIT 1",
    [id, tenantId],
  );
  const result = rows as QrCodeRecord[];
  return result[0] ?? null;
}

export async function getQrCodeByCode(code: string): Promise<QrCodeRecord | null> {
  const [rows] = await pool.query("SELECT * FROM qr_codes WHERE code = ? LIMIT 1", [code]);
  const result = rows as QrCodeRecord[];
  return result[0] ?? null;
}

export async function createQrCode(input: CreateQrCodeInput): Promise<QrCodeRecord> {
  const {
    tenantId,
    stationId = null,
    deviceId = null,
    code,
    label = null,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO qr_codes (
      tenant_id,
      station_id,
      device_id,
      code,
      label,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [tenantId, stationId, deviceId, code, label, isActive ? 1 : 0],
  );

  const insertResult = result as { insertId: number };
  const created = await getQrCodeById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created qr code");
  }

  return created;
}

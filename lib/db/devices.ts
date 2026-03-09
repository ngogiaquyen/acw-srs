import { pool } from "./connection";

export type DeviceStatus = "online" | "offline" | "maintenance";

export interface DeviceRecord {
  id: number;
  tenant_id: number;
  device_id: string;
  name: string;
  payment_code: string | null;
  status: DeviceStatus;
  last_heartbeat: Date | null;
  firmware_version: string | null;
  price_per_minute: number | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDeviceInput {
  tenantId: number;
  deviceId: string;
  name: string;
  paymentCode?: string | null;
  status?: DeviceStatus;
  lastHeartbeat?: Date | null;
  firmwareVersion?: string | null;
  pricePerMinute?: number | null;
  isActive?: boolean;
}

export interface UpdateDeviceInput {
  name?: string;
  paymentCode?: string | null;
  status?: DeviceStatus;
  firmwareVersion?: string | null;
  pricePerMinute?: number | null;
  isActive?: boolean;
}

export async function getDevicesByTenantId(tenantId: number): Promise<DeviceRecord[]> {
  const [rows] = await pool.query(
    "SELECT * FROM devices WHERE tenant_id = ? ORDER BY created_at DESC",
    [tenantId],
  );
  return rows as DeviceRecord[];
}

export async function getAllDevices(options?: { tenantId?: number }): Promise<DeviceRecord[]> {
  const whereClauses: string[] = [];
  const values: unknown[] = [];

  if (options?.tenantId !== undefined) {
    whereClauses.push("tenant_id = ?");
    values.push(options.tenantId);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM devices ${whereSql} ORDER BY created_at DESC`,
    values,
  );

  return rows as DeviceRecord[];
}

export async function getDeviceById(id: number): Promise<DeviceRecord | null> {
  const [rows] = await pool.query("SELECT * FROM devices WHERE id = ? LIMIT 1", [id]);
  const result = rows as DeviceRecord[];
  return result[0] ?? null;
}

export async function getDeviceByDeviceId(deviceId: string): Promise<DeviceRecord | null> {
  const [rows] = await pool.query("SELECT * FROM devices WHERE device_id = ? LIMIT 1", [deviceId]);
  const result = rows as DeviceRecord[];
  return result[0] ?? null;
}

export async function getDeviceByPaymentCode(paymentCode: string): Promise<DeviceRecord | null> {
  const normalized = paymentCode.trim().toUpperCase();
  const [rows] = await pool.query(
    "SELECT * FROM devices WHERE UPPER(payment_code) = ? AND is_active = 1 LIMIT 1",
    [normalized],
  );
  const result = rows as DeviceRecord[];
  return result[0] ?? null;
}

export async function getDeviceByIdAndTenantId(id: number, tenantId: number): Promise<DeviceRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM devices WHERE id = ? AND tenant_id = ? LIMIT 1",
    [id, tenantId],
  );
  const result = rows as DeviceRecord[];
  return result[0] ?? null;
}

export async function createDevice(input: CreateDeviceInput): Promise<DeviceRecord> {
  const {
    tenantId,
    deviceId,
    name,
    paymentCode,
    status = "offline",
    lastHeartbeat = null,
    firmwareVersion = null,
    pricePerMinute = null,
    isActive = true,
  } = input;

  const finalPaymentCode = paymentCode || `DV${tenantId.toString().padStart(3, "0")}${deviceId}`;

  const [result] = await pool.query(
    `
    INSERT INTO devices (
      tenant_id,
      device_id,
      name,
      payment_code,
      status,
      last_heartbeat,
      firmware_version,
      price_per_minute,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      tenantId,
      deviceId,
      name,
      finalPaymentCode,
      status,
      lastHeartbeat,
      firmwareVersion,
      pricePerMinute,
      isActive ? 1 : 0,
    ],
  );

  const insertResult = result as { insertId: number };
  const created = await getDeviceById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created device");
  }

  return created;
}

export async function updateDevice(id: number, input: UpdateDeviceInput): Promise<DeviceRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.paymentCode !== undefined) {
    fields.push("payment_code = ?");
    values.push(input.paymentCode);
  }
  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }
  if (input.firmwareVersion !== undefined) {
    fields.push("firmware_version = ?");
    values.push(input.firmwareVersion);
  }
  if (input.pricePerMinute !== undefined) {
    fields.push("price_per_minute = ?");
    values.push(input.pricePerMinute);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return getDeviceById(id);
  }

  values.push(id);
  await pool.query(`UPDATE devices SET ${fields.join(", ")} WHERE id = ?`, values);

  return getDeviceById(id);
}

export async function updateDeviceHeartbeat(deviceId: string, heartbeatAt: Date = new Date()): Promise<DeviceRecord | null> {
  await pool.query(
    "UPDATE devices SET last_heartbeat = ?, status = 'online' WHERE device_id = ?",
    [heartbeatAt, deviceId],
  );
  return getDeviceByDeviceId(deviceId);
}

export async function updateDeviceStatus(deviceId: string, status: DeviceStatus): Promise<DeviceRecord | null> {
  await pool.query("UPDATE devices SET status = ? WHERE device_id = ?", [status, deviceId]);
  return getDeviceByDeviceId(deviceId);
}

export async function deleteDevice(id: number): Promise<void> {
  await pool.query("DELETE FROM devices WHERE id = ?", [id]);
}

export async function markOfflineDevices(timeoutMinutes = 5): Promise<{ affectedRows: number }> {
  const [result] = await pool.query(
    `
    UPDATE devices
    SET status = 'offline'
    WHERE status = 'online'
      AND last_heartbeat IS NOT NULL
      AND last_heartbeat < (NOW() - INTERVAL ? MINUTE)
  `,
    [timeoutMinutes],
  );

  return { affectedRows: (result as { affectedRows: number }).affectedRows };
}

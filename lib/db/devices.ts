import { pool } from "./connection";

export type DeviceStatus = "online" | "offline" | "maintenance";

export interface DeviceRecord {
  id: number;
  tenant_id: number;
  station_id: number | null;
  device_id: string;
  name: string;
  status: DeviceStatus;
  last_heartbeat: Date | null;
  firmware_version: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDeviceInput {
  tenantId: number;
  stationId?: number | null;
  deviceId: string;
  name: string;
  status?: DeviceStatus;
  lastHeartbeat?: Date | null;
  firmwareVersion?: string | null;
  isActive?: boolean;
}

export interface UpdateDeviceInput {
  stationId?: number | null;
  name?: string;
  status?: DeviceStatus;
  firmwareVersion?: string | null;
  isActive?: boolean;
}

export async function getDevicesByTenantId(
  tenantId: number,
  options?: { stationId?: number },
): Promise<DeviceRecord[]> {
  const whereClauses = ["tenant_id = ?"];
  const values: unknown[] = [tenantId];

  if (options?.stationId !== undefined) {
    whereClauses.push("station_id = ?");
    values.push(options.stationId);
  }

  const [rows] = await pool.query(
    `SELECT * FROM devices WHERE ${whereClauses.join(" AND ")} ORDER BY created_at DESC`,
    values,
  );

  return rows as DeviceRecord[];
}

export async function getAllDevices(options?: {
  tenantId?: number;
  stationId?: number;
}): Promise<DeviceRecord[]> {
  const whereClauses: string[] = [];
  const values: unknown[] = [];

  if (options?.tenantId !== undefined) {
    whereClauses.push("tenant_id = ?");
    values.push(options.tenantId);
  }

  if (options?.stationId !== undefined) {
    whereClauses.push("station_id = ?");
    values.push(options.stationId);
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

export async function getDeviceByDeviceId(
  deviceId: string,
): Promise<DeviceRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM devices WHERE device_id = ? LIMIT 1",
    [deviceId],
  );
  const result = rows as DeviceRecord[];
  return result[0] ?? null;
}

export async function getDeviceByIdAndTenantId(
  id: number,
  tenantId: number,
): Promise<DeviceRecord | null> {
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
    stationId = null,
    deviceId,
    name,
    status = "offline",
    lastHeartbeat = null,
    firmwareVersion = null,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO devices (
      tenant_id,
      station_id,
      device_id,
      name,
      status,
      last_heartbeat,
      firmware_version,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      tenantId,
      stationId,
      deviceId,
      name,
      status,
      lastHeartbeat,
      firmwareVersion,
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

export async function updateDevice(
  id: number,
  input: UpdateDeviceInput,
): Promise<DeviceRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.stationId !== undefined) {
    fields.push("station_id = ?");
    values.push(input.stationId);
  }

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }

  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }

  if (input.firmwareVersion !== undefined) {
    fields.push("firmware_version = ?");
    values.push(input.firmwareVersion);
  }

  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return getDeviceById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE devices
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
    values,
  );

  return getDeviceById(id);
}

export async function updateDeviceHeartbeat(
  deviceId: string,
  heartbeatAt: Date = new Date(),
): Promise<DeviceRecord | null> {
  await pool.query(
    `
    UPDATE devices
    SET last_heartbeat = ?, status = 'online'
    WHERE device_id = ?
  `,
    [heartbeatAt, deviceId],
  );

  return getDeviceByDeviceId(deviceId);
}

export async function updateDeviceStatus(
  deviceId: string,
  status: DeviceStatus,
): Promise<DeviceRecord | null> {
  await pool.query("UPDATE devices SET status = ? WHERE device_id = ?", [
    status,
    deviceId,
  ]);

  return getDeviceByDeviceId(deviceId);
}

export async function softDeleteDevice(id: number): Promise<void> {
  await pool.query("UPDATE devices SET is_active = 0 WHERE id = ?", [id]);
}

export async function markOfflineDevices(
  timeoutMinutes = 5,
): Promise<{ affectedRows: number }> {
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

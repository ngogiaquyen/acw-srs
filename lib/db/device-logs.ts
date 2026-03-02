import { pool } from "./connection";

export type DeviceLogLevel = "info" | "warning" | "error";

export interface DeviceLogRecord {
  id: number;
  device_id: number;
  log_level: DeviceLogLevel;
  message: string;
  metadata: unknown;
  created_at: Date;
}

export interface CreateDeviceLogInput {
  deviceId: number;
  logLevel?: DeviceLogLevel;
  message: string;
  metadata?: unknown;
}

export async function createDeviceLog(
  input: CreateDeviceLogInput,
): Promise<DeviceLogRecord> {
  const { deviceId, logLevel = "info", message, metadata = null } = input;

  const [result] = await pool.query(
    `
    INSERT INTO device_logs (
      device_id,
      log_level,
      message,
      metadata
    )
    VALUES (?, ?, ?, ?)
  `,
    [deviceId, logLevel, message, JSON.stringify(metadata)],
  );

  const insertId = (result as { insertId: number }).insertId;
  const [rows] = await pool.query("SELECT * FROM device_logs WHERE id = ? LIMIT 1", [
    insertId,
  ]);

  const created = (rows as DeviceLogRecord[])[0];

  if (!created) {
    throw new Error("Failed to fetch created device log");
  }

  return created;
}

export async function getDeviceLogsByDeviceId(
  deviceId: number,
  limit = 50,
): Promise<DeviceLogRecord[]> {
  const [rows] = await pool.query(
    `
    SELECT * FROM device_logs
    WHERE device_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `,
    [deviceId, limit],
  );

  return rows as DeviceLogRecord[];
}

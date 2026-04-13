import { pool } from "./connection";

export type DeviceCommandType =
  | "start"
  | "stop"
  | "add_time"
  | "restart"
  | "update_firmware"
  | "config";

export type DeviceCommandStatus = "pending" | "sent" | "executed" | "failed";

export interface DeviceCommandRecord {
  id: number;
  device_id: number;
  command_type: DeviceCommandType;
  command_data: unknown;
  status: DeviceCommandStatus;
  response_data: unknown;
  created_at: Date;
  executed_at: Date | null;
}

export interface CreateDeviceCommandInput {
  deviceId: number;
  commandType: DeviceCommandType;
  commandData?: unknown;
}

export async function createDeviceCommand(
  input: CreateDeviceCommandInput,
): Promise<DeviceCommandRecord> {
  const { deviceId, commandType, commandData = null } = input;

  const [result] = await pool.query(
    `
    INSERT INTO device_commands (
      device_id,
      command_type,
      command_data,
      status
    )
    VALUES (?, ?, ?, 'pending')
  `,
    [deviceId, commandType, JSON.stringify(commandData)],
  );

  const insertId = (result as { insertId: number }).insertId;
  const created = await getDeviceCommandById(insertId);

  if (!created) {
    throw new Error("Failed to fetch created device command");
  }

  return created;
}

export async function getDeviceCommandById(
  id: number,
): Promise<DeviceCommandRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM device_commands WHERE id = ? LIMIT 1",
    [id],
  );

  const result = rows as DeviceCommandRecord[];
  return result[0] ?? null;
}

export async function getPendingCommandsByDeviceId(
  deviceId: number,
  limit = 20,
): Promise<DeviceCommandRecord[]> {
  const [rows] = await pool.query(
    `
    SELECT * FROM device_commands
    WHERE device_id = ? AND status = 'pending'
    ORDER BY created_at ASC
    LIMIT ?
  `,
    [deviceId, limit],
  );

  return rows as DeviceCommandRecord[];
}

export async function markCommandsAsSent(commandIds: number[]): Promise<void> {
  if (commandIds.length === 0) return;

  const placeholders = commandIds.map(() => "?").join(", ");

  await pool.query(
    `
    UPDATE device_commands
    SET status = 'sent'
    WHERE id IN (${placeholders}) AND status = 'pending'
  `,
    commandIds,
  );
}

export async function getRecentCommandsByDeviceId(
  deviceId: number,
  limit = 20,
): Promise<DeviceCommandRecord[]> {
  const [rows] = await pool.query(
    `
    SELECT * FROM device_commands
    WHERE device_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `,
    [deviceId, limit],
  );
  return rows as DeviceCommandRecord[];
}

export async function completeDeviceCommand(
  id: number,
  status: "executed" | "failed",
  responseData?: unknown,
): Promise<DeviceCommandRecord | null> {
  await pool.query(
    `
    UPDATE device_commands
    SET status = ?, response_data = ?, executed_at = NOW()
    WHERE id = ?
  `,
    [status, JSON.stringify(responseData ?? null), id],
  );

  return getDeviceCommandById(id);
}

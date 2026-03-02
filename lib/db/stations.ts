import { pool } from "./connection";

export interface StationRecord {
  id: number;
  tenant_id: number;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  qr_code: string;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateStationInput {
  tenantId: number;
  name: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  qrCode: string;
  isActive?: boolean;
}

export interface UpdateStationInput {
  name?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  qrCode?: string;
  isActive?: boolean;
}

export async function getStationsByTenantId(
  tenantId: number,
): Promise<StationRecord[]> {
  const [rows] = await pool.query(
    "SELECT * FROM stations WHERE tenant_id = ? ORDER BY created_at DESC",
    [tenantId],
  );
  return rows as StationRecord[];
}

export async function getAllStations(): Promise<StationRecord[]> {
  const [rows] = await pool.query(
    "SELECT * FROM stations ORDER BY created_at DESC",
  );
  return rows as StationRecord[];
}

export async function getStationById(id: number): Promise<StationRecord | null> {
  const [rows] = await pool.query("SELECT * FROM stations WHERE id = ? LIMIT 1", [
    id,
  ]);
  const result = rows as StationRecord[];
  return result[0] ?? null;
}

export async function getStationByIdAndTenantId(
  id: number,
  tenantId: number,
): Promise<StationRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM stations WHERE id = ? AND tenant_id = ? LIMIT 1",
    [id, tenantId],
  );
  const result = rows as StationRecord[];
  return result[0] ?? null;
}

export async function createStation(
  input: CreateStationInput,
): Promise<StationRecord> {
  const {
    tenantId,
    name,
    address = null,
    latitude = null,
    longitude = null,
    qrCode,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO stations (
      tenant_id,
      name,
      address,
      latitude,
      longitude,
      qr_code,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [tenantId, name, address, latitude, longitude, qrCode, isActive ? 1 : 0],
  );

  const insertResult = result as { insertId: number };

  const created = await getStationById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created station");
  }

  return created;
}

export async function updateStation(
  id: number,
  input: UpdateStationInput,
): Promise<StationRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.address !== undefined) {
    fields.push("address = ?");
    values.push(input.address);
  }
  if (input.latitude !== undefined) {
    fields.push("latitude = ?");
    values.push(input.latitude);
  }
  if (input.longitude !== undefined) {
    fields.push("longitude = ?");
    values.push(input.longitude);
  }
  if (input.qrCode !== undefined) {
    fields.push("qr_code = ?");
    values.push(input.qrCode);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return getStationById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE stations
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
    values,
  );

  return getStationById(id);
}

export async function softDeleteStation(id: number): Promise<void> {
  await pool.query("UPDATE stations SET is_active = 0 WHERE id = ?", [id]);
}


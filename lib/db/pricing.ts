import { pool } from "./connection";

export interface PricingPackageRecord {
  id: number;
  tenant_id: number;
  station_id: number | null;
  name: string;
  price: number;
  duration_minutes: number;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreatePricingPackageInput {
  tenantId: number;
  stationId?: number | null;
  name: string;
  price: number;
  durationMinutes: number;
  isActive?: boolean;
}

export interface UpdatePricingPackageInput {
  stationId?: number | null;
  name?: string;
  price?: number;
  durationMinutes?: number;
  isActive?: boolean;
}

export async function getPricingPackagesByTenantId(
  tenantId: number,
  options?: { stationId?: number },
): Promise<PricingPackageRecord[]> {
  const values: unknown[] = [tenantId];

  let whereSql = "tenant_id = ?";

  if (options?.stationId !== undefined) {
    whereSql += " AND (station_id = ? OR station_id IS NULL)";
    values.push(options.stationId);
  }

  const [rows] = await pool.query(
    `SELECT * FROM pricing_packages WHERE ${whereSql} ORDER BY created_at DESC`,
    values,
  );

  return rows as PricingPackageRecord[];
}

export async function getAllPricingPackages(options?: {
  tenantId?: number;
  stationId?: number;
}): Promise<PricingPackageRecord[]> {
  const whereClauses: string[] = [];
  const values: unknown[] = [];

  if (options?.tenantId !== undefined) {
    whereClauses.push("tenant_id = ?");
    values.push(options.tenantId);
  }

  if (options?.stationId !== undefined) {
    whereClauses.push("(station_id = ? OR station_id IS NULL)");
    values.push(options.stationId);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  const [rows] = await pool.query(
    `SELECT * FROM pricing_packages ${whereSql} ORDER BY created_at DESC`,
    values,
  );

  return rows as PricingPackageRecord[];
}

export async function getPricingPackageById(
  id: number,
): Promise<PricingPackageRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM pricing_packages WHERE id = ? LIMIT 1",
    [id],
  );
  const result = rows as PricingPackageRecord[];
  return result[0] ?? null;
}

export async function getPricingPackageByIdAndTenantId(
  id: number,
  tenantId: number,
): Promise<PricingPackageRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM pricing_packages WHERE id = ? AND tenant_id = ? LIMIT 1",
    [id, tenantId],
  );
  const result = rows as PricingPackageRecord[];
  return result[0] ?? null;
}

export async function createPricingPackage(
  input: CreatePricingPackageInput,
): Promise<PricingPackageRecord> {
  const {
    tenantId,
    stationId = null,
    name,
    price,
    durationMinutes,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO pricing_packages (
      tenant_id,
      station_id,
      name,
      price,
      duration_minutes,
      is_active
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [tenantId, stationId, name, price, durationMinutes, isActive ? 1 : 0],
  );

  const insertResult = result as { insertId: number };
  const created = await getPricingPackageById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created pricing package");
  }

  return created;
}

export async function updatePricingPackage(
  id: number,
  input: UpdatePricingPackageInput,
): Promise<PricingPackageRecord | null> {
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

  if (input.price !== undefined) {
    fields.push("price = ?");
    values.push(input.price);
  }

  if (input.durationMinutes !== undefined) {
    fields.push("duration_minutes = ?");
    values.push(input.durationMinutes);
  }

  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return getPricingPackageById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE pricing_packages
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
    values,
  );

  return getPricingPackageById(id);
}

export async function softDeletePricingPackage(id: number): Promise<void> {
  await pool.query("UPDATE pricing_packages SET is_active = 0 WHERE id = ?", [id]);
}

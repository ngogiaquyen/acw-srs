import { pool } from "./connection";

export type UserRole = "SUPER_ADMIN" | "TENANT_ADMIN";

export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  tenant_id: number | null;
  name: string;
  phone: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserInput {
  email: string;
  passwordHash: string;
  role: UserRole;
  tenantId?: number | null;
  name: string;
  phone?: string | null;
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [
    email,
  ]);

  const result = rows as UserRecord[];
  return result[0] ?? null;
}

export async function findUserById(id: number): Promise<UserRecord | null> {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ? LIMIT 1", [id]);

  const result = rows as UserRecord[];
  return result[0] ?? null;
}

export async function findTenantAdminByTenantId(tenantId: number): Promise<UserRecord | null> {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE tenant_id = ? AND role = 'TENANT_ADMIN' AND is_active = 1 LIMIT 1",
    [tenantId],
  );
  const result = rows as UserRecord[];
  return result[0] ?? null;
}

export async function createUser(input: CreateUserInput): Promise<UserRecord> {
  const { email, passwordHash, role, tenantId = null, name, phone = null } = input;

  const [result] = await pool.query(
    `
    INSERT INTO users (email, password_hash, role, tenant_id, name, phone)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
    [email, passwordHash, role, tenantId, name, phone],
  );

  const insertResult = result as { insertId: number };

  const created = await findUserById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created user");
  }

  return created;
}


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

export async function updateUserPassword(email: string, passwordHash: string): Promise<boolean> {
  const [result] = await pool.query(
    "UPDATE users SET password_hash = ? WHERE email = ?",
    [passwordHash, email]
  );
  const updateResult = result as { affectedRows: number };
  return updateResult.affectedRows > 0;
}

export async function updateOrCreateTenantAdmin(
  tenantId: number,
  input: { name: string; email: string; passwordHash?: string }
): Promise<UserRecord> {
  const existing = await findTenantAdminByTenantId(tenantId);
  if (existing) {
    const fields: string[] = ["name = ?", "email = ?"];
    const values: unknown[] = [input.name, input.email];
    if (input.passwordHash) {
      fields.push("password_hash = ?");
      values.push(input.passwordHash);
    }
    values.push(existing.id);
    await pool.query(
      `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
      values
    );
    const updated = await findUserById(existing.id);
    if (!updated) throw new Error("Không thể tìm thấy tài khoản admin vừa cập nhật");
    return updated;
  } else {
    if (!input.passwordHash) {
      throw new Error("Mật khẩu là bắt buộc khi tạo tài khoản admin mới");
    }
    return createUser({
      email: input.email,
      passwordHash: input.passwordHash,
      role: "TENANT_ADMIN",
      tenantId,
      name: input.name,
    });
  }
}



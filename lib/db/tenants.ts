import { pool } from "./connection";

export type SubscriptionStatus = "active" | "suspended" | "expired";

export interface TenantRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  license_max_devices: number;
  subscription_status: SubscriptionStatus;
  subscription_start_date: Date | null;
  subscription_end_date: Date | null;
  allow_expired_access: number | boolean;
  is_active: number | boolean;
  // SePay configuration
  sepay_bank_account: string | null;
  sepay_bank_code: string | null;
  sepay_account_name: string | null;
  sepay_webhook_secret: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTenantInput {
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  licenseMaxDevices?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  allowExpiredAccess?: boolean;
  isActive?: boolean;
  // SePay configuration
  sepayBankAccount?: string | null;
  sepayBankCode?: string | null;
  sepayAccountName?: string | null;
  sepayWebhookSecret?: string | null;
}

export interface UpdateTenantInput {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  licenseMaxDevices?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: Date | null;
  subscriptionEndDate?: Date | null;
  allowExpiredAccess?: boolean;
  isActive?: boolean;
  // SePay configuration
  sepayBankAccount?: string | null;
  sepayBankCode?: string | null;
  sepayAccountName?: string | null;
  sepayWebhookSecret?: string | null;
}

export async function getTenants(): Promise<TenantRecord[]> {
  const [rows] = await pool.query(`
    SELECT
      t.*,
      COUNT(d.id) AS total_devices,
      SUM(CASE 
        WHEN d.is_active = 1 
         AND d.last_heartbeat IS NOT NULL 
         AND TIMESTAMPDIFF(MINUTE, d.last_heartbeat, NOW()) <= 5 
        THEN 1 ELSE 0 
      END) AS online_devices
    FROM tenants t
    LEFT JOIN devices d ON d.tenant_id = t.id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `);
  return rows as TenantRecord[];
}

export async function getTenantById(id: number): Promise<TenantRecord | null> {
  const [rows] = await pool.query("SELECT * FROM tenants WHERE id = ? LIMIT 1", [
    id,
  ]);
  const result = rows as TenantRecord[];
  return result[0] ?? null;
}

export async function createTenant(
  input: CreateTenantInput,
): Promise<TenantRecord> {
  const {
    name,
    email,
    phone = null,
    address = null,
    licenseMaxDevices = 0,
    subscriptionStatus = "active",
    subscriptionStartDate = null,
    subscriptionEndDate = null,
    allowExpiredAccess = false,
    isActive = true,
    sepayBankAccount = null,
    sepayBankCode = null,
    sepayAccountName = null,
    sepayWebhookSecret = null,
  } = input;

  const [result] = await pool.query(
    `
    INSERT INTO tenants (
      name,
      email,
      phone,
      address,
      license_max_devices,
      subscription_status,
      subscription_start_date,
      subscription_end_date,
      allow_expired_access,
      is_active,
      sepay_bank_account,
      sepay_bank_code,
      sepay_account_name,
      sepay_webhook_secret
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      name,
      email,
      phone,
      address,
      licenseMaxDevices,
      subscriptionStatus,
      subscriptionStartDate,
      subscriptionEndDate,
      allowExpiredAccess ? 1 : 0,
      isActive ? 1 : 0,
      sepayBankAccount,
      sepayBankCode,
      sepayAccountName,
      sepayWebhookSecret,
    ],
  );

  const insertResult = result as { insertId: number };

  const created = await getTenantById(insertResult.insertId);

  if (!created) {
    throw new Error("Failed to fetch created tenant");
  }

  return created;
}

export async function updateTenant(
  id: number,
  input: UpdateTenantInput,
): Promise<TenantRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.name !== undefined) {
    fields.push("name = ?");
    values.push(input.name);
  }
  if (input.email !== undefined) {
    fields.push("email = ?");
    values.push(input.email);
  }
  if (input.phone !== undefined) {
    fields.push("phone = ?");
    values.push(input.phone);
  }
  if (input.address !== undefined) {
    fields.push("address = ?");
    values.push(input.address);
  }
  if (input.licenseMaxDevices !== undefined) {
    fields.push("license_max_devices = ?");
    values.push(input.licenseMaxDevices);
  }
  if (input.subscriptionStatus !== undefined) {
    fields.push("subscription_status = ?");
    values.push(input.subscriptionStatus);
  }
  if (input.subscriptionStartDate !== undefined) {
    fields.push("subscription_start_date = ?");
    values.push(input.subscriptionStartDate);
  }
  if (input.subscriptionEndDate !== undefined) {
    fields.push("subscription_end_date = ?");
    values.push(input.subscriptionEndDate);
  }
  if (input.allowExpiredAccess !== undefined) {
    fields.push("allow_expired_access = ?");
    values.push(input.allowExpiredAccess ? 1 : 0);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }
  if (input.sepayBankAccount !== undefined) {
    fields.push("sepay_bank_account = ?");
    values.push(input.sepayBankAccount);
  }
  if (input.sepayBankCode !== undefined) {
    fields.push("sepay_bank_code = ?");
    values.push(input.sepayBankCode);
  }
  if (input.sepayAccountName !== undefined) {
    fields.push("sepay_account_name = ?");
    values.push(input.sepayAccountName);
  }
  if (input.sepayWebhookSecret !== undefined) {
    fields.push("sepay_webhook_secret = ?");
    values.push(input.sepayWebhookSecret);
  }

  if (fields.length === 0) {
    return getTenantById(id);
  }

  values.push(id);

  await pool.query(
    `
    UPDATE tenants
    SET ${fields.join(", ")}
    WHERE id = ?
  `,
    values,
  );

  return getTenantById(id);
}

export async function deactivateTenant(id: number): Promise<void> {
  await pool.query("UPDATE tenants SET is_active = 0 WHERE id = ?", [id]);
}

export async function deleteTenant(id: number): Promise<void> {
  await pool.query("DELETE FROM users WHERE tenant_id = ?", [id]);
  await pool.query("DELETE FROM tenants WHERE id = ?", [id]);
}


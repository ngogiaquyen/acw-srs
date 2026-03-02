import { pool } from "./connection";

export type SubscriptionStatus = "active" | "past_due" | "cancelled" | "expired";
export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionRecord {
  id: number;
  tenant_id: number;
  plan_name: string;
  billing_cycle: BillingCycle;
  amount: number;
  start_date: Date;
  end_date: Date;
  status: SubscriptionStatus;
  auto_renew: number | boolean;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateSubscriptionInput {
  tenantId: number;
  planName: string;
  billingCycle: BillingCycle;
  amount: number;
  startDate: Date;
  endDate: Date;
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  isActive?: boolean;
}

export interface UpdateSubscriptionInput {
  planName?: string;
  billingCycle?: BillingCycle;
  amount?: number;
  startDate?: Date;
  endDate?: Date;
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  isActive?: boolean;
}

export async function getSubscriptions(): Promise<SubscriptionRecord[]> {
  const [rows] = await pool.query("SELECT * FROM subscriptions ORDER BY created_at DESC");
  return rows as SubscriptionRecord[];
}

export async function getSubscriptionById(id: number): Promise<SubscriptionRecord | null> {
  const [rows] = await pool.query("SELECT * FROM subscriptions WHERE id = ? LIMIT 1", [id]);
  return (rows as SubscriptionRecord[])[0] ?? null;
}

export async function createSubscription(input: CreateSubscriptionInput): Promise<SubscriptionRecord> {
  const {
    tenantId,
    planName,
    billingCycle,
    amount,
    startDate,
    endDate,
    status = "active",
    autoRenew = true,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `INSERT INTO subscriptions (tenant_id, plan_name, billing_cycle, amount, start_date, end_date, status, auto_renew, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, planName, billingCycle, amount, startDate, endDate, status, autoRenew ? 1 : 0, isActive ? 1 : 0],
  );

  const created = await getSubscriptionById((result as { insertId: number }).insertId);
  if (!created) throw new Error("Failed to fetch created subscription");
  return created;
}

export async function updateSubscription(id: number, input: UpdateSubscriptionInput): Promise<SubscriptionRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.planName !== undefined) { fields.push("plan_name = ?"); values.push(input.planName); }
  if (input.billingCycle !== undefined) { fields.push("billing_cycle = ?"); values.push(input.billingCycle); }
  if (input.amount !== undefined) { fields.push("amount = ?"); values.push(input.amount); }
  if (input.startDate !== undefined) { fields.push("start_date = ?"); values.push(input.startDate); }
  if (input.endDate !== undefined) { fields.push("end_date = ?"); values.push(input.endDate); }
  if (input.status !== undefined) { fields.push("status = ?"); values.push(input.status); }
  if (input.autoRenew !== undefined) { fields.push("auto_renew = ?"); values.push(input.autoRenew ? 1 : 0); }
  if (input.isActive !== undefined) { fields.push("is_active = ?"); values.push(input.isActive ? 1 : 0); }

  if (!fields.length) return getSubscriptionById(id);

  values.push(id);
  await pool.query(`UPDATE subscriptions SET ${fields.join(", ")} WHERE id = ?`, values);
  return getSubscriptionById(id);
}

export async function expireOverdueSubscriptions(): Promise<number> {
  const [result] = await pool.query(
    "UPDATE subscriptions SET status = 'expired', is_active = 0 WHERE end_date < CURDATE() AND status IN ('active','past_due')",
  );
  return (result as { affectedRows: number }).affectedRows ?? 0;
}

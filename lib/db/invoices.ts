import { pool } from "./connection";

export type InvoiceStatus = "pending" | "paid" | "overdue" | "cancelled";

export interface InvoiceRecord {
  id: number;
  tenant_id: number;
  subscription_id: number | null;
  invoice_number: string;
  amount: number;
  currency: string;
  due_date: Date;
  paid_at: Date | null;
  status: InvoiceStatus;
  description: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateInvoiceInput {
  tenantId: number;
  subscriptionId?: number | null;
  invoiceNumber: string;
  amount: number;
  currency?: string;
  dueDate: Date;
  paidAt?: Date | null;
  status?: InvoiceStatus;
  description?: string | null;
  isActive?: boolean;
}

export async function getInvoices(): Promise<InvoiceRecord[]> {
  const [rows] = await pool.query("SELECT * FROM invoices ORDER BY created_at DESC");
  return rows as InvoiceRecord[];
}

export async function getInvoiceById(id: number): Promise<InvoiceRecord | null> {
  const [rows] = await pool.query("SELECT * FROM invoices WHERE id = ? LIMIT 1", [id]);
  return (rows as InvoiceRecord[])[0] ?? null;
}

export async function createInvoice(input: CreateInvoiceInput): Promise<InvoiceRecord> {
  const {
    tenantId,
    subscriptionId = null,
    invoiceNumber,
    amount,
    currency = "VND",
    dueDate,
    paidAt = null,
    status = "pending",
    description = null,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `INSERT INTO invoices (tenant_id, subscription_id, invoice_number, amount, currency, due_date, paid_at, status, description, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, subscriptionId, invoiceNumber, amount, currency, dueDate, paidAt, status, description, isActive ? 1 : 0],
  );

  const created = await getInvoiceById((result as { insertId: number }).insertId);
  if (!created) throw new Error("Failed to fetch created invoice");
  return created;
}

export function generateInvoiceNumber(prefix = "INV") {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${y}${m}${d}-${rand}`;
}

export async function markOverdueInvoices(): Promise<number> {
  const [result] = await pool.query(
    "UPDATE invoices SET status = 'overdue' WHERE status = 'pending' AND due_date < CURDATE()",
  );
  return (result as { affectedRows: number }).affectedRows ?? 0;
}

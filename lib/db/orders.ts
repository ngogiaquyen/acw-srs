import { pool } from "./connection";

export type OrderStatus = "draft" | "pending" | "confirmed" | "processing" | "delivered" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "partial" | "paid" | "refunded";

export interface OrderRecord {
  id: number;
  lead_id: number | null;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_address: string | null;
  package_name: string;
  package_description: string | null;
  quantity: number;
  unit_price: number;
  total_amount: number;
  currency: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;
  payment_transaction_id: string | null;
  tenant_id: number | null;
  notes: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
  confirmed_at: Date | null;
}

export interface CreateOrderInput {
  leadId?: number | null;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  packageName: string;
  packageDescription?: string | null;
  quantity?: number;
  unitPrice: number;
  totalAmount: number;
  currency?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  tenantId?: number | null;
  notes?: string | null;
  isActive?: boolean;
}

export interface UpdateOrderInput {
  leadId?: number | null;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string | null;
  customerAddress?: string | null;
  packageName?: string;
  packageDescription?: string | null;
  quantity?: number;
  unitPrice?: number;
  totalAmount?: number;
  currency?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  paymentMethod?: string | null;
  paymentTransactionId?: string | null;
  tenantId?: number | null;
  notes?: string | null;
  isActive?: boolean;
}

export function generateOrderNumber(prefix = "ORD") {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${y}${m}${d}-${rand}`;
}

export async function getOrders(): Promise<OrderRecord[]> {
  const [rows] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
  return rows as OrderRecord[];
}

export async function getOrderById(id: number): Promise<OrderRecord | null> {
  const [rows] = await pool.query("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  return (rows as OrderRecord[])[0] ?? null;
}

export async function getOrderByOrderNumber(orderNumber: string): Promise<OrderRecord | null> {
  const [rows] = await pool.query("SELECT * FROM orders WHERE order_number = ? LIMIT 1", [orderNumber]);
  return (rows as OrderRecord[])[0] ?? null;
}

export async function createOrder(input: CreateOrderInput): Promise<OrderRecord> {
  const {
    leadId = null,
    orderNumber,
    customerName,
    customerEmail,
    customerPhone = null,
    customerAddress = null,
    packageName,
    packageDescription = null,
    quantity = 1,
    unitPrice,
    totalAmount,
    currency = "VND",
    status = "draft",
    paymentStatus = "unpaid",
    paymentMethod = null,
    paymentTransactionId = null,
    tenantId = null,
    notes = null,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `INSERT INTO orders (
      lead_id, order_number, customer_name, customer_email, customer_phone, customer_address,
      package_name, package_description, quantity, unit_price, total_amount, currency,
      status, payment_status, payment_method, payment_transaction_id, tenant_id, notes, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      leadId,
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      packageName,
      packageDescription,
      quantity,
      unitPrice,
      totalAmount,
      currency,
      status,
      paymentStatus,
      paymentMethod,
      paymentTransactionId,
      tenantId,
      notes,
      isActive ? 1 : 0,
    ],
  );

  const created = await getOrderById((result as { insertId: number }).insertId);
  if (!created) throw new Error("Failed to fetch created order");
  return created;
}

export async function updateOrder(id: number, input: UpdateOrderInput): Promise<OrderRecord | null> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (input.leadId !== undefined) {
    fields.push("lead_id = ?");
    values.push(input.leadId);
  }
  if (input.customerName !== undefined) {
    fields.push("customer_name = ?");
    values.push(input.customerName);
  }
  if (input.customerEmail !== undefined) {
    fields.push("customer_email = ?");
    values.push(input.customerEmail);
  }
  if (input.customerPhone !== undefined) {
    fields.push("customer_phone = ?");
    values.push(input.customerPhone);
  }
  if (input.customerAddress !== undefined) {
    fields.push("customer_address = ?");
    values.push(input.customerAddress);
  }
  if (input.packageName !== undefined) {
    fields.push("package_name = ?");
    values.push(input.packageName);
  }
  if (input.packageDescription !== undefined) {
    fields.push("package_description = ?");
    values.push(input.packageDescription);
  }
  if (input.quantity !== undefined) {
    fields.push("quantity = ?");
    values.push(input.quantity);
  }
  if (input.unitPrice !== undefined) {
    fields.push("unit_price = ?");
    values.push(input.unitPrice);
  }
  if (input.totalAmount !== undefined) {
    fields.push("total_amount = ?");
    values.push(input.totalAmount);
  }
  if (input.currency !== undefined) {
    fields.push("currency = ?");
    values.push(input.currency);
  }
  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
    // Nếu status là 'confirmed' và confirmed_at là null, thì set confirmed_at
    if (input.status === "confirmed") {
      fields.push("confirmed_at = ?");
      values.push(new Date());
    }
  }
  if (input.paymentStatus !== undefined) {
    fields.push("payment_status = ?");
    values.push(input.paymentStatus);
  }
  if (input.paymentMethod !== undefined) {
    fields.push("payment_method = ?");
    values.push(input.paymentMethod);
  }
  if (input.paymentTransactionId !== undefined) {
    fields.push("payment_transaction_id = ?");
    values.push(input.paymentTransactionId);
  }
  if (input.tenantId !== undefined) {
    fields.push("tenant_id = ?");
    values.push(input.tenantId);
  }
  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (!fields.length) return getOrderById(id);

  values.push(id);
  await pool.query(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, values);
  return getOrderById(id);
}

export async function deleteOrder(id: number): Promise<boolean> {
  const [result] = await pool.query("UPDATE orders SET is_active = 0 WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}

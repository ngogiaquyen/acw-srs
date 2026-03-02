import { pool } from "./connection";

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface LeadRecord {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  address: string | null;
  message: string | null;
  source: string;
  status: LeadStatus;
  assigned_to: number | null;
  notes: string | null;
  is_active: number | boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  message?: string | null;
  source?: string;
  status?: LeadStatus;
  assignedTo?: number | null;
  notes?: string | null;
  isActive?: boolean;
}

export interface UpdateLeadInput {
  name?: string;
  email?: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  message?: string | null;
  source?: string;
  status?: LeadStatus;
  assignedTo?: number | null;
  notes?: string | null;
  isActive?: boolean;
}

export async function getLeads(): Promise<LeadRecord[]> {
  const [rows] = await pool.query("SELECT * FROM leads ORDER BY created_at DESC");
  return rows as LeadRecord[];
}

export async function getLeadById(id: number): Promise<LeadRecord | null> {
  const [rows] = await pool.query("SELECT * FROM leads WHERE id = ? LIMIT 1", [id]);
  return (rows as LeadRecord[])[0] ?? null;
}

export async function createLead(input: CreateLeadInput): Promise<LeadRecord> {
  const {
    name,
    email,
    phone = null,
    company = null,
    address = null,
    message = null,
    source = "website",
    status = "new",
    assignedTo = null,
    notes = null,
    isActive = true,
  } = input;

  const [result] = await pool.query(
    `INSERT INTO leads (name, email, phone, company, address, message, source, status, assigned_to, notes, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, phone, company, address, message, source, status, assignedTo, notes, isActive ? 1 : 0],
  );

  const created = await getLeadById((result as { insertId: number }).insertId);
  if (!created) throw new Error("Failed to fetch created lead");
  return created;
}

export async function updateLead(id: number, input: UpdateLeadInput): Promise<LeadRecord | null> {
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
  if (input.company !== undefined) {
    fields.push("company = ?");
    values.push(input.company);
  }
  if (input.address !== undefined) {
    fields.push("address = ?");
    values.push(input.address);
  }
  if (input.message !== undefined) {
    fields.push("message = ?");
    values.push(input.message);
  }
  if (input.source !== undefined) {
    fields.push("source = ?");
    values.push(input.source);
  }
  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }
  if (input.assignedTo !== undefined) {
    fields.push("assigned_to = ?");
    values.push(input.assignedTo);
  }
  if (input.notes !== undefined) {
    fields.push("notes = ?");
    values.push(input.notes);
  }
  if (input.isActive !== undefined) {
    fields.push("is_active = ?");
    values.push(input.isActive ? 1 : 0);
  }

  if (!fields.length) return getLeadById(id);

  values.push(id);
  await pool.query(`UPDATE leads SET ${fields.join(", ")} WHERE id = ?`, values);
  return getLeadById(id);
}

export async function deleteLead(id: number): Promise<boolean> {
  const [result] = await pool.query("UPDATE leads SET is_active = 0 WHERE id = ?", [id]);
  return (result as { affectedRows: number }).affectedRows > 0;
}

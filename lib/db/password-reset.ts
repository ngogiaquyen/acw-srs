import { pool } from "./connection";

export interface PasswordResetToken {
  id: number;
  email: string;
  token: string;
  expires_at: Date;
  used: boolean;
  created_at: Date;
}

export async function createPasswordResetToken(email: string, token: string, expiresAt: Date) {
  const [result] = await pool.query(
    `INSERT INTO password_reset_tokens (email, token, expires_at) VALUES (?, ?, ?)`,
    [email, token, expiresAt]
  );
  return result;
}

export async function findValidOTP(email: string, otp: string): Promise<PasswordResetToken | null> {
  const [rows] = await pool.query(
    `SELECT * FROM password_reset_tokens 
     WHERE email = ? AND token = ? AND used = FALSE AND expires_at > NOW() 
     LIMIT 1`,
    [email, otp]
  );
  const result = rows as PasswordResetToken[];
  return result[0] ?? null;
}

export async function markTokenAsUsed(tokenId: number) {
  await pool.query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE id = ?`,
    [tokenId]
  );
}

export async function invalidateAllTokensForEmail(email: string) {
  await pool.query(
    `UPDATE password_reset_tokens SET used = TRUE WHERE email = ?`,
    [email]
  );
}

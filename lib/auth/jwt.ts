import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { UserRecord } from "../db/users";

export interface AuthTokenPayload extends JWTPayload {
  userId: number;
  role: UserRecord["role"];
  tenantId: number | null;
}

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  // 在 Edge Runtime 中，jose 可以直接接受 Uint8Array 作为 secret
  return new TextEncoder().encode(secret);
}

function getJwtExpiresIn() {
  return process.env.JWT_EXPIRES_IN || "7d";
}

export async function signAuthToken(user: UserRecord): Promise<string> {
  const payload: AuthTokenPayload = {
    userId: user.id,
    role: user.role,
    tenantId: user.tenant_id,
  };

  const expiresIn = getJwtExpiresIn();
  // 解析 expiresIn 字符串（如 "7d"）为秒数
  let seconds = 7 * 24 * 60 * 60; // 默认 7 天
  if (expiresIn.endsWith("d")) {
    const days = parseInt(expiresIn.slice(0, -1), 10);
    seconds = days * 24 * 60 * 60;
  } else if (expiresIn.endsWith("h")) {
    const hours = parseInt(expiresIn.slice(0, -1), 10);
    seconds = hours * 60 * 60;
  } else if (expiresIn.endsWith("m")) {
    const minutes = parseInt(expiresIn.slice(0, -1), 10);
    seconds = minutes * 60;
  } else if (expiresIn.endsWith("s")) {
    seconds = parseInt(expiresIn.slice(0, -1), 10);
  }

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + seconds)
    .sign(getJwtSecret());

  return jwt;
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as AuthTokenPayload;
  } catch (error) {
    throw new Error("Token không hợp lệ hoặc đã hết hạn");
  }
}


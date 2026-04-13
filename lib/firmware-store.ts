/**
 * In-memory one-time token registry for firmware OTA downloads.
 * Token expires after 30 minutes or after one successful download.
 * The file is deleted from disk after consumption.
 */
import { randomUUID } from "node:crypto";
import { rm } from "node:fs/promises";

const TTL_MS = 30 * 60 * 1000; // 30 minutes

interface FirmwareEntry {
  filePath: string;
  expiresAt: number;
}

const store = new Map<string, FirmwareEntry>();

export function registerFirmwareToken(filePath: string): string {
  const token = randomUUID();
  store.set(token, { filePath, expiresAt: Date.now() + TTL_MS });
  return token;
}

/** Returns filePath and removes the token (one-time use). Returns null if invalid/expired. */
export function consumeFirmwareToken(token: string): string | null {
  const entry = store.get(token);
  if (!entry) return null;

  store.delete(token);

  if (Date.now() > entry.expiresAt) return null;

  return entry.filePath;
}

/** Cleanup: delete expired entries and their files. Call periodically if needed. */
export async function purgeExpiredFirmware(): Promise<void> {
  const now = Date.now();
  for (const [token, entry] of store.entries()) {
    if (now > entry.expiresAt) {
      store.delete(token);
      await rm(entry.filePath, { force: true });
    }
  }
}

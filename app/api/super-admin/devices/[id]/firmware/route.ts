import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceById } from "@/lib/db/devices";
import { registerFirmwareToken } from "@/lib/firmware-store";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "firmware");

async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

interface Params {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/super-admin/devices/[id]/firmware
 * Accepts multipart/form-data with field "file" (.bin only, max 4 MB).
 * Saves to uploads/firmware/ (outside public/), registers a one-time download token,
 * and returns { token, downloadPath } so the client can construct the full URL
 * and send the OTA command.
 */
export async function POST(request: Request, { params }: Params) {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id: idParam } = await params;
  const deviceId = Number.parseInt(idParam, 10);
  if (Number.isNaN(deviceId)) {
    return NextResponse.json({ error: "ID không hợp lệ" }, { status: 400 });
  }

  const device = await getDeviceById(deviceId);
  if (!device) {
    return NextResponse.json({ error: "Thiết bị không tồn tại" }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Trường 'file' là bắt buộc" }, { status: 400 });
  }

  if (!file.name.endsWith(".bin")) {
    return NextResponse.json({ error: "Chỉ chấp nhận file .bin" }, { status: 400 });
  }

  const MAX_SIZE = 4 * 1024 * 1024; // 4 MB
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File quá lớn (tối đa 4 MB)" }, { status: 413 });
  }

  await ensureDir();

  // Sanitize filename, prepend timestamp to avoid collisions
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const savedName = `${Date.now()}_${safeName}`;
  const filePath = path.join(UPLOAD_DIR, savedName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const token = registerFirmwareToken(filePath);

  return NextResponse.json(
    {
      token,
      downloadPath: `/api/iot/firmware/${token}`,
    },
    { status: 201 },
  );
}

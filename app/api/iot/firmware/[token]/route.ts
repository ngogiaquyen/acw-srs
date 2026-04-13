import { NextResponse } from "next/server";
import { createReadStream, existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { consumeFirmwareToken } from "@/lib/firmware-store";
import { Readable } from "node:stream";

interface Params {
  params: Promise<{ token: string }>;
}

/**
 * GET /api/iot/firmware/[token]
 * No authentication — ESP32 cannot send auth headers.
 * Token is a one-time UUID valid for 30 minutes.
 * After one successful download the file is deleted from disk.
 */
export async function GET(_request: Request, { params }: Params) {
  const { token } = await params;

  if (!token || !/^[0-9a-f-]{36}$/.test(token)) {
    return NextResponse.json({ error: "Token không hợp lệ" }, { status: 400 });
  }

  const filePath = consumeFirmwareToken(token);

  if (!filePath) {
    return NextResponse.json(
      { error: "Token không tồn tại hoặc đã hết hạn" },
      { status: 404 },
    );
  }

  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File không tồn tại" }, { status: 404 });
  }

  // Stream the file to the ESP, then delete from disk
  const nodeStream = createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>;

  // Delete file after stream ends
  nodeStream.on("close", () => {
    rm(filePath, { force: true }).catch(() => {});
  });

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="firmware.bin"`,
      "Cache-Control": "no-store",
    },
  });
}

import { NextResponse } from "next/server";
import {
  getCurrentUserFromCookies,
} from "@/lib/auth/middleware";
import { getDeviceRemainingSecondsMap } from "@/lib/device-state";

export async function GET(request: Request) {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json({ remaining: {} });
  }

  const ids = idsParam
    .split(",")
    .map(Number)
    .filter((n) => Number.isFinite(n) && n > 0)
    .slice(0, 100);

  if (ids.length === 0) {
    return NextResponse.json({ remaining: {} });
  }

  const remainingMap = getDeviceRemainingSecondsMap(ids);

  const remaining: Record<number, number | null> = {};
  for (const id of ids) {
    remaining[id] = remainingMap.get(id) ?? null;
  }

  return NextResponse.json({ remaining });
}

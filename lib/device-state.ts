/**
 * In-memory store cho trạng thái thiết bị từ ESP32.
 * Không lưu DB - dữ liệu đến từ heartbeat của ESP32.
 * Module-level singleton tồn tại trong cùng Node.js process.
 */

interface DeviceStateEntry {
  remainingSeconds: number;
  updatedAt: number; // Date.now() ms
}

const stateMap = new Map<number, DeviceStateEntry>(); // key: device DB id (số nguyên)

/** Gọi khi nhận heartbeat từ ESP32 */
export function setDeviceRemainingSeconds(deviceDbId: number, seconds: number): void {
  stateMap.set(deviceDbId, {
    remainingSeconds: seconds > 0 ? seconds : 0,
    updatedAt: Date.now(),
  });
}

/**
 * Trả về giây còn lại đã điều chỉnh theo thời gian trôi qua kể từ heartbeat cuối.
 * Trả về null nếu chưa có dữ liệu từ thiết bị.
 */
export function getDeviceRemainingSeconds(deviceDbId: number): number | null {
  const entry = stateMap.get(deviceDbId);
  if (!entry) return null;

  const elapsedSeconds = Math.floor((Date.now() - entry.updatedAt) / 1000);
  const adjusted = entry.remainingSeconds - elapsedSeconds;
  return adjusted > 0 ? adjusted : 0;
}

/** Batch lookup cho danh sách thiết bị */
export function getDeviceRemainingSecondsMap(
  deviceDbIds: number[],
): Map<number, number> {
  const result = new Map<number, number>();
  for (const id of deviceDbIds) {
    const r = getDeviceRemainingSeconds(id);
    if (r !== null) result.set(id, r);
  }
  return result;
}

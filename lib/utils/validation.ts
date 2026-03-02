import type { SubscriptionStatus } from "../db/tenants";
import type { DeviceStatus } from "../db/devices";

export interface TenantPayload {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  licenseMaxDevices?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  isActive?: boolean;
}

export interface StationPayload {
  name?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  qrCode?: string;
  isActive?: boolean;
}

export interface DevicePayload {
  deviceId?: string;
  name?: string;
  stationId?: number | null;
  status?: DeviceStatus;
  firmwareVersion?: string | null;
  isActive?: boolean;
}

export interface PricingPayload {
  name?: string;
  stationId?: number | null;
  price?: number;
  durationMinutes?: number;
  isActive?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  "active",
  "suspended",
  "expired",
];

export function validateTenantPayload(
  payload: TenantPayload,
  options: { isCreate: boolean },
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { isCreate } = options;

  if (isCreate && !payload.name) {
    errors.push("Tên tenant là bắt buộc");
  }

  if (payload.name && (payload.name.length < 2 || payload.name.length > 255)) {
    errors.push("Tên tenant phải từ 2 đến 255 ký tự");
  }

  if (isCreate && !payload.email) {
    errors.push("Email là bắt buộc");
  }

  if (payload.email && !EMAIL_REGEX.test(payload.email)) {
    errors.push("Email không hợp lệ");
  }

  if (payload.phone && payload.phone.length > 20) {
    errors.push("Số điện thoại không được dài quá 20 ký tự");
  }

  if (
    payload.licenseMaxDevices !== undefined &&
    (!Number.isInteger(payload.licenseMaxDevices) || payload.licenseMaxDevices < 0)
  ) {
    errors.push("licenseMaxDevices phải là số nguyên không âm");
  }

  if (
    payload.subscriptionStatus &&
    !SUBSCRIPTION_STATUSES.includes(payload.subscriptionStatus)
  ) {
    errors.push("subscriptionStatus không hợp lệ");
  }

  if (payload.subscriptionStartDate) {
    const d = new Date(payload.subscriptionStartDate);
    if (Number.isNaN(d.getTime())) {
      errors.push("subscriptionStartDate không phải là ngày hợp lệ");
    }
  }

  if (payload.subscriptionEndDate) {
    const d = new Date(payload.subscriptionEndDate);
    if (Number.isNaN(d.getTime())) {
      errors.push("subscriptionEndDate không phải là ngày hợp lệ");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateStationPayload(
  payload: StationPayload,
  options: { isCreate: boolean },
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { isCreate } = options;

  if (isCreate && !payload.name) {
    errors.push("Tên trạm là bắt buộc");
  }

  if (payload.name && (payload.name.length < 2 || payload.name.length > 255)) {
    errors.push("Tên trạm phải từ 2 đến 255 ký tự");
  }

  if (isCreate && !payload.qrCode) {
    errors.push("QR code là bắt buộc");
  }

  if (payload.qrCode) {
    const qrRegex = /^[A-Za-z0-9_-]+$/;
    if (!qrRegex.test(payload.qrCode)) {
      errors.push("QR code chỉ được chứa chữ, số, dấu gạch ngang và gạch dưới");
    }
  }

  if (payload.latitude !== undefined && payload.latitude !== null) {
    if (
      Number.isNaN(payload.latitude) ||
      payload.latitude < -90 ||
      payload.latitude > 90
    ) {
      errors.push("Latitude không hợp lệ");
    }
  }

  if (payload.longitude !== undefined && payload.longitude !== null) {
    if (
      Number.isNaN(payload.longitude) ||
      payload.longitude < -180 ||
      payload.longitude > 180
    ) {
      errors.push("Longitude không hợp lệ");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateDevicePayload(
  payload: DevicePayload,
  options: { isCreate: boolean },
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { isCreate } = options;

  if (isCreate && !payload.deviceId) {
    errors.push("Device ID là bắt buộc");
  }

  if (payload.deviceId && payload.deviceId.length > 255) {
    errors.push("Device ID không được dài quá 255 ký tự");
  }

  if (isCreate && !payload.name) {
    errors.push("Tên thiết bị là bắt buộc");
  }

  if (payload.name && (payload.name.length < 2 || payload.name.length > 255)) {
    errors.push("Tên thiết bị phải từ 2 đến 255 ký tự");
  }

  if (
    payload.stationId !== undefined &&
    payload.stationId !== null &&
    (!Number.isInteger(payload.stationId) || payload.stationId <= 0)
  ) {
    errors.push("stationId phải là số nguyên dương");
  }

  const VALID_DEVICE_STATUSES: DeviceStatus[] = ["online", "offline", "maintenance"];
  if (payload.status && !VALID_DEVICE_STATUSES.includes(payload.status)) {
    errors.push("status thiết bị không hợp lệ");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validatePricingPayload(
  payload: PricingPayload,
  options: { isCreate: boolean },
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const { isCreate } = options;

  if (isCreate && !payload.name) {
    errors.push("Tên gói giá là bắt buộc");
  }

  if (payload.name && (payload.name.length < 2 || payload.name.length > 255)) {
    errors.push("Tên gói giá phải từ 2 đến 255 ký tự");
  }

  if (payload.price !== undefined) {
    if (Number.isNaN(payload.price) || payload.price < 0) {
      errors.push("Giá phải là số không âm");
    }
  } else if (isCreate) {
    errors.push("Giá là bắt buộc");
  }

  if (payload.durationMinutes !== undefined) {
    if (
      !Number.isInteger(payload.durationMinutes) ||
      payload.durationMinutes <= 0
    ) {
      errors.push("Thời lượng phải là số nguyên dương (phút)");
    }
  } else if (isCreate) {
    errors.push("Thời lượng là bắt buộc");
  }

  if (
    payload.stationId !== undefined &&
    payload.stationId !== null &&
    (!Number.isInteger(payload.stationId) || payload.stationId <= 0)
  ) {
    errors.push("stationId phải là số nguyên dương");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

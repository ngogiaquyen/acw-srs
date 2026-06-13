import type { SubscriptionStatus } from "../db/tenants";

export interface TenantPayload {
  name?: string;
  email?: string;
  phone?: string | null;
  address?: string | null;
  licenseMaxDevices?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionStartDate?: string | null;
  subscriptionEndDate?: string | null;
  allowExpiredAccess?: boolean;
  isActive?: boolean;
  // SePay configuration
  sepayBankAccount?: string | null;
  sepayBankCode?: string | null;
  sepayAccountName?: string | null;
  sepayWebhookSecret?: string | null;
  // Admin credentials
  adminPassword?: string;
}


export interface StationPayload {
  name?: string;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isActive?: boolean;
}

export interface DevicePayload {
  deviceId?: string;
  name?: string;
  paymentCode?: string | null;
  webUsername?: string | null;
  webPassword?: string | null;
  firmwareVersion?: string | null;
  pricePerMinute?: number | null;
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

  // Admin credentials validation
  if (isCreate && !payload.adminPassword) {
    errors.push("Mật khẩu admin là bắt buộc");
  }

  if (payload.adminPassword && payload.adminPassword.length < 6) {
    errors.push("Mật khẩu admin phải từ 6 ký tự trở lên");
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
    payload.pricePerMinute !== undefined &&
    payload.pricePerMinute !== null &&
    (Number.isNaN(payload.pricePerMinute) || payload.pricePerMinute <= 0)
  ) {
    errors.push("Giá mỗi phút phải là số dương");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}


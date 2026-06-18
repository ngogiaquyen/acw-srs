import { pool } from "./connection";

export interface SuperAdminRevenueSummary {
  totalRevenue: number;
  revenueToday: number;
  totalTransactions: number;
  transactionsToday: number;
  totalTenants: number;
  activeTenants: number;
  totalDevices: number;
  onlineDevices: number;
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  transactions: number;
}

export interface TenantRevenuePoint {
  tenantId: number;
  tenantName: string;
  revenue: number;
  transactions: number;
  devices: number;
}

export async function getSuperAdminRevenueSummary(
  tenantId?: number,
  deviceId?: number
): Promise<SuperAdminRevenueSummary> {
  let tenantFilter = "";
  const queryParams: unknown[] = [];
  if (tenantId) {
    tenantFilter = "WHERE id = ?";
    queryParams.push(tenantId);
  }

  const [tenantRows] = await pool.query(
    `
    SELECT
      COUNT(*) AS totalTenants,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS activeTenants
    FROM tenants
    ${tenantFilter}
  `,
    queryParams
  );
  const [tenantRow] = tenantRows as Array<{ totalTenants: number; activeTenants: number | null }>;

  let deviceFilter = "WHERE is_active = 1";
  const deviceParams: unknown[] = [];
  if (tenantId) {
    deviceFilter += " AND tenant_id = ?";
    deviceParams.push(tenantId);
  }
  if (deviceId) {
    deviceFilter += " AND id = ?";
    deviceParams.push(deviceId);
  }

  const [deviceRows] = await pool.query(
    `
    SELECT
      COUNT(*) AS totalDevices,
      COUNT(*) AS onlineDevices
    FROM devices
    ${deviceFilter}
  `,
    deviceParams
  );
  const [deviceRow] = deviceRows as Array<{ totalDevices: number; onlineDevices: number | null }>;

  let txnFilter = "WHERE 1=1";
  const txnParams: unknown[] = [];
  if (tenantId) {
    txnFilter += " AND tenant_id = ?";
    txnParams.push(tenantId);
  }
  if (deviceId) {
    txnFilter += " AND device_id = ?";
    txnParams.push(deviceId);
  }

  const [txnRows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS totalRevenue,
      COALESCE(SUM(CASE WHEN status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) AS revenueToday,
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS transactionsToday
    FROM transactions
    ${txnFilter}
  `,
    txnParams
  );
  const [txnRow] = txnRows as Array<{
    totalRevenue: number | string;
    revenueToday: number | string;
    totalTransactions: number;
    transactionsToday: number | null;
  }>;

  const tenants = tenantRow;
  const devices = deviceRow;
  const txns = txnRow;

  return {
    totalRevenue: Number(txns.totalRevenue ?? 0),
    revenueToday: Number(txns.revenueToday ?? 0),
    totalTransactions: Number(txns.totalTransactions ?? 0),
    transactionsToday: Number(txns.transactionsToday ?? 0),
    totalTenants: Number(tenants.totalTenants ?? 0),
    activeTenants: Number(tenants.activeTenants ?? 0),
    totalDevices: Number(devices.totalDevices ?? 0),
    onlineDevices: Number(devices.onlineDevices ?? 0),
  };
}

export async function getSuperAdminRevenueAnalytics(
  days = 30,
  tenantId?: number,
  deviceId?: number
): Promise<RevenuePoint[]> {
  const safeDays = Math.min(Math.max(days, 1), 365);

  let filter = "";
  const params: unknown[] = [safeDays - 1];

  if (tenantId) {
    filter += " AND tenant_id = ?";
    params.push(tenantId);
  }
  if (deviceId) {
    filter += " AND device_id = ?";
    params.push(deviceId);
  }

  const [rows] = await pool.query(
    `
    SELECT
      DATE(created_at) AS date,
      COALESCE(SUM(amount), 0) AS revenue,
      COUNT(*) AS transactions
    FROM transactions
    WHERE status = 'completed'
      AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      ${filter}
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `,
    params,
  );

  const rawRows = rows as Array<{
    date: string | Date;
    revenue: number | string;
    transactions: number;
  }>;

  const map = new Map<string, RevenuePoint>();

  for (const row of rawRows) {
    const date = new Date(row.date).toISOString().slice(0, 10);
    map.set(date, {
      date,
      revenue: Number(row.revenue ?? 0),
      transactions: Number(row.transactions ?? 0),
    });
  }

  const result: RevenuePoint[] = [];
  const now = new Date();

  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    result.push(
      map.get(key) ?? {
        date: key,
        revenue: 0,
        transactions: 0,
      },
    );
  }

  return result;
}

export async function getTenantRevenueComparison(limit = 10): Promise<TenantRevenuePoint[]> {
  const safeLimit = Math.min(Math.max(limit, 1), 50);

  const [rows] = await pool.query(
    `
    SELECT
      t.id AS tenantId,
      t.name AS tenantName,
      COALESCE(SUM(CASE WHEN tr.status = 'completed' THEN tr.amount ELSE 0 END), 0) AS revenue,
      COALESCE(SUM(CASE WHEN tr.status = 'completed' THEN 1 ELSE 0 END), 0) AS transactions,
      COALESCE(COUNT(DISTINCT d.id), 0) AS devices
    FROM tenants t
    LEFT JOIN transactions tr ON tr.tenant_id = t.id
    LEFT JOIN devices d ON d.tenant_id = t.id AND d.is_active = 1
    GROUP BY t.id, t.name
    ORDER BY revenue DESC
    LIMIT ?
  `,
    [safeLimit],
  );

  return (rows as Array<{
    tenantId: number;
    tenantName: string;
    revenue: number | string;
    transactions: number;
    devices: number;
  }>).map((row) => ({
    tenantId: row.tenantId,
    tenantName: row.tenantName,
    revenue: Number(row.revenue ?? 0),
    transactions: Number(row.transactions ?? 0),
    devices: Number(row.devices ?? 0),
  }));
}

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

export async function getSuperAdminRevenueSummary(): Promise<SuperAdminRevenueSummary> {
  const [[tenantRow]] = await pool.query(
    `
    SELECT
      COUNT(*) AS totalTenants,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS activeTenants
    FROM tenants
  `,
  );

  const [[deviceRow]] = await pool.query(
    `
    SELECT
      COUNT(*) AS totalDevices,
      SUM(CASE WHEN status = 'online' THEN 1 ELSE 0 END) AS onlineDevices
    FROM devices
    WHERE is_active = 1
  `,
  );

  const [[txnRow]] = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS totalRevenue,
      COALESCE(SUM(CASE WHEN status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) AS revenueToday,
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS transactionsToday
    FROM transactions
  `,
  );

  const tenants = tenantRow as { totalTenants: number; activeTenants: number | null };
  const devices = deviceRow as { totalDevices: number; onlineDevices: number | null };
  const txns = txnRow as {
    totalRevenue: number | string;
    revenueToday: number | string;
    totalTransactions: number;
    transactionsToday: number | null;
  };

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

export async function getSuperAdminRevenueAnalytics(days = 30): Promise<RevenuePoint[]> {
  const safeDays = Math.min(Math.max(days, 1), 365);

  const [rows] = await pool.query(
    `
    SELECT
      DATE(created_at) AS date,
      COALESCE(SUM(amount), 0) AS revenue,
      COUNT(*) AS transactions
    FROM transactions
    WHERE status = 'completed'
      AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `,
    [safeDays - 1],
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

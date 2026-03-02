import { pool } from "./connection";

export interface TenantRevenueSummary {
  tenantId: number;
  totalRevenue: number;
  revenueToday: number;
  totalTransactions: number;
  transactionsToday: number;
}

export interface TenantRevenuePoint {
  date: string;
  revenue: number;
  transactions: number;
}

export async function getTenantRevenueSummary(
  tenantId: number,
): Promise<TenantRevenueSummary> {
  const [[row]] = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS totalRevenue,
      COALESCE(SUM(CASE WHEN status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) AS revenueToday,
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS transactionsToday
    FROM transactions
    WHERE tenant_id = ?
  `,
    [tenantId],
  );

  const stats = row as {
    totalRevenue: number | string;
    revenueToday: number | string;
    totalTransactions: number;
    transactionsToday: number | null;
  };

  return {
    tenantId,
    totalRevenue: Number(stats.totalRevenue ?? 0),
    revenueToday: Number(stats.revenueToday ?? 0),
    totalTransactions: Number(stats.totalTransactions ?? 0),
    transactionsToday: Number(stats.transactionsToday ?? 0),
  };
}

export async function getTenantRevenueAnalytics(
  tenantId: number,
  days = 30,
): Promise<TenantRevenuePoint[]> {
  const safeDays = Math.min(Math.max(days, 1), 365);

  const [rows] = await pool.query(
    `
    SELECT
      DATE(created_at) AS date,
      COALESCE(SUM(amount), 0) AS revenue,
      COUNT(*) AS transactions
    FROM transactions
    WHERE tenant_id = ?
      AND status = 'completed'
      AND DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `,
    [tenantId, safeDays - 1],
  );

  const rawRows = rows as Array<{
    date: string | Date;
    revenue: number | string;
    transactions: number;
  }>;

  const map = new Map<string, TenantRevenuePoint>();
  for (const row of rawRows) {
    const date = new Date(row.date).toISOString().slice(0, 10);
    map.set(date, {
      date,
      revenue: Number(row.revenue ?? 0),
      transactions: Number(row.transactions ?? 0),
    });
  }

  const result: TenantRevenuePoint[] = [];
  const now = new Date();
  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    result.push(map.get(key) ?? { date: key, revenue: 0, transactions: 0 });
  }

  return result;
}

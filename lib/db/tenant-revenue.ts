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
  startDate?: string,
  endDate?: string
): Promise<TenantRevenueSummary> {
  let filter = "WHERE tenant_id = ?";
  const params: unknown[] = [tenantId];

  if (startDate) {
    filter += " AND DATE(created_at) >= ?";
    params.push(startDate);
  }
  if (endDate) {
    filter += " AND DATE(created_at) <= ?";
    params.push(endDate);
  }

  const [resultRows] = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0) AS totalRevenue,
      COALESCE(SUM(CASE WHEN status = 'completed' AND DATE(created_at) = CURDATE() THEN amount ELSE 0 END), 0) AS revenueToday,
      COUNT(*) AS totalTransactions,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) AS transactionsToday
    FROM transactions
    ${filter}
  `,
    params,
  );
  const [row] = resultRows as Array<{
    totalRevenue: number | string;
    revenueToday: number | string;
    totalTransactions: number;
    transactionsToday: number | null;
  }>;

  const stats = row;

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
  startDate?: string,
  endDate?: string
): Promise<TenantRevenuePoint[]> {
  // Calculate actual start and end if not provided
  let actualStart = startDate;
  let actualEnd = endDate;

  if (!actualEnd) {
    const today = new Date();
    // Offset by timezone to get local YYYY-MM-DD
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    actualEnd = localDate.toISOString().split('T')[0];
  }
  if (!actualStart) {
    const end = new Date(actualEnd);
    end.setDate(end.getDate() - 29); // 30 days total including end
    actualStart = end.toISOString().split('T')[0];
  }

  const [rows] = await pool.query(
    `
    SELECT
      DATE(created_at) AS date,
      COALESCE(SUM(amount), 0) AS revenue,
      COUNT(*) AS transactions
    FROM transactions
    WHERE tenant_id = ?
      AND status = 'completed'
      AND DATE(created_at) >= ? AND DATE(created_at) <= ?
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) ASC
  `,
    [tenantId, actualStart, actualEnd],
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
  const currDate = new Date(actualStart);
  const lastDate = new Date(actualEnd);

  while (currDate <= lastDate) {
    const key = currDate.toISOString().slice(0, 10);
    result.push(map.get(key) ?? { date: key, revenue: 0, transactions: 0 });
    currDate.setDate(currDate.getDate() + 1);
  }

  return result;
}

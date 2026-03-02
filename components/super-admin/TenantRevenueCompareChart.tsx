"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface TenantRevenueCompareItem {
  tenantId: number;
  tenantName: string;
  revenue: number;
  transactions: number;
  devices: number;
}

interface TenantRevenueCompareChartProps {
  data: TenantRevenueCompareItem[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

export function TenantRevenueCompareChart({ data }: TenantRevenueCompareChartProps) {
  return (
    <div className="h-96 rounded-lg border p-3">
      <p className="mb-3 text-sm font-medium">So sánh doanh thu theo tenant</p>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`} />
          <YAxis type="category" dataKey="tenantName" width={130} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => formatCurrency(Number(v))} />
          <Bar dataKey="revenue" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

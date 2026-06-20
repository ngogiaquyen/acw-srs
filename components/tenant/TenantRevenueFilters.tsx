"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function TenantRevenueFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all" || !value) {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <Card className="p-4 mb-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            value={currentStartDate}
            onChange={(e) => {
              router.push(`?${createQueryString("startDate", e.target.value)}`);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            value={currentEndDate}
            onChange={(e) => {
              router.push(`?${createQueryString("endDate", e.target.value)}`);
            }}
          />
        </div>
      </div>
    </Card>
  );
}

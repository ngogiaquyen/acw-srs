"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Tenant {
  id: number;
  name: string;
}

interface Device {
  id: number;
  name: string;
  tenant_id: number;
}

interface RevenueFiltersProps {
  tenants: Tenant[];
  devices: Device[];
}

export function RevenueFilters({ tenants, devices }: RevenueFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTenantId = searchParams.get("tenantId") || "all";
  const currentDeviceId = searchParams.get("deviceId") || "all";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";

  // Filter devices based on selected tenant
  const filteredDevices =
    currentTenantId !== "all"
      ? devices.filter((d) => d.tenant_id === Number(currentTenantId))
      : devices;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
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
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label>Chủ trạm</Label>
          <Select
            value={currentTenantId}
            onValueChange={(val) => {
              // When changing tenant, reset device filter
              let qs = createQueryString("tenantId", val);
              const params = new URLSearchParams(qs);
              params.delete("deviceId");
              qs = params.toString();
              router.push(`?${qs}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả chủ trạm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả chủ trạm</SelectItem>
              {tenants.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name} (ID: {t.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Thiết bị</Label>
          <Select
            value={currentDeviceId}
            onValueChange={(val) => {
              router.push(`?${createQueryString("deviceId", val)}`);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tất cả thiết bị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thiết bị</SelectItem>
              {filteredDevices.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name} (ID: {d.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Từ ngày</Label>
          <Input
            type="date"
            value={currentStartDate}
            onChange={(e) => {
              router.push(`?${createQueryString("startDate", e.target.value || "all")}`);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Đến ngày</Label>
          <Input
            type="date"
            value={currentEndDate}
            onChange={(e) => {
              router.push(`?${createQueryString("endDate", e.target.value || "all")}`);
            }}
          />
        </div>
      </div>
    </Card>
  );
}

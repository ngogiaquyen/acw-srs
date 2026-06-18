"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeviceOption {
  id: number;
  device_id: string;
  name: string;
}

interface Props {
  devices: DeviceOption[];
  currentDeviceId: string | null;
}

export function TransactionDeviceFilter({ devices, currentDeviceId }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("device");
    } else {
      params.set("device", value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentDeviceId ?? "all"} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px] bg-white">
        <SelectValue placeholder="Tất cả các thiết bị" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tất cả các thiết bị</SelectItem>
        {devices.map((device) => (
          <SelectItem key={device.id} value={device.id.toString()}>
            {device.name} ({device.device_id})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

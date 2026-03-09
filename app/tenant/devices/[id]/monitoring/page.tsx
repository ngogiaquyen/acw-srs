import { notFound } from "next/navigation";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";
import { getDeviceByIdAndTenantId } from "@/lib/db/devices";
import { getDeviceLogsByDeviceId } from "@/lib/db/device-logs";
import { DeviceControlPanel } from "@/components/tenant/DeviceControlPanel";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function TenantDeviceMonitoringPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();

  if (!auth.isAuthenticated || !auth.user.tenantId) {
    notFound();
  }

  const { id: idParam } = await params;
  const id = Number.parseInt(idParam, 10);
  if (Number.isNaN(id)) {
    notFound();
  }

  const device = await getDeviceByIdAndTenantId(id, auth.user.tenantId);
  if (!device) {
    notFound();
  }

  const logs = await getDeviceLogsByDeviceId(device.id, 50);

  return <DeviceControlPanel device={device} initialLogs={logs} />;
}

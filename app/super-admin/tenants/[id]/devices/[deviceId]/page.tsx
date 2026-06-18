import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/ui/copy-button";
import { SectionHeader } from "@/components/ui/section-header";
import { PasswordField } from "@/components/tenant/PasswordField";
import { DeviceOtaPanel } from "@/components/super-admin/DeviceOtaPanel";
import { DeviceControlPanel } from "@/components/tenant/DeviceControlPanel";
import { getDeviceById } from "@/lib/db/devices";
import { getRecentCommandsByDeviceId } from "@/lib/db/device-commands";
import { getDeviceLogsByDeviceId } from "@/lib/db/device-logs";
import { getCurrentUserFromCookies } from "@/lib/auth/middleware";

interface Props {
  params: Promise<{ id: string; deviceId: string }>;
}

export default async function SuperAdminDeviceDetailPage({ params }: Props) {
  const auth = await getCurrentUserFromCookies();
  if (!auth.isAuthenticated || auth.user.role !== "SUPER_ADMIN") notFound();

  const { id: tenantIdParam, deviceId: deviceIdParam } = await params;
  const deviceId = Number.parseInt(deviceIdParam, 10);
  if (Number.isNaN(deviceId)) notFound();

  const [device, commands, logs] = await Promise.all([
    getDeviceById(deviceId),
    getRecentCommandsByDeviceId(deviceId, 20),
    getDeviceLogsByDeviceId(deviceId, 50),
  ]);

  if (!device) notFound();

  return (
    <div className="space-y-4">
      <div className="mb-2 text-sm text-muted-foreground">
        <Link href={`/super-admin/tenants/${tenantIdParam}`} className="hover:underline">
          ← Quay lại chủ trạm
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="space-y-4">
          <SectionHeader
            title="Chi tiết thiết bị"
            description={`Thiết bị #${device.id}`}
            actions={
              <Button asChild variant="outline">
                <Link href={`/super-admin/tenants/${tenantIdParam}/devices/${device.id}/edit`}>Chỉnh sửa</Link>
              </Button>
            }
          />
          <Card className="p-6">
            <dl className="grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Device ID</dt>
                <dd className="font-medium flex items-center gap-2">
                  {device.device_id}
                  <CopyButton value={device.device_id} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Tên thiết bị</dt>
                <dd className="font-medium">{device.name}</dd>
              </div>

              <div>
                <dt className="text-xs text-muted-foreground">Giá mỗi phút</dt>
                <dd className="font-medium">
                  {device.price_per_minute
                    ? `${Number(device.price_per_minute).toLocaleString("vi-VN")} VNĐ`
                    : "Chưa thiết lập"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Mã nội dung chuyển khoản</dt>
                <dd className="font-medium flex items-center gap-2">
                  {device.payment_code ? `SEVQR ${device.payment_code}` : "(Dùng mặc định theo device)"}
                  {device.payment_code && <CopyButton value={`SEVQR ${device.payment_code}`} />}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Username đăng nhập web ESP</dt>
                <dd className="font-medium">{device.web_username ?? "-"}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Password đăng nhập web ESP</dt>
                <dd>
                  <PasswordField value={device.web_password} />
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">URL trang cấu hình ESP</dt>
                <dd className="font-medium">
                  {device.last_ip ? (
                    <a
                      href={`http://${device.last_ip}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      http://{device.last_ip}/
                    </a>
                  ) : (
                    <span className="text-muted-foreground">Chưa có heartbeat</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Kích hoạt</dt>
                <dd>
                  <Badge variant={device.is_active ? "default" : "outline"}>
                    {device.is_active ? "Đang kích hoạt" : "Vô hiệu hóa"}
                  </Badge>
                </dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-xs text-muted-foreground">Lần gửi tín hiệu gần nhất</dt>
                <dd className="font-medium">
                  {device.last_heartbeat ? new Date(device.last_heartbeat).toLocaleString("vi-VN") : "-"}
                </dd>
              </div>
            </dl>
          </Card>

          {/* OTA + credentials + command history */}
          <DeviceOtaPanel
            deviceId={device.id}
            webUsername={device.web_username}
            webPassword={device.web_password}
            lastIp={device.last_ip}
            recentCommands={commands.map((c) => ({
              ...c,
              created_at: c.created_at instanceof Date ? c.created_at.toISOString() : String(c.created_at),
              executed_at: c.executed_at instanceof Date ? c.executed_at.toISOString() : c.executed_at ? String(c.executed_at) : null,
            }))}
          />
        </div>

        <DeviceControlPanel device={device} initialLogs={logs} />
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";

export default async function TenantNewDevicePage() {
  // Tenants are not allowed to create devices — only Super Admin can register devices.
  redirect("/tenant/devices");
}

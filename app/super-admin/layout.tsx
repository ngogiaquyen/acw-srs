import { SuperAdminLayout } from "@/components/super-admin/Layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>;
}

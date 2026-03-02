import { TenantLayout } from "@/components/tenant/Layout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TenantLayout>{children}</TenantLayout>;
}

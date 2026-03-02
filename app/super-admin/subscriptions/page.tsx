import { SubscriptionCreateForm } from "@/components/super-admin/SubscriptionCreateForm";
import { SubscriptionList } from "@/components/super-admin/SubscriptionList";
import { getSubscriptions } from "@/lib/db/subscriptions";
import { getTenants } from "@/lib/db/tenants";

export default async function SuperAdminSubscriptionsPage() {
  const [subscriptions, tenants] = await Promise.all([getSubscriptions(), getTenants()]);

  const tenantMap = new Map(tenants.map((t) => [t.id, t.name]));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Subscriptions</h2>
        <p className="text-sm text-muted-foreground">
          Quản lý gói subscription của tenant.
        </p>
      </div>

      <SubscriptionCreateForm tenants={tenants.map((t) => ({ id: t.id, name: t.name }))} />
      <SubscriptionList subscriptions={subscriptions} tenantMap={tenantMap} />
    </div>
  );
}

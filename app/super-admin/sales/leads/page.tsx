import { LeadList } from "@/components/super-admin/LeadList";
import { getLeads } from "@/lib/db/leads";

export default async function SuperAdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Leads</h2>
        <p className="text-sm text-muted-foreground">Quản lý khách hàng tiềm năng.</p>
      </div>

      <LeadList leads={leads} />
    </div>
  );
}

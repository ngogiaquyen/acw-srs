import { createInvoice, generateInvoiceNumber, markOverdueInvoices } from "./invoices";
import { expireOverdueSubscriptions, getSubscriptions } from "./subscriptions";
import { getTenantById, updateTenant } from "./tenants";

export async function generateMonthlyInvoicesJob() {
  const subscriptions = await getSubscriptions();
  const activeSubscriptions = subscriptions.filter(
    (s) => s.status === "active" && Boolean(s.is_active),
  );

  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7);

  const createdInvoices = [];

  for (const sub of activeSubscriptions) {
    const invoice = await createInvoice({
      tenantId: sub.tenant_id,
      subscriptionId: sub.id,
      invoiceNumber: generateInvoiceNumber(),
      amount: Number(sub.amount),
      dueDate,
      description: `Hóa đơn subscription ${sub.plan_name}`,
    });

    createdInvoices.push(invoice);
  }

  return {
    createdCount: createdInvoices.length,
    invoices: createdInvoices,
  };
}

export async function runBillingMaintenanceJob() {
  const overdueInvoices = await markOverdueInvoices();
  const expiredSubscriptions = await expireOverdueSubscriptions();

  // Vô hiệu hóa tenant nếu subscription đã hết hạn
  const expiredSubs = await getSubscriptions();
  const expiredActiveSubs = expiredSubs.filter(
    (s) => s.status === "expired" && Boolean(s.is_active) === false,
  );

  let deactivatedTenants = 0;
  for (const sub of expiredActiveSubs) {
    const tenant = await getTenantById(sub.tenant_id);
    if (tenant && Boolean(tenant.is_active)) {
      await updateTenant(sub.tenant_id, {
        subscriptionStatus: "expired",
        isActive: false,
      });
      deactivatedTenants += 1;
    }
  }

  return {
    overdueInvoices,
    expiredSubscriptions,
    deactivatedTenants,
  };
}

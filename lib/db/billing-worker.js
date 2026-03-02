/* eslint-disable no-console */

const mysql = require("mysql2/promise");

async function getConnection() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  return mysql.createConnection(databaseUrl);
}

function generateInvoiceNumber(prefix = "INV") {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${y}${m}${d}-${rand}`;
}

async function runBillingJobOnce() {
  const connection = await getConnection();

  try {
    const [subscriptions] = await connection.query(
      "SELECT * FROM subscriptions WHERE status = 'active' AND is_active = 1",
    );

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    let createdCount = 0;

    for (const sub of subscriptions) {
      await connection.query(
        `INSERT INTO invoices (tenant_id, subscription_id, invoice_number, amount, currency, due_date, status, description, is_active)
         VALUES (?, ?, ?, ?, 'VND', ?, 'pending', ?, 1)`,
        [
          sub.tenant_id,
          sub.id,
          generateInvoiceNumber(),
          sub.amount,
          dueDate,
          `Hóa đơn subscription ${sub.plan_name}`,
        ],
      );
      createdCount += 1;
    }

    const [overdueInvoiceResult] = await connection.query(
      "UPDATE invoices SET status = 'overdue' WHERE status = 'pending' AND due_date < CURDATE()",
    );

    const [expiredSubscriptionResult] = await connection.query(
      "UPDATE subscriptions SET status = 'expired', is_active = 0 WHERE end_date < CURDATE() AND status IN ('active','past_due')",
    );

    // Vô hiệu hóa tenant nếu subscription đã hết hạn
    const [expiredSubs] = await connection.query(
      "SELECT tenant_id FROM subscriptions WHERE status = 'expired' AND is_active = 0",
    );

    let deactivatedTenants = 0;
    for (const sub of expiredSubs) {
      const [tenantRows] = await connection.query(
        "SELECT id, is_active FROM tenants WHERE id = ? AND is_active = 1",
        [sub.tenant_id],
      );
      if (tenantRows.length > 0) {
        await connection.query(
          "UPDATE tenants SET subscription_status = 'expired', is_active = 0 WHERE id = ?",
          [sub.tenant_id],
        );
        deactivatedTenants += 1;
      }
    }

    console.log(`[billing-worker] Created ${createdCount} invoices.`);
    console.log(
      `[billing-worker] Marked overdue invoices: ${overdueInvoiceResult.affectedRows ?? 0}.`,
    );
    console.log(
      `[billing-worker] Expired subscriptions: ${expiredSubscriptionResult.affectedRows ?? 0}.`,
    );
    console.log(
      `[billing-worker] Deactivated tenants: ${deactivatedTenants}.`,
    );
  } finally {
    await connection.end();
  }
}

async function main() {
  const mode = process.argv[2] || "once";

  if (mode === "once") {
    await runBillingJobOnce();
    return;
  }

  const intervalMs = Number.parseInt(process.env.BILLING_WORKER_INTERVAL_MS || "86400000", 10);

  console.log(`[billing-worker] Running in worker mode every ${intervalMs}ms.`);

  await runBillingJobOnce();

  setInterval(async () => {
    try {
      await runBillingJobOnce();
    } catch (error) {
      console.error("[billing-worker] Error:", error);
    }
  }, intervalMs);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

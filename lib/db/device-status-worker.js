/* eslint-disable no-console */

const mysql = require("mysql2/promise");

const INTERVAL_SECONDS = Number.parseInt(
  process.env.DEVICE_OFFLINE_JOB_INTERVAL_SECONDS || "60",
  10,
);

const OFFLINE_TIMEOUT_MINUTES = Number.parseInt(
  process.env.DEVICE_OFFLINE_TIMEOUT_MINUTES || "5",
  10,
);

function isValidPositiveNumber(value) {
  return Number.isInteger(value) && value > 0;
}

async function getConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  return mysql.createConnection(databaseUrl);
}

async function runOnce() {
  const connection = await getConnection();

  try {
    const [result] = await connection.query(
      `
      UPDATE devices
      SET status = 'offline'
      WHERE status = 'online'
        AND last_heartbeat IS NOT NULL
        AND last_heartbeat < (NOW() - INTERVAL ? MINUTE)
    `,
      [OFFLINE_TIMEOUT_MINUTES],
    );

    const affectedRows = result && typeof result.affectedRows === "number"
      ? result.affectedRows
      : 0;

    console.log(
      `[device-status-worker] done | timeout=${OFFLINE_TIMEOUT_MINUTES}m | affected=${affectedRows}`,
    );
  } finally {
    await connection.end();
  }
}

async function startWorker() {
  if (!isValidPositiveNumber(INTERVAL_SECONDS)) {
    throw new Error("DEVICE_OFFLINE_JOB_INTERVAL_SECONDS phải là số nguyên dương");
  }

  if (!isValidPositiveNumber(OFFLINE_TIMEOUT_MINUTES)) {
    throw new Error("DEVICE_OFFLINE_TIMEOUT_MINUTES phải là số nguyên dương");
  }

  console.log(
    `[device-status-worker] started | interval=${INTERVAL_SECONDS}s | timeout=${OFFLINE_TIMEOUT_MINUTES}m`,
  );

  await runOnce();

  setInterval(async () => {
    try {
      await runOnce();
    } catch (error) {
      console.error("[device-status-worker] run failed:", error);
    }
  }, INTERVAL_SECONDS * 1000);
}

const mode = process.argv[2];

if (mode === "once") {
  runOnce().catch((error) => {
    console.error("[device-status-worker] failed:", error);
    process.exitCode = 1;
  });
} else {
  startWorker().catch((error) => {
    console.error("[device-status-worker] failed to start:", error);
    process.exitCode = 1;
  });
}

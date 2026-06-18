const mysql = require('mysql2/promise');

async function run() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  await conn.query("ALTER TABLE devices MODIFY price_per_minute INT DEFAULT NULL");
  console.log("Migration successful");
  await conn.end();
}
run().catch(console.error);

// Script để generate password hash cho super admin
// Chạy: node lib/db/generate_password_hash.js

const bcrypt = require("bcryptjs");

const password = process.argv[2] || "admin123";
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error generating hash:", err);
    process.exit(1);
  }

  console.log("\n===========================================");
  console.log("PASSWORD HASH GENERATOR");
  console.log("===========================================");
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log("\nSQL INSERT statement:");
  console.log("-------------------------------------------");
  console.log(
    `INSERT INTO users (email, password_hash, role, tenant_id, name, phone, is_active)\nVALUES (\n  'admin@example.com',\n  '${hash}',\n  'SUPER_ADMIN',\n  NULL,\n  'Super Admin',\n  NULL,\n  TRUE\n);`
  );
  console.log("===========================================\n");
});

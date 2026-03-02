// Simple migration runner using mysql2 and SQL files

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

async function getConnection() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set in environment variables");
  }

  return mysql.createConnection(databaseUrl);
}

async function runMigrations() {
  const migrationsDir = path.join(__dirname, "migrations");

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No migration files found.");
    return;
  }

  const connection = await getConnection();

  try {
    console.log("Connected to database. Running migrations...");

    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`\nRunning migration: ${file}`);
      await connection.query(sql);
      console.log(`Migration ${file} executed successfully.`);
    }

    console.log("\nAll migrations executed successfully.");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

runMigrations();


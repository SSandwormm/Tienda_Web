const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

console.log(
  "[Config] DATABASE_URL cargada desde",
  envPath,
  ":",
  process.env.DATABASE_URL ? "si" : "no",
);

const getPool = require("../db/pool");

async function migrate() {
  const schema = fs.readFileSync(
    path.join(__dirname, "../db/schema.sql"),
    "utf8",
  );
  const pool = getPool();

  try {
    await pool.query(schema);
    console.log("Migracion PostgreSQL completada.");
  } finally {
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("No se pudo ejecutar la migracion:", error.message);
  process.exitCode = 1;
});

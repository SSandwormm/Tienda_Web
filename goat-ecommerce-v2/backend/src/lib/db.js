const { Pool } = require("pg");

let pool;

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL no esta configurada. Anade DATABASE_URL a tu archivo .env.",
    );
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.DATABASE_POOL_MAX || 10),
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
      ssl:
        process.env.NODE_ENV === "production"
          ? { rejectUnauthorized: false }
          : false,
    });
  }

  return pool;
}

async function query(text, values) {
  return getPool().query(text, values);
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}

module.exports = { closePool, getPool, query };

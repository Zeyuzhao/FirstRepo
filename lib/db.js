import "server-only";
import pg from "pg";

const { Pool } = pg;

const globalForPg = globalThis;

function connectionString() {
  return process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
}

function sslFor(url) {
  if (!url || /localhost|127\.0\.0\.1/.test(url)) {
    return undefined;
  }

  if (url.includes("sslmode=disable")) {
    return undefined;
  }

  if (
    url.includes("sslmode=require") ||
    url.includes("neon.tech") ||
    process.env.PGSSLMODE === "require"
  ) {
    return { rejectUnauthorized: false };
  }

  return undefined;
}

export function getPool() {
  const url = connectionString();

  if (!url) {
    throw new Error("Missing TEST_DATABASE_URL or DATABASE_URL.");
  }

  if (!globalForPg.sqlDashboardPool) {
    globalForPg.sqlDashboardPool = new Pool({
      connectionString: url,
      max: 5,
      idleTimeoutMillis: 30_000,
      ssl: sslFor(url),
    });
  }

  return globalForPg.sqlDashboardPool;
}

export async function query(sql, params = []) {
  const result = await getPool().query(sql, params);
  return result.rows;
}

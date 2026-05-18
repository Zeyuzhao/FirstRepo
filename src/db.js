const { Pool } = require("pg");

function getConnectionString() {
  return process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
}

function createPool() {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error("TEST_DATABASE_URL or DATABASE_URL must be configured.");
  }

  return new Pool({
    connectionString,
    max: Number(process.env.PG_POOL_MAX || 6),
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000
  });
}

module.exports = {
  createPool
};

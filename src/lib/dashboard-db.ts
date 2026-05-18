import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";

type EventStatus = "queued" | "processing" | "review" | "complete";

export type DashboardRow = {
  id: number;
  customer: string;
  region: string;
  status: EventStatus;
  amount: number;
  latencyMs: number;
  createdAt: string;
};

export type DashboardSnapshot = {
  tableName: "dashboard_events";
  refreshedAt: string;
  lastInsertedId: number | null;
  totals: {
    rowCount: number;
    activeCount: number;
    completedCount: number;
    revenue: number;
    averageLatencyMs: number;
  };
  regions: Array<{
    region: string;
    count: number;
    revenue: number;
  }>;
  rows: DashboardRow[];
};

type CountResult = {
  count: number;
};

type TotalResult = {
  rowCount: number;
  activeCount: number | null;
  completedCount: number | null;
  revenue: number | null;
  averageLatencyMs: number | null;
};

type RegionResult = {
  region: string;
  count: number;
  revenue: number;
};

type RowResult = {
  id: number;
  customer: string;
  region: string;
  status: EventStatus;
  amount: number;
  latencyMs: number;
  createdAt: string;
};

const customers = [
  "Acme Labs",
  "Northwind",
  "Bluebird Health",
  "Summit Bank",
  "Vector Works",
  "Riverline",
  "Metro Foods",
  "Atlas Media",
];

const regions = ["West", "Northeast", "Midwest", "South"];
const statuses: EventStatus[] = ["queued", "processing", "review", "complete"];
const databasePath =
  process.env.FIRSTREPO_SQLITE_PATH ??
  path.join(process.cwd(), ".data", "firstrepo-dashboard.sqlite");

let database: Database.Database | null = null;
let lastInsertedId: number | null = null;

function getDatabase() {
  if (database) {
    return database;
  }

  mkdirSync(path.dirname(databasePath), { recursive: true });

  database = new Database(databasePath);
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");
  database.exec(`
    CREATE TABLE IF NOT EXISTS dashboard_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer TEXT NOT NULL,
      region TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('queued', 'processing', 'review', 'complete')),
      amount INTEGER NOT NULL CHECK(amount >= 0),
      latency_ms INTEGER NOT NULL CHECK(latency_ms >= 0),
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS dashboard_events_created_idx
      ON dashboard_events(created_at DESC, id DESC);
  `);

  const rowCount = database
    .prepare("SELECT COUNT(*) AS count FROM dashboard_events")
    .get() as CountResult;

  if (rowCount.count === 0) {
    seedEvents(database);
  }

  return database;
}

function seedEvents(db: Database.Database) {
  const insert = db.prepare(`
    INSERT INTO dashboard_events
      (customer, region, status, amount, latency_ms, created_at)
    VALUES
      (@customer, @region, @status, @amount, @latencyMs, @createdAt)
  `);

  const now = Date.now();
  const seedRows = Array.from({ length: 14 }, (_, index) =>
    buildEvent(index + 1, new Date(now - (14 - index) * 90_000)),
  );

  const writeSeedRows = db.transaction(() => {
    for (const row of seedRows) {
      insert.run(row);
    }
  });

  writeSeedRows();
}

function buildEvent(sequence: number, createdAt = new Date()) {
  return {
    customer: customers[sequence % customers.length],
    region: regions[(sequence * 3) % regions.length],
    status: statuses[sequence % statuses.length],
    amount: 900 + ((sequence * 347) % 8_200),
    latencyMs: 90 + ((sequence * 53) % 620),
    createdAt: createdAt.toISOString(),
  };
}

export function appendDashboardEvent() {
  const db = getDatabase();
  const rowCount = db
    .prepare("SELECT COUNT(*) AS count FROM dashboard_events")
    .get() as CountResult;
  const nextSequence = rowCount.count + 1;
  const nextEvent = buildEvent(nextSequence);

  const result = db
    .prepare(`
      INSERT INTO dashboard_events
        (customer, region, status, amount, latency_ms, created_at)
      VALUES
        (@customer, @region, @status, @amount, @latencyMs, @createdAt)
    `)
    .run(nextEvent);

  lastInsertedId = Number(result.lastInsertRowid);
  advanceOldestActiveEvent(db);

  return lastInsertedId;
}

function advanceOldestActiveEvent(db: Database.Database) {
  const oldestActive = db
    .prepare(
      "SELECT id, status FROM dashboard_events WHERE status != 'complete' ORDER BY id ASC LIMIT 1",
    )
    .get() as Pick<DashboardRow, "id" | "status"> | undefined;

  if (!oldestActive || lastInsertedId === null || lastInsertedId % 2 !== 0) {
    return;
  }

  const nextStatus: EventStatus =
    oldestActive.status === "queued"
      ? "processing"
      : oldestActive.status === "processing"
        ? "review"
        : "complete";

  db.prepare("UPDATE dashboard_events SET status = ? WHERE id = ?").run(
    nextStatus,
    oldestActive.id,
  );
}

export function getDashboardSnapshot(): DashboardSnapshot {
  const db = getDatabase();
  const totals = db
    .prepare(
      `
        SELECT
          COUNT(*) AS rowCount,
          SUM(CASE WHEN status != 'complete' THEN 1 ELSE 0 END) AS activeCount,
          SUM(CASE WHEN status = 'complete' THEN 1 ELSE 0 END) AS completedCount,
          COALESCE(SUM(amount), 0) AS revenue,
          ROUND(COALESCE(AVG(latency_ms), 0), 0) AS averageLatencyMs
        FROM dashboard_events
      `,
    )
    .get() as TotalResult;

  const regionRows = db
    .prepare(
      `
        SELECT
          region,
          COUNT(*) AS count,
          COALESCE(SUM(amount), 0) AS revenue
        FROM dashboard_events
        GROUP BY region
        ORDER BY revenue DESC, region ASC
      `,
    )
    .all() as RegionResult[];

  const rows = db
    .prepare(
      `
        SELECT
          id,
          customer,
          region,
          status,
          amount,
          latency_ms AS latencyMs,
          created_at AS createdAt
        FROM dashboard_events
        ORDER BY created_at DESC, id DESC
        LIMIT 12
      `,
    )
    .all() as RowResult[];

  return {
    tableName: "dashboard_events",
    refreshedAt: new Date().toISOString(),
    lastInsertedId,
    totals: {
      rowCount: totals.rowCount,
      activeCount: totals.activeCount ?? 0,
      completedCount: totals.completedCount ?? 0,
      revenue: totals.revenue ?? 0,
      averageLatencyMs: totals.averageLatencyMs ?? 0,
    },
    regions: regionRows,
    rows,
  };
}

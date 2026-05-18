"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import type { DashboardSnapshot } from "@/lib/dashboard-db";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  second: "2-digit",
});

type RefreshMode = "read" | "tick";

export function SqlDashboard({
  initialSnapshot,
}: {
  initialSnapshot: DashboardSnapshot;
}) {
  const [snapshot, setSnapshot] =
    useState<DashboardSnapshot>(initialSnapshot);
  const [isLive, setIsLive] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inFlight = useRef(false);

  const refresh = useCallback(async (mode: RefreshMode) => {
    if (inFlight.current) {
      return;
    }

    inFlight.current = true;
    setIsLoading(true);

    try {
      const response = await fetch(
        mode === "tick" ? "/api/dashboard/tick" : "/api/dashboard",
        {
          method: mode === "tick" ? "POST" : "GET",
          cache: "no-store",
        },
      );

      if (!response.ok) {
        throw new Error(`Dashboard request failed with ${response.status}`);
      }

      const nextSnapshot = (await response.json()) as DashboardSnapshot;
      setSnapshot(nextSnapshot);
      setError("");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to refresh the dashboard",
      );
    } finally {
      inFlight.current = false;
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLive) {
      return;
    }

    const interval = window.setInterval(() => {
      void refresh("tick");
    }, 1800);

    return () => window.clearInterval(interval);
  }, [isLive, refresh]);

  const largestRegionRevenue = useMemo(() => {
    if (!snapshot?.regions.length) {
      return 1;
    }

    return Math.max(...snapshot.regions.map((region) => region.revenue));
  }, [snapshot]);

  return (
    <main className={styles.page}>
      <Header
        isLive={isLive}
        isLoading={isLoading}
        onToggleLive={() => setIsLive((current) => !current)}
        onInsert={() => void refresh("tick")}
      />

      {error ? <p className={styles.error}>{error}</p> : null}

      <p className={styles.statusLine}>
        Reading from SQL table <strong>{snapshot.tableName}</strong>. Last
        refresh {formatTime(snapshot.refreshedAt)}
        {snapshot.lastInsertedId ? `, newest row #${snapshot.lastInsertedId}` : ""}.
      </p>

      <section className={styles.metricsGrid} aria-label="SQL table metrics">
        <Metric
          label="Total rows"
          value={numberFormatter.format(snapshot.totals.rowCount)}
          detail="Auto-increments as live mode writes"
        />
        <Metric
          label="Active rows"
          value={numberFormatter.format(snapshot.totals.activeCount)}
          detail={`${numberFormatter.format(snapshot.totals.completedCount)} complete`}
        />
        <Metric
          label="Revenue"
          value={currencyFormatter.format(snapshot.totals.revenue)}
          detail="Summed directly from SQL"
        />
        <Metric
          label="Avg latency"
          value={`${numberFormatter.format(snapshot.totals.averageLatencyMs)} ms`}
          detail="Calculated from table rows"
        />
      </section>

      <section className={styles.dashboardGrid}>
        <article className={styles.panel} aria-labelledby="region-title">
          <div className={styles.panelHeader}>
            <div>
              <span>Aggregate query</span>
              <strong id="region-title">Revenue by region</strong>
            </div>
          </div>
          <ul className={styles.regionList}>
            {snapshot.regions.map((region) => (
              <li className={styles.regionRow} key={region.region}>
                <div className={styles.regionMeta}>
                  <strong>{region.region}</strong>
                  <span>{currencyFormatter.format(region.revenue)}</span>
                </div>
                <div className={styles.barTrack} aria-hidden="true">
                  <span
                    className={styles.barFill}
                    style={{
                      width: `${Math.max(
                        8,
                        Math.round((region.revenue / largestRegionRevenue) * 100),
                      )}%`,
                    }}
                  />
                </div>
                <div className={styles.regionMeta}>
                  <span>{numberFormatter.format(region.count)} rows</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className={styles.panel} aria-labelledby="rows-title">
          <div className={styles.panelHeader}>
            <div>
              <span>Latest rows</span>
              <strong id="rows-title">dashboard_events</strong>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Region</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Amount</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {snapshot.rows.map((row) => (
                  <tr key={row.id}>
                    <td>#{row.id}</td>
                    <td>{row.customer}</td>
                    <td>{row.region}</td>
                    <td>
                      <span
                        className={`${styles.statusChip} ${styles[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td>{numberFormatter.format(row.latencyMs)} ms</td>
                    <td>{currencyFormatter.format(row.amount)}</td>
                    <td>{formatTime(row.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}

function Header({
  isLive,
  isLoading,
  onToggleLive,
  onInsert,
}: {
  isLive: boolean;
  isLoading: boolean;
  onToggleLive: () => void;
  onInsert: () => void;
}) {
  return (
    <header className={styles.topBar}>
      <div>
        <p className={styles.eyebrow}>FirstRepo SQL dashboard</p>
        <h1>Live operations table</h1>
        <p className={styles.summary}>
          A local SQLite table powers this dashboard. Live mode appends a fresh
          row, re-runs the aggregate queries, and redraws the table every 1.8
          seconds.
        </p>
      </div>
      <div className={styles.toolbar} aria-label="Dashboard controls">
        <span className={styles.livePill}>
          <span
            className={`${styles.liveDot} ${isLive ? "" : styles.pausedDot}`}
            aria-hidden="true"
          />
          {isLive ? "Live" : "Paused"}
        </span>
        <button
          className={styles.ghostButton}
          type="button"
          onClick={onToggleLive}
        >
          {isLive ? "Pause" : "Resume"}
        </button>
        <button
          className={styles.button}
          type="button"
          onClick={onInsert}
          disabled={isLoading}
        >
          Insert row
        </button>
      </div>
    </header>
  );
}

function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className={styles.metricCard}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function formatTime(value: string) {
  return timeFormatter.format(new Date(value));
}

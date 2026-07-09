import type { CSSProperties } from "react";

export default function Home() {
  const metrics = [
    { label: "Revenue", value: "$128.4K", change: "+12.5%" },
    { label: "Active users", value: "24,892", change: "+8.2%" },
    { label: "Conversion", value: "7.4%", change: "+1.1%" },
    { label: "Open tasks", value: "36", change: "-4 today" },
  ];

  const activities = [
    "North America pipeline crossed 82% of quarterly target.",
    "Enterprise onboarding queue is down 18% week over week.",
    "Support response SLA held at 94% for priority tickets.",
  ];

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell">
        <header className="hero">
          <div>
            <p className="eyebrow">Operations dashboard</p>
            <h1>Track the signals that move the business.</h1>
            <p className="summary">
              A compact command center for revenue, users, conversion, and
              execution health.
            </p>
          </div>
          <a className="primary-action" href="#activity">
            View activity
          </a>
        </header>

        <section className="metric-grid" aria-label="Dashboard metrics">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <p>{metric.label}</p>
              <strong>{metric.value}</strong>
              <span>{metric.change}</span>
            </article>
          ))}
        </section>

        <section className="dashboard-grid">
          <article className="panel">
            <div className="panel-heading">
              <p className="eyebrow">Performance</p>
              <h2>Weekly momentum</h2>
            </div>
            <div className="bar-chart" aria-label="Weekly momentum chart">
              {[54, 68, 61, 82, 76, 90, 88].map((height, index) => (
                <span
                  aria-label={`Day ${index + 1}: ${height}%`}
                  className="bar"
                  key={height + index}
                  style={{ "--height": `${height}%` } as CSSProperties}
                />
              ))}
            </div>
          </article>

          <article className="panel" id="activity">
            <div className="panel-heading">
              <p className="eyebrow">Live feed</p>
              <h2>Recent activity</h2>
            </div>
            <ul className="activity-list">
              {activities.map((activity) => (
                <li key={activity}>{activity}</li>
              ))}
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
}

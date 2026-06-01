const portfolioMetrics = [
  { label: "Seats purchased", value: "1,240", detail: "+80 vs. prior review" },
  { label: "Assigned seats", value: "1,086", detail: "88% allocation" },
  { label: "Active users", value: "934", detail: "75% of purchased" },
  { label: "Unused seats", value: "154", detail: "$46.2K annualized exposure" },
];

const departments = [
  { name: "Sales", assigned: 312, active: 286, utilization: 92 },
  { name: "Customer Success", assigned: 214, active: 181, utilization: 85 },
  { name: "Engineering", assigned: 268, active: 218, utilization: 81 },
  { name: "Operations", assigned: 156, active: 121, utilization: 78 },
  { name: "Finance", assigned: 73, active: 48, utilization: 66 },
  { name: "People", assigned: 63, active: 39, utilization: 62 },
];

const actions = [
  {
    title: "Reclaim low-confidence seats",
    owner: "IT Operations",
    impact: "95 seats",
    status: "Ready",
  },
  {
    title: "Approve Q3 growth buffer",
    owner: "Finance",
    impact: "120 seats",
    status: "Decision",
  },
  {
    title: "Review Finance and People adoption",
    owner: "Department leads",
    impact: "49 seats",
    status: "Follow-up",
  },
];

export default function Home() {
  return (
    <main className="dashboard-shell">
      <section className="executive-summary" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Seat usage dashboard</p>
          <h1 id="dashboard-title">Executive review</h1>
          <p className="summary">
            Portfolio-level seat allocation, utilization, and recovery opportunities
            prepared for fast executive scanning.
          </p>
        </div>
        <div className="review-card">
          <span className="data-pill">Sample data</span>
          <p>Review focus</p>
          <strong>Recover unused seats before expanding the Q3 allocation.</strong>
        </div>
      </section>

      <section className="metric-grid" aria-label="Sample seat usage metrics">
        {portfolioMetrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.detail}</span>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel utilization-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Utilization by department</p>
              <h2>Highest-impact areas</h2>
            </div>
            <span className="data-pill">Sample data</span>
          </div>
          <div className="department-list">
            {departments.map((department) => (
              <div className="department-row" key={department.name}>
                <div className="department-label">
                  <strong>{department.name}</strong>
                  <span>
                    {department.active} active / {department.assigned} assigned
                  </span>
                </div>
                <div
                  className="usage-bar"
                  aria-label={`${department.name} utilization ${department.utilization}%`}
                >
                  <span style={{ width: `${department.utilization}%` }} />
                </div>
                <strong className="usage-value">{department.utilization}%</strong>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel decision-panel" aria-labelledby="decision-title">
          <div className="panel-heading stacked">
            <p className="eyebrow">Decision view</p>
            <h2 id="decision-title">Recommended executive calls</h2>
          </div>
          <div className="action-list">
            {actions.map((action) => (
              <article className="action-item" key={action.title}>
                <div>
                  <span>{action.status}</span>
                  <h3>{action.title}</h3>
                  <p>{action.owner}</p>
                </div>
                <strong>{action.impact}</strong>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

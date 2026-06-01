export default function Home() {
  const priorities = [
    {
      name: "Urgent",
      count: 18,
      trend: "+4 since yesterday",
      color: "#b42318",
      bg: "#fee4e2",
      sla: "2 hr SLA",
    },
    {
      name: "High",
      count: 42,
      trend: "+9 this week",
      color: "#b54708",
      bg: "#fef0c7",
      sla: "8 hr SLA",
    },
    {
      name: "Medium",
      count: 86,
      trend: "-12 this week",
      color: "#175cd3",
      bg: "#d1e9ff",
      sla: "24 hr SLA",
    },
    {
      name: "Low",
      count: 33,
      trend: "-5 this week",
      color: "#027a48",
      bg: "#dcfae6",
      sla: "72 hr SLA",
    },
  ];

  const total = priorities.reduce((sum, priority) => sum + priority.count, 0);
  const urgentAndHigh = priorities
    .filter((priority) => priority.name === "Urgent" || priority.name === "High")
    .reduce((sum, priority) => sum + priority.count, 0);

  return (
    <main className="dashboard">
      <section className="toolbar" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Support operations</p>
          <h1 id="dashboard-title">Ticket backlog by priority</h1>
        </div>
        <span className="data-pill">Mock data</span>
      </section>

      <section className="metrics" aria-label="Backlog summary">
        <article className="metric">
          <span className="metric-label">Open backlog</span>
          <strong>{total}</strong>
          <span className="metric-note">Sample tickets awaiting response</span>
        </article>
        <article className="metric">
          <span className="metric-label">Urgent + high</span>
          <strong>{urgentAndHigh}</strong>
          <span className="metric-note">Needs senior triage attention</span>
        </article>
        <article className="metric">
          <span className="metric-label">Largest queue</span>
          <strong>Medium</strong>
          <span className="metric-note">86 mock tickets</span>
        </article>
      </section>

      <section className="content-grid">
        <section className="panel chart-panel" aria-labelledby="chart-title">
          <div className="panel-heading">
            <div>
              <h2 id="chart-title">Priority distribution</h2>
              <p>Sample data, not current support records.</p>
            </div>
          </div>
          <div className="bars">
            {priorities.map((priority) => {
              const width = `${Math.round((priority.count / total) * 100)}%`;

              return (
                <div className="bar-row" key={priority.name}>
                  <div className="bar-label">
                    <span>{priority.name}</span>
                    <strong>{priority.count}</strong>
                  </div>
                  <div className="bar-track" aria-hidden="true">
                    <span
                      className="bar-fill"
                      style={{ width, backgroundColor: priority.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="panel" aria-labelledby="queue-title">
          <div className="panel-heading">
            <div>
              <h2 id="queue-title">Queue detail</h2>
              <p>Mock data for preview only.</p>
            </div>
          </div>
          <div className="priority-list">
            {priorities.map((priority) => (
              <article className="priority-item" key={priority.name}>
                <span
                  className="priority-dot"
                  style={{ backgroundColor: priority.color }}
                  aria-hidden="true"
                />
                <div>
                  <h3>{priority.name}</h3>
                  <p>{priority.trend}</p>
                </div>
                <span className="sla" style={{ backgroundColor: priority.bg, color: priority.color }}>
                  {priority.sla}
                </span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

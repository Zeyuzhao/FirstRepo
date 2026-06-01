export default function Home() {
  return (
    <main className="page">
      <section className="dashboard" aria-labelledby="dashboard-title">
        <div className="dashboard__header">
          <div>
            <p className="eyebrow">Employee headcount</p>
            <h1 id="dashboard-title">Current headcount by department</h1>
          </div>
          <span className="status-badge">Data source required</span>
        </div>

        <section className="notice" aria-labelledby="notice-title">
          <p className="notice__label">Data unavailable</p>
          <h2 id="notice-title">No verified employee source is connected.</h2>
          <p>
            The SQL connector is not configured and this repository does not
            include an employee or department fixture, so current department
            headcount cannot be shown without inventing values.
          </p>
        </section>

        <section className="summary-grid" aria-label="Headcount status">
          <article className="metric">
            <span className="metric__label">Total employees</span>
            <strong>--</strong>
            <span className="metric__note">Awaiting verified source</span>
          </article>
          <article className="metric">
            <span className="metric__label">Departments</span>
            <strong>--</strong>
            <span className="metric__note">Awaiting department records</span>
          </article>
          <article className="metric">
            <span className="metric__label">Data status</span>
            <strong>Blocked</strong>
            <span className="metric__note">No mock data displayed</span>
          </article>
        </section>

        <section className="table-panel" aria-labelledby="table-title">
          <div className="table-panel__header">
            <h2 id="table-title">Department totals</h2>
            <p>Data: source unavailable, no current records displayed.</p>
          </div>

          <div className="empty-table" role="status">
            Connect a SQL database or provide an employee file with department
            assignments to populate this dashboard.
          </div>
        </section>
      </section>
    </main>
  );
}

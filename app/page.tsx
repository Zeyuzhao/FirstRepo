export default function Home() {
  return (
    <main className="page">
      <section className="dashboard" aria-labelledby="dashboard-title">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">People operations</p>
            <h1 id="dashboard-title">Active employees by department</h1>
          </div>
          <span className="status-pill">Data source unavailable</span>
        </div>

        <div className="notice" role="status">
          <strong>I could not verify the employee data source.</strong>
          <span>
            Connect SQL or provide an employee file with department and active
            status fields to show current counts.
          </span>
        </div>

        <section className="chart-panel" aria-label="Department headcount">
          <div className="chart-header">
            <div>
              <h2>Department totals</h2>
              <p>No current records available for display.</p>
            </div>
            <span>Data: blocked</span>
          </div>

          <div className="empty-chart" aria-hidden="true">
            <div className="empty-bar" />
            <div className="empty-bar medium" />
            <div className="empty-bar short" />
            <div className="empty-bar long" />
          </div>
        </section>
      </section>
    </main>
  );
}

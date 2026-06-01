const departments = [
  { id: "d009", name: "Customer Service", usedSeats: 17569 },
  { id: "d005", name: "Development", usedSeats: 61386 },
  { id: "d002", name: "Finance", usedSeats: 12437 },
  { id: "d003", name: "Human Resources", usedSeats: 12898 },
  { id: "d001", name: "Marketing", usedSeats: 14842 },
  { id: "d004", name: "Production", usedSeats: 53304 },
  { id: "d006", name: "Quality Management", usedSeats: 14546 },
  { id: "d008", name: "Research", usedSeats: 15441 },
  { id: "d007", name: "Sales", usedSeats: 37701 },
];

const totalUsedSeats = departments.reduce(
  (total, department) => total + department.usedSeats,
  0,
);

const topDepartment = departments.reduce((highest, department) =>
  department.usedSeats > highest.usedSeats ? department : highest,
);

const numberFormatter = new Intl.NumberFormat("en-US");

export default function Home() {
  return (
    <main className="dashboard">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Seat management</p>
          <h1 id="page-title">Department seat usage</h1>
          <p className="summary">
            Current seat usage is verified from SQL. Department limit data is
            missing, so utilization percentages are intentionally withheld.
          </p>
        </div>

        <div className="summary-grid" aria-label="Seat usage summary">
          <article className="metric">
            <span className="metric-label">Used seats</span>
            <strong>{numberFormatter.format(totalUsedSeats)}</strong>
          </article>
          <article className="metric warning">
            <span className="metric-label">Departments missing limits</span>
            <strong>{departments.length}</strong>
          </article>
          <article className="metric">
            <span className="metric-label">Highest usage</span>
            <strong>{topDepartment.name}</strong>
            <span>{numberFormatter.format(topDepartment.usedSeats)} seats</span>
          </article>
        </div>
      </section>

      <section className="notice" aria-label="Missing limit data">
        <div>
          <h2>Missing limit data</h2>
          <p>
            No department limit column or table was available in the verified
            SQL schema. Each department is flagged until limit records are
            provided.
          </p>
        </div>
        <span className="status-pill">Limits unavailable</span>
      </section>

      <section className="usage-table" aria-labelledby="table-title">
        <div className="table-header">
          <div>
            <p className="eyebrow">SQL verified</p>
            <h2 id="table-title">Usage by department</h2>
          </div>
          <span className="data-label">Data: SQL verified</span>
        </div>

        <div className="table" role="table" aria-label="Department seat usage">
          <div className="table-row table-head" role="row">
            <span role="columnheader">Department</span>
            <span role="columnheader">Used seats</span>
            <span role="columnheader">Limit</span>
            <span role="columnheader">Status</span>
          </div>
          {departments.map((department) => (
            <div className="table-row" role="row" key={department.id}>
              <span role="cell">
                <strong>{department.name}</strong>
                <small>{department.id}</small>
              </span>
              <span role="cell">
                {numberFormatter.format(department.usedSeats)}
              </span>
              <span role="cell" className="missing">
                Missing
              </span>
              <span role="cell">
                <span className="status-pill compact">
                  Missing limit data
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

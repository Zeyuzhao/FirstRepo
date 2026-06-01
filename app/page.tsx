const departments = [
  { name: "Development", activeSeats: 61386 },
  { name: "Production", activeSeats: 53304 },
  { name: "Sales", activeSeats: 37701 },
  { name: "Customer Service", activeSeats: 17569 },
  { name: "Research", activeSeats: 15441 },
  { name: "Marketing", activeSeats: 14842 },
  { name: "Quality Management", activeSeats: 14546 },
  { name: "Human Resources", activeSeats: 12898 },
  { name: "Finance", activeSeats: 12437 },
];

const totalSeats = departments.reduce(
  (sum, department) => sum + department.activeSeats,
  0,
);

const formatNumber = new Intl.NumberFormat("en-US");

export default function Home() {
  return (
    <main className="dashboard">
      <section className="header">
        <div>
          <p className="eyebrow">Seat operations</p>
          <h1>Department Seat Usage</h1>
          <p className="summary">
            Active seats are SQL verified from current department assignments.
            License limits were not present in the configured source, so limit
            proximity is shown as unavailable rather than estimated.
          </p>
        </div>
        <div className="source-badge">Data: SQL verified</div>
      </section>

      <section className="metrics" aria-label="Seat usage summary">
        <article className="metric">
          <span>Total active seats</span>
          <strong>{formatNumber.format(totalSeats)}</strong>
        </article>
        <article className="metric">
          <span>Departments</span>
          <strong>{departments.length}</strong>
        </article>
        <article className="metric muted">
          <span>License limits</span>
          <strong>Unavailable</strong>
        </article>
      </section>

      <section className="usage-panel" aria-label="Department seat usage">
        <div className="panel-heading">
          <h2>Usage by Department</h2>
          <p>Sorted by active seats</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Active seats</th>
                <th>License limit</th>
                <th>Limit status</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.name}>
                  <td>{department.name}</td>
                  <td>{formatNumber.format(department.activeSeats)}</td>
                  <td>
                    <span className="empty-value">Not in source</span>
                  </td>
                  <td>
                    <span className="status">Unavailable</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

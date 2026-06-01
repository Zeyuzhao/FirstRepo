const departments = [
  {
    name: "Engineering",
    headcount: 86,
    openings: 9,
    location: "Hybrid",
    color: "#2563eb",
  },
  {
    name: "Sales",
    headcount: 58,
    openings: 6,
    location: "Distributed",
    color: "#16a34a",
  },
  {
    name: "Customer Success",
    headcount: 42,
    openings: 4,
    location: "Hybrid",
    color: "#d97706",
  },
  {
    name: "Operations",
    headcount: 31,
    openings: 2,
    location: "On-site",
    color: "#7c3aed",
  },
  {
    name: "Product",
    headcount: 24,
    openings: 3,
    location: "Hybrid",
    color: "#0891b2",
  },
  {
    name: "People",
    headcount: 13,
    openings: 1,
    location: "Hybrid",
    color: "#db2777",
  },
];

const totalHeadcount = departments.reduce(
  (total, department) => total + department.headcount,
  0,
);
const totalOpenings = departments.reduce(
  (total, department) => total + department.openings,
  0,
);
const largestDepartment = departments.reduce((largest, department) =>
  department.headcount > largest.headcount ? department : largest,
);

export default function Home() {
  return (
    <main className="dashboard">
      <section className="dashboard-header" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">People Operations</p>
          <h1 id="dashboard-title">Employee headcount by department</h1>
        </div>
        <p className="updated">Updated today</p>
      </section>

      <section className="metric-grid" aria-label="Headcount summary">
        <article className="metric">
          <span>Total employees</span>
          <strong>{totalHeadcount}</strong>
          <small>Across {departments.length} departments</small>
        </article>
        <article className="metric">
          <span>Largest department</span>
          <strong>{largestDepartment.name}</strong>
          <small>{largestDepartment.headcount} employees</small>
        </article>
        <article className="metric">
          <span>Open roles</span>
          <strong>{totalOpenings}</strong>
          <small>Planned hiring capacity</small>
        </article>
      </section>

      <section className="content-grid">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Department mix</h2>
              <p>Current active employee count</p>
            </div>
            <span>{totalHeadcount} total</span>
          </div>

          <div className="bar-list">
            {departments.map((department) => {
              const percentage = Math.round(
                (department.headcount / totalHeadcount) * 100,
              );

              return (
                <div className="bar-row" key={department.name}>
                  <div className="bar-label">
                    <span>{department.name}</span>
                    <strong>{department.headcount}</strong>
                  </div>
                  <div
                    className="bar-track"
                    aria-label={`${department.name}: ${department.headcount} employees, ${percentage}% of headcount`}
                  >
                    <span
                      className="bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: department.color,
                      }}
                    />
                  </div>
                  <small>{percentage}%</small>
                </div>
              );
            })}
          </div>
        </article>

        <article className="panel">
          <div className="panel-heading">
            <div>
              <h2>Department details</h2>
              <p>Headcount, hiring, and work mode</p>
            </div>
          </div>

          <div className="department-table" role="table">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Department</span>
              <span role="columnheader">Employees</span>
              <span role="columnheader">Open</span>
              <span role="columnheader">Mode</span>
            </div>
            {departments.map((department) => (
              <div className="table-row" role="row" key={department.name}>
                <span className="department-name" role="cell">
                  <i style={{ backgroundColor: department.color }} />
                  {department.name}
                </span>
                <strong role="cell">{department.headcount}</strong>
                <span role="cell">{department.openings}</span>
                <span role="cell">{department.location}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

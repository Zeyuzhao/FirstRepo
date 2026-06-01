const departments = [
  {
    name: "Engineering",
    headcount: 86,
    openRoles: 7,
    change: "+6",
    color: "#2563eb",
  },
  {
    name: "Sales",
    headcount: 54,
    openRoles: 5,
    change: "+3",
    color: "#059669",
  },
  {
    name: "Customer Success",
    headcount: 38,
    openRoles: 2,
    change: "+1",
    color: "#d97706",
  },
  {
    name: "Operations",
    headcount: 27,
    openRoles: 3,
    change: "0",
    color: "#7c3aed",
  },
  {
    name: "Marketing",
    headcount: 24,
    openRoles: 2,
    change: "+2",
    color: "#db2777",
  },
  {
    name: "People",
    headcount: 15,
    openRoles: 1,
    change: "+1",
    color: "#0891b2",
  },
];

const totalHeadcount = departments.reduce(
  (total, department) => total + department.headcount,
  0,
);
const totalOpenRoles = departments.reduce(
  (total, department) => total + department.openRoles,
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
          <p className="eyebrow">Workforce overview</p>
          <h1 id="dashboard-title">Employee headcount by department</h1>
          <p className="summary">
            Current team distribution, hiring load, and month-over-month movement
            across the organization.
          </p>
        </div>
        <div className="report-date">
          <span>Updated</span>
          <strong>Today</strong>
        </div>
      </section>

      <section className="metrics" aria-label="Headcount summary">
        <article className="metric">
          <span>Total employees</span>
          <strong>{totalHeadcount}</strong>
        </article>
        <article className="metric">
          <span>Departments</span>
          <strong>{departments.length}</strong>
        </article>
        <article className="metric">
          <span>Open roles</span>
          <strong>{totalOpenRoles}</strong>
        </article>
        <article className="metric">
          <span>Largest team</span>
          <strong>{largestDepartment.name}</strong>
        </article>
      </section>

      <section className="content-grid">
        <div className="panel chart-panel">
          <div className="panel-heading">
            <h2>Department mix</h2>
            <span>{totalHeadcount} employees</span>
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
                  <div className="bar-track" aria-hidden="true">
                    <div
                      className="bar-fill"
                      style={{
                        background: department.color,
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                  <span className="bar-percent">{percentage}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel roster-panel">
          <div className="panel-heading">
            <h2>Hiring signal</h2>
            <span>Open roles and net change</span>
          </div>
          <div className="department-table" role="table" aria-label="Hiring signal">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Department</span>
              <span role="columnheader">Open</span>
              <span role="columnheader">Change</span>
            </div>
            {departments.map((department) => (
              <div className="table-row" role="row" key={department.name}>
                <span role="cell">
                  <i style={{ background: department.color }} />
                  {department.name}
                </span>
                <strong role="cell">{department.openRoles}</strong>
                <em role="cell">{department.change}</em>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

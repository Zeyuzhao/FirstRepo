const seatUsage = [
  { department: "Development", seats: 61386 },
  { department: "Production", seats: 53304 },
  { department: "Sales", seats: 37701 },
  { department: "Customer Service", seats: 17569 },
  { department: "Research", seats: 15441 },
  { department: "Marketing", seats: 14842 },
  { department: "Quality Management", seats: 14546 },
  { department: "Human Resources", seats: 12898 },
  { department: "Finance", seats: 12437 },
];

const totalSeats = seatUsage.reduce((sum, item) => sum + item.seats, 0);
const maxSeats = Math.max(...seatUsage.map((item) => item.seats));

const formatter = new Intl.NumberFormat("en-US");

export default function Home() {
  return (
    <main className="dashboard">
      <section className="dashboard-header" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Seat usage</p>
          <h1 id="dashboard-title">Department license dashboard</h1>
          <p className="summary">
            Current active department seats are SQL verified. License limits are
            unavailable in the connected schema, so proximity-to-limit is blocked
            until a limit source is added.
          </p>
        </div>
        <div className="metric-panel" aria-label="Total active seats">
          <span>Total active seats</span>
          <strong>{formatter.format(totalSeats)}</strong>
          <small>Data: SQL verified</small>
        </div>
      </section>

      <section className="notice" aria-label="License limit data status">
        <div>
          <p className="notice-title">License limits unavailable</p>
          <p>
            The connected database includes department assignments, but no
            license-limit table or column. Limit usage and overage risk are
            intentionally not calculated from mock values.
          </p>
        </div>
        <span>Blocked</span>
      </section>

      <section className="usage-table" aria-labelledby="usage-title">
        <div className="table-heading">
          <div>
            <p className="eyebrow">Current usage</p>
            <h2 id="usage-title">Seats by department</h2>
          </div>
          <p>Source: employees.department_employee active rows</p>
        </div>

        <div className="rows" role="table" aria-label="Current seat usage by department">
          <div className="row row-head" role="row">
            <span role="columnheader">Department</span>
            <span role="columnheader">Active seats</span>
            <span role="columnheader">Share of largest</span>
            <span role="columnheader">Limit status</span>
          </div>
          {seatUsage.map((item) => (
            <div className="row" role="row" key={item.department}>
              <span className="department" role="cell">
                {item.department}
              </span>
              <span className="seats" role="cell">
                {formatter.format(item.seats)}
              </span>
              <span className="bar-cell" role="cell">
                <span className="bar-track" aria-hidden="true">
                  <span
                    className="bar-fill"
                    style={{ width: `${(item.seats / maxSeats) * 100}%` }}
                  />
                </span>
              </span>
              <span className="status" role="cell">
                Limit needed
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

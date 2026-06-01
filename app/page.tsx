const departments = [
  { name: "Engineering", women: 42, men: 58 },
  { name: "Product", women: 55, men: 45 },
  { name: "Sales", women: 48, men: 52 },
  { name: "Operations", women: 61, men: 39 },
  { name: "Finance", women: 50, men: 50 },
];

const totalWomen = departments.reduce((sum, department) => sum + department.women, 0);
const totalMen = departments.reduce((sum, department) => sum + department.men, 0);
const averageWomen = Math.round(totalWomen / departments.length);
const averageMen = Math.round(totalMen / departments.length);
const mostBalanced = departments.reduce((best, department) => {
  const currentGap = Math.abs(department.women - department.men);
  const bestGap = Math.abs(best.women - best.men);

  return currentGap < bestGap ? department : best;
}, departments[0]);

export default function Home() {
  return (
    <main className="dashboard-page">
      <section className="dashboard-shell" aria-labelledby="dashboard-title">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">People analytics</p>
            <h1 id="dashboard-title">Department gender dashboard</h1>
          </div>
          <p className="summary">
            Women represent {averageWomen}% of employees across departments,
            with {mostBalanced.name} closest to an even split.
          </p>
        </div>

        <div className="metrics" aria-label="Gender representation summary">
          <div className="metric">
            <span className="metric-value">{averageWomen}%</span>
            <span className="metric-label">Average women</span>
          </div>
          <div className="metric">
            <span className="metric-value">{averageMen}%</span>
            <span className="metric-label">Average men</span>
          </div>
          <div className="metric">
            <span className="metric-value">{mostBalanced.name}</span>
            <span className="metric-label">Most balanced department</span>
          </div>
        </div>

        <section className="chart-panel" aria-labelledby="chart-title">
          <div className="chart-heading">
            <div>
              <p className="eyebrow">Gender split by department</p>
              <h2 id="chart-title">Women and men representation by department</h2>
            </div>
            <div className="legend" aria-label="Chart legend">
              <span>
                <i className="legend-swatch women" />
                Women
              </span>
              <span>
                <i className="legend-swatch men" />
                Men
              </span>
            </div>
          </div>

          <div className="chart" role="list" aria-label="Department gender percentages">
            {departments.map((department) => (
              <div className="chart-row" key={department.name} role="listitem">
                <div className="row-label">
                  <span>{department.name}</span>
                  <strong>{department.women}% women</strong>
                </div>
                <div
                  className="stacked-bar"
                  aria-label={`${department.name}: ${department.women}% women and ${department.men}% men`}
                >
                  <span
                    className="bar-segment women"
                    style={{ width: `${department.women}%` }}
                  />
                  <span
                    className="bar-segment men"
                    style={{ width: `${department.men}%` }}
                  />
                </div>
                <span className="men-label">{department.men}% men</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

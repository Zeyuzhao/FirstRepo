import { Pool } from "pg";

export const dynamic = "force-dynamic";

type DepartmentRow = {
  department: string;
  employees: string;
  women: string;
  women_pct: string;
  men: string;
  men_pct: string;
};

type Department = {
  name: string;
  employees: number;
  womenCount: number;
  women: number;
  menCount: number;
  men: number;
};

const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL;
const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    })
  : null;

const departmentQuery = `
  SELECT
    d.dept_name AS department,
    COUNT(*)::bigint AS employees,
    COUNT(*) FILTER (WHERE e.gender::text = 'F')::bigint AS women,
    ROUND(100.0 * COUNT(*) FILTER (WHERE e.gender::text = 'F') / COUNT(*), 1) AS women_pct,
    COUNT(*) FILTER (WHERE e.gender::text = 'M')::bigint AS men,
    ROUND(100.0 * COUNT(*) FILTER (WHERE e.gender::text = 'M') / COUNT(*), 1) AS men_pct
  FROM employees.department d
  JOIN employees.department_employee de ON de.department_id = d.id
  JOIN employees.employee e ON e.id = de.employee_id
  WHERE de.to_date >= CURRENT_DATE
  GROUP BY d.dept_name
  ORDER BY d.dept_name;
`;

async function getDepartments(): Promise<Department[]> {
  if (!pool) {
    throw new Error("Database connection is not configured.");
  }

  const result = await pool.query<DepartmentRow>(departmentQuery);

  return result.rows.map((row) => ({
    name: row.department,
    employees: Number(row.employees),
    womenCount: Number(row.women),
    women: Number(row.women_pct),
    menCount: Number(row.men),
    men: Number(row.men_pct),
  }));
}

const numberFormatter = new Intl.NumberFormat("en-US");

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getDashboardSummary(departments: Department[]) {
  const totalEmployees = departments.reduce(
    (sum, department) => sum + department.employees,
    0,
  );
  const totalWomen = departments.reduce(
    (sum, department) => sum + department.womenCount,
    0,
  );
  const totalMen = departments.reduce((sum, department) => sum + department.menCount, 0);
  const averageWomen = (totalWomen / totalEmployees) * 100;
  const averageMen = (totalMen / totalEmployees) * 100;
  const mostBalanced = departments.reduce((best, department) => {
    const currentGap = Math.abs(department.women - department.men);
    const bestGap = Math.abs(best.women - best.men);

    return currentGap < bestGap ? department : best;
  }, departments[0]);

  return {
    averageWomen,
    averageMen,
    mostBalanced,
    totalEmployees,
  };
}

export default async function Home() {
  const departments = await getDepartments();
  const { averageWomen, averageMen, mostBalanced, totalEmployees } =
    getDashboardSummary(departments);

  return (
    <main className="dashboard-page">
      <section className="dashboard-shell" aria-labelledby="dashboard-title">
        <div className="dashboard-header">
          <div>
            <p className="eyebrow">People analytics</p>
            <h1 id="dashboard-title">Department gender dashboard</h1>
          </div>
          <p className="summary">
            Women represent {formatPercent(averageWomen)} of active employees
            across {departments.length} departments, with {mostBalanced.name} closest
            to an even split.
          </p>
        </div>

        <div className="metrics" aria-label="Gender representation summary">
          <div className="metric">
            <span className="metric-value">{formatPercent(averageWomen)}</span>
            <span className="metric-label">Average women</span>
          </div>
          <div className="metric">
            <span className="metric-value">{formatPercent(averageMen)}</span>
            <span className="metric-label">Average men</span>
          </div>
          <div className="metric">
            <span className="metric-value">{mostBalanced.name}</span>
            <span className="metric-label">Most balanced department</span>
          </div>
          <div className="metric">
            <span className="metric-value">{numberFormatter.format(totalEmployees)}</span>
            <span className="metric-label">Active employees</span>
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
                  <strong>
                    {formatPercent(department.women)} women ·{" "}
                    {numberFormatter.format(department.employees)} employees
                  </strong>
                </div>
                <div
                  className="stacked-bar"
                  aria-label={`${department.name}: ${formatPercent(
                    department.women,
                  )} women and ${formatPercent(department.men)} men`}
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
                <span className="men-label">{formatPercent(department.men)} men</span>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

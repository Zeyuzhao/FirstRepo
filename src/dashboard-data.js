const TABLE_SCHEMA = "employees";
const TABLE_NAME = "employee";

const LATEST_EMPLOYEE_LIMIT = 12;
const STREAM_REFRESH_MS = Number(process.env.DASHBOARD_REFRESH_MS || 3000);

const metricsQuery = `
  WITH max_hire AS (
    SELECT MAX(hire_date) AS max_hire_date
    FROM employees.employee
  ),
  employee_totals AS (
    SELECT
      COUNT(*)::bigint AS total_employees,
      MIN(hire_date) AS first_hire,
      MAX(hire_date) AS latest_hire,
      COUNT(*) FILTER (
        WHERE hire_date >= (SELECT max_hire_date - INTERVAL '90 days' FROM max_hire)
      )::bigint AS recent_hires
    FROM employees.employee
  ),
  salary_totals AS (
    SELECT ROUND(AVG(amount))::bigint AS average_current_salary
    FROM employees.salary
    WHERE to_date >= CURRENT_DATE
  )
  SELECT
    total_employees,
    (SELECT COUNT(*)::bigint FROM employees.department) AS departments,
    recent_hires,
    average_current_salary,
    to_char(first_hire, 'YYYY-MM-DD') AS first_hire,
    to_char(latest_hire, 'YYYY-MM-DD') AS latest_hire
  FROM employee_totals
  CROSS JOIN salary_totals;
`;

const columnsQuery = `
  SELECT column_name, data_type, is_nullable
  FROM information_schema.columns
  WHERE table_schema = $1 AND table_name = $2
  ORDER BY ordinal_position;
`;

const genderQuery = `
  SELECT gender::text AS label, COUNT(*)::bigint AS value
  FROM employees.employee
  GROUP BY gender
  ORDER BY label;
`;

const departmentQuery = `
  SELECT d.dept_name AS label, COUNT(*)::bigint AS value
  FROM employees.department_employee AS de
  JOIN employees.department AS d ON d.id = de.department_id
  WHERE de.to_date >= CURRENT_DATE
  GROUP BY d.dept_name
  ORDER BY value DESC, label
  LIMIT 10;
`;

const hireTrendQuery = `
  SELECT EXTRACT(YEAR FROM hire_date)::int AS label, COUNT(*)::bigint AS value
  FROM employees.employee
  GROUP BY label
  ORDER BY label DESC
  LIMIT 12;
`;

const latestEmployeesQuery = `
  SELECT
    e.id,
    e.first_name,
    e.last_name,
    e.gender::text AS gender,
    to_char(e.hire_date, 'YYYY-MM-DD') AS hire_date,
    COALESCE(current_department.dept_name, 'Unassigned') AS department
  FROM employees.employee AS e
  LEFT JOIN LATERAL (
    SELECT d.dept_name
    FROM employees.department_employee AS de
    JOIN employees.department AS d ON d.id = de.department_id
    WHERE de.employee_id = e.id AND de.to_date >= CURRENT_DATE
    ORDER BY de.from_date DESC
    LIMIT 1
  ) AS current_department ON TRUE
  ORDER BY e.hire_date DESC, e.id DESC
  LIMIT $1;
`;

function numberOrNull(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

function formatMoney(value) {
  const numeric = numberOrNull(value);
  if (numeric === null) {
    return "n/a";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(numeric);
}

function mapSeriesRows(rows) {
  return rows.map((row) => ({
    label: String(row.label),
    value: numberOrNull(row.value) || 0
  }));
}

function mapMetricRows(row) {
  const totalEmployees = numberOrNull(row.total_employees) || 0;
  const departments = numberOrNull(row.departments) || 0;
  const recentHires = numberOrNull(row.recent_hires) || 0;
  const averageCurrentSalary = numberOrNull(row.average_current_salary);

  return {
    totalEmployees,
    departments,
    recentHires,
    averageCurrentSalary,
    firstHire: row.first_hire,
    latestHire: row.latest_hire,
    cards: [
      {
        label: "Employees",
        value: totalEmployees.toLocaleString("en-US"),
        detail: `Source rows in ${TABLE_SCHEMA}.${TABLE_NAME}`
      },
      {
        label: "Departments",
        value: departments.toLocaleString("en-US"),
        detail: "Active department assignments"
      },
      {
        label: "Recent hires",
        value: recentHires.toLocaleString("en-US"),
        detail: "Within 90 days of the latest hire date in the table"
      },
      {
        label: "Avg salary",
        value: formatMoney(averageCurrentSalary),
        detail: "Current salary records"
      }
    ]
  };
}

function mapEmployeeRows(rows) {
  return rows.map((row) => ({
    id: numberOrNull(row.id),
    name: `${row.first_name} ${row.last_name}`,
    gender: row.gender,
    hireDate: row.hire_date,
    department: row.department
  }));
}

async function getDashboardData(pool) {
  const [
    metricsResult,
    columnsResult,
    genderResult,
    departmentResult,
    hireTrendResult,
    latestEmployeesResult
  ] = await Promise.all([
    pool.query(metricsQuery),
    pool.query(columnsQuery, [TABLE_SCHEMA, TABLE_NAME]),
    pool.query(genderQuery),
    pool.query(departmentQuery),
    pool.query(hireTrendQuery),
    pool.query(latestEmployeesQuery, [LATEST_EMPLOYEE_LIMIT])
  ]);

  const metrics = mapMetricRows(metricsResult.rows[0]);
  const hireTrend = mapSeriesRows(hireTrendResult.rows).reverse();

  return {
    generatedAt: new Date().toISOString(),
    refreshMs: STREAM_REFRESH_MS,
    source: {
      schema: TABLE_SCHEMA,
      table: TABLE_NAME,
      columns: columnsResult.rows.map((column) => ({
        name: column.column_name,
        type: column.data_type,
        nullable: column.is_nullable === "YES"
      })),
      dateRange: {
        firstHire: metrics.firstHire,
        latestHire: metrics.latestHire
      }
    },
    metrics: metrics.cards,
    charts: {
      gender: mapSeriesRows(genderResult.rows),
      departments: mapSeriesRows(departmentResult.rows),
      hireTrend
    },
    latestEmployees: mapEmployeeRows(latestEmployeesResult.rows)
  };
}

module.exports = {
  STREAM_REFRESH_MS,
  getDashboardData,
  mapEmployeeRows,
  mapMetricRows,
  mapSeriesRows,
  numberOrNull
};

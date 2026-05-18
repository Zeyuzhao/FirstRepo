import "server-only";
import { query } from "./db";

const CURRENT_DEPARTMENT = `
  SELECT employee_id, department_id
  FROM employees.department_employee
  WHERE to_date >= CURRENT_DATE
`;

const CURRENT_SALARY = `
  SELECT DISTINCT ON (employee_id)
    employee_id,
    amount
  FROM employees.salary
  WHERE to_date >= CURRENT_DATE
  ORDER BY employee_id, from_date DESC
`;

const numberValue = (value) => (value == null ? 0 : Number(value));

export async function getDashboardData() {
  const [
    overviewRows,
    departmentRows,
    titleRows,
    genderRows,
    hireRows,
    salaryBandRows,
    managerRows,
    tableRows,
  ] = await Promise.all([
    query(`
      WITH
        current_department AS (${CURRENT_DEPARTMENT}),
        current_salary AS (${CURRENT_SALARY})
      SELECT
        (SELECT COUNT(*)::bigint FROM employees.employee) AS total_employees,
        (SELECT COUNT(DISTINCT employee_id)::bigint FROM current_department) AS active_employees,
        (SELECT COUNT(*)::bigint FROM employees.department) AS departments,
        (SELECT ROUND(AVG(amount))::bigint FROM current_salary) AS avg_salary,
        (
          SELECT ROUND((PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount))::numeric)::bigint
          FROM current_salary
        ) AS median_salary,
        (
          SELECT COUNT(*)::bigint
          FROM employees.department_manager
          WHERE to_date >= CURRENT_DATE
        ) AS current_managers,
        (
          SELECT MAX(hire_date)
          FROM employees.employee
        ) AS latest_hire_date
    `),
    query(`
      WITH
        current_department AS (${CURRENT_DEPARTMENT}),
        current_salary AS (${CURRENT_SALARY})
      SELECT
        TRIM(d.id) AS id,
        d.dept_name,
        COUNT(DISTINCT cd.employee_id)::bigint AS headcount,
        ROUND(AVG(cs.amount))::bigint AS avg_salary,
        COUNT(DISTINCT dm.employee_id)::bigint AS manager_count
      FROM employees.department AS d
      LEFT JOIN current_department AS cd
        ON cd.department_id = d.id
      LEFT JOIN current_salary AS cs
        ON cs.employee_id = cd.employee_id
      LEFT JOIN employees.department_manager AS dm
        ON dm.department_id = d.id
        AND dm.to_date >= CURRENT_DATE
      GROUP BY d.id, d.dept_name
      ORDER BY headcount DESC, d.dept_name
    `),
    query(`
      SELECT
        title,
        COUNT(DISTINCT employee_id)::bigint AS employee_count
      FROM employees.title
      WHERE to_date >= CURRENT_DATE
      GROUP BY title
      ORDER BY employee_count DESC, title
    `),
    query(`
      SELECT
        gender::text AS gender,
        COUNT(*)::bigint AS employee_count
      FROM employees.employee
      GROUP BY gender
      ORDER BY gender
    `),
    query(`
      SELECT
        (FLOOR(EXTRACT(YEAR FROM hire_date)::numeric / 5) * 5)::int AS period_start,
        COUNT(*)::bigint AS employee_count
      FROM employees.employee
      GROUP BY period_start
      ORDER BY period_start
    `),
    query(`
      WITH current_salary AS (${CURRENT_SALARY})
      SELECT
        CASE
          WHEN amount < 50000 THEN '< $50k'
          WHEN amount < 70000 THEN '$50k-$69k'
          WHEN amount < 90000 THEN '$70k-$89k'
          WHEN amount < 110000 THEN '$90k-$109k'
          ELSE '$110k+'
        END AS salary_band,
        COUNT(*)::bigint AS employee_count,
        MIN(amount) AS sort_amount
      FROM current_salary
      GROUP BY salary_band
      ORDER BY sort_amount
    `),
    query(`
      WITH current_salary AS (${CURRENT_SALARY})
      SELECT
        d.dept_name,
        e.id AS employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS manager_name,
        dm.from_date,
        cs.amount AS salary
      FROM employees.department_manager AS dm
      JOIN employees.department AS d
        ON d.id = dm.department_id
      JOIN employees.employee AS e
        ON e.id = dm.employee_id
      LEFT JOIN current_salary AS cs
        ON cs.employee_id = e.id
      WHERE dm.to_date >= CURRENT_DATE
      ORDER BY d.dept_name
    `),
    query(`
      SELECT 'employees.employee' AS table_name, COUNT(*)::bigint AS row_count FROM employees.employee
      UNION ALL
      SELECT 'employees.department', COUNT(*)::bigint FROM employees.department
      UNION ALL
      SELECT 'employees.department_employee', COUNT(*)::bigint FROM employees.department_employee
      UNION ALL
      SELECT 'employees.department_manager', COUNT(*)::bigint FROM employees.department_manager
      UNION ALL
      SELECT 'employees.salary', COUNT(*)::bigint FROM employees.salary
      UNION ALL
      SELECT 'employees.title', COUNT(*)::bigint FROM employees.title
      ORDER BY row_count DESC
    `),
  ]);

  const overview = overviewRows[0] || {};
  const departments = departmentRows.map((row) => ({
    ...row,
    headcount: numberValue(row.headcount),
    avg_salary: numberValue(row.avg_salary),
    manager_count: numberValue(row.manager_count),
  }));

  return {
    generatedAt: new Date().toISOString(),
    overview: {
      totalEmployees: numberValue(overview.total_employees),
      activeEmployees: numberValue(overview.active_employees),
      departments: numberValue(overview.departments),
      avgSalary: numberValue(overview.avg_salary),
      medianSalary: numberValue(overview.median_salary),
      currentManagers: numberValue(overview.current_managers),
      latestHireDate: overview.latest_hire_date,
    },
    departments,
    titles: titleRows.map((row) => ({
      title: row.title,
      employeeCount: numberValue(row.employee_count),
    })),
    genders: genderRows.map((row) => ({
      gender: row.gender === "M" ? "Men" : row.gender === "F" ? "Women" : row.gender,
      employeeCount: numberValue(row.employee_count),
    })),
    hires: hireRows.map((row) => ({
      period: `${row.period_start}-${Number(row.period_start) + 4}`,
      employeeCount: numberValue(row.employee_count),
    })),
    salaryBands: salaryBandRows.map((row) => ({
      band: row.salary_band,
      employeeCount: numberValue(row.employee_count),
    })),
    managers: managerRows.map((row) => ({
      department: row.dept_name,
      employeeId: row.employee_id,
      name: row.manager_name,
      fromDate: row.from_date,
      salary: numberValue(row.salary),
    })),
    tables: tableRows.map((row) => ({
      tableName: row.table_name,
      rowCount: numberValue(row.row_count),
    })),
  };
}

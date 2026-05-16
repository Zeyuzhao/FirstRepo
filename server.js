import http from 'node:http';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, 'public');

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
const cacheMs = Number(process.env.DASHBOARD_CACHE_MS || 5 * 60 * 1000);

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      max: 4,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      statement_timeout: 20_000,
      query_timeout: 25_000,
      application_name: 'employee-dashboard-readonly'
    })
  : null;

let dashboardCache = {
  expiresAt: 0,
  data: null
};

const overviewSql = `
  WITH active_assignments AS (
    SELECT DISTINCT employee_id
    FROM employees.department_employee
    WHERE to_date >= CURRENT_DATE
  ),
  current_salaries AS (
    SELECT DISTINCT ON (employee_id)
      employee_id,
      amount
    FROM employees.salary
    WHERE to_date >= CURRENT_DATE
    ORDER BY employee_id, to_date DESC, from_date DESC
  ),
  current_titles AS (
    SELECT DISTINCT ON (employee_id)
      employee_id,
      title
    FROM employees.title
    WHERE to_date IS NULL OR to_date >= CURRENT_DATE
    ORDER BY employee_id, COALESCE(to_date, DATE '9999-12-31') DESC, from_date DESC
  )
  SELECT
    CURRENT_DATE AS database_date,
    COUNT(*)::bigint AS total_employees,
    (SELECT COUNT(*)::bigint FROM active_assignments) AS active_employees,
    (SELECT COUNT(*)::bigint FROM employees.department) AS departments,
    (SELECT COUNT(DISTINCT title)::bigint FROM current_titles) AS active_titles,
    ROUND((SELECT AVG(amount) FROM current_salaries))::bigint AS avg_current_salary,
    ROUND((SELECT PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) FROM current_salaries))::bigint AS median_current_salary,
    (SELECT MIN(hire_date) FROM employees.employee) AS first_hire_date,
    (SELECT MAX(hire_date) FROM employees.employee) AS latest_hire_date
  FROM employees.employee
`;

const departmentsSql = `
  WITH active_assignments AS (
    SELECT employee_id, department_id
    FROM employees.department_employee
    WHERE to_date >= CURRENT_DATE
  ),
  current_salaries AS (
    SELECT DISTINCT ON (employee_id)
      employee_id,
      amount
    FROM employees.salary
    WHERE to_date >= CURRENT_DATE
    ORDER BY employee_id, to_date DESC, from_date DESC
  )
  SELECT
    d.dept_name AS department,
    COUNT(DISTINCT aa.employee_id)::bigint AS active_employees,
    ROUND(AVG(cs.amount))::bigint AS avg_salary
  FROM active_assignments aa
  JOIN employees.department d ON d.id = aa.department_id
  LEFT JOIN current_salaries cs ON cs.employee_id = aa.employee_id
  GROUP BY d.dept_name
  ORDER BY active_employees DESC, department
`;

const titlesSql = `
  WITH current_titles AS (
    SELECT DISTINCT ON (employee_id)
      employee_id,
      title
    FROM employees.title
    WHERE to_date IS NULL OR to_date >= CURRENT_DATE
    ORDER BY employee_id, COALESCE(to_date, DATE '9999-12-31') DESC, from_date DESC
  )
  SELECT title, COUNT(*)::bigint AS active_employees
  FROM current_titles
  GROUP BY title
  ORDER BY active_employees DESC, title
`;

const salaryBandsSql = `
  WITH current_salaries AS (
    SELECT DISTINCT ON (employee_id)
      employee_id,
      amount
    FROM employees.salary
    WHERE to_date >= CURRENT_DATE
    ORDER BY employee_id, to_date DESC, from_date DESC
  ),
  banded AS (
    SELECT
      CASE
        WHEN amount < 50000 THEN 'Under 50k'
        WHEN amount < 70000 THEN '50k-69k'
        WHEN amount < 90000 THEN '70k-89k'
        WHEN amount < 110000 THEN '90k-109k'
        WHEN amount < 130000 THEN '110k-129k'
        ELSE '130k+'
      END AS salary_band,
      CASE
        WHEN amount < 50000 THEN 1
        WHEN amount < 70000 THEN 2
        WHEN amount < 90000 THEN 3
        WHEN amount < 110000 THEN 4
        WHEN amount < 130000 THEN 5
        ELSE 6
      END AS band_order,
      amount
    FROM current_salaries
  )
  SELECT
    salary_band,
    band_order,
    COUNT(*)::bigint AS employees,
    MIN(amount)::bigint AS min_salary,
    MAX(amount)::bigint AS max_salary
  FROM banded
  GROUP BY salary_band, band_order
  ORDER BY band_order
`;

const genderSql = `
  WITH active AS (
    SELECT DISTINCT employee_id
    FROM employees.department_employee
    WHERE to_date >= CURRENT_DATE
  )
  SELECT e.gender::text AS gender, COUNT(*)::bigint AS active_employees
  FROM active a
  JOIN employees.employee e ON e.id = a.employee_id
  GROUP BY e.gender
  ORDER BY active_employees DESC, gender
`;

const hiringTrendSql = `
  SELECT
    EXTRACT(YEAR FROM hire_date)::int AS hire_year,
    COUNT(*)::bigint AS hires
  FROM employees.employee
  GROUP BY hire_year
  ORDER BY hire_year
`;

const managersSql = `
  SELECT
    d.dept_name AS department,
    COUNT(DISTINCT dm.employee_id)::bigint AS current_managers
  FROM employees.department d
  LEFT JOIN employees.department_manager dm
    ON dm.department_id = d.id
   AND dm.to_date >= CURRENT_DATE
  GROUP BY d.dept_name
  ORDER BY current_managers DESC, department
`;

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

function toNumber(value) {
  if (value === null || value === undefined) {
    return null;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function mapNumbers(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, toNumber(value)])
  );
}

function json(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

async function getDashboardData() {
  if (!pool) {
    const error = new Error('Database connection is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const now = Date.now();
  if (dashboardCache.data && dashboardCache.expiresAt > now) {
    return {
      ...dashboardCache.data,
      cache: {
        refreshedAt: dashboardCache.data.cache.refreshedAt,
        expiresAt: new Date(dashboardCache.expiresAt).toISOString(),
        ttlSeconds: Math.round((dashboardCache.expiresAt - now) / 1000)
      }
    };
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN READ ONLY');

    const overview = await client.query(overviewSql);
    const departments = await client.query(departmentsSql);
    const titles = await client.query(titlesSql);
    const salaryBands = await client.query(salaryBandsSql);
    const genders = await client.query(genderSql);
    const hiringTrend = await client.query(hiringTrendSql);
    const managers = await client.query(managersSql);

    await client.query('COMMIT');

    const data = {
      overview: mapNumbers(overview.rows[0]),
      departments: departments.rows.map(mapNumbers),
      titles: titles.rows.map(mapNumbers),
      salaryBands: salaryBands.rows.map(mapNumbers),
      genders: genders.rows.map(mapNumbers),
      hiringTrend: hiringTrend.rows.map(mapNumbers),
      managers: managers.rows.map(mapNumbers),
      cache: {
        refreshedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + cacheMs).toISOString(),
        ttlSeconds: Math.round(cacheMs / 1000)
      }
    };

    dashboardCache = {
      data,
      expiresAt: Date.now() + cacheMs
    };

    return data;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // Ignore rollback errors so the original query failure is reported.
    }

    throw error;
  } finally {
    client.release();
  }
}

async function serveStatic(req, res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(publicDir, normalizedPath);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(filePath);
    const extension = path.extname(filePath);
    res.writeHead(200, {
      'content-type': contentTypes[extension] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405, { allow: 'GET' });
    res.end('Method not allowed');
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (url.pathname === '/api/employee-dashboard') {
    try {
      const data = await getDashboardData();
      json(res, 200, data);
    } catch (error) {
      console.error('Employee dashboard query failed', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      });

      json(res, error.statusCode || 500, {
        error: 'Employee dashboard data is unavailable.',
        detail: error.statusCode ? error.message : 'The aggregate SQL query failed.'
      });
    }

    return;
  }

  await serveStatic(req, res, url.pathname);
});

server.listen(port, host, () => {
  console.log(`Employee dashboard listening on http://${host}:${port}`);
});

import {
  BadgeDollarSign,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Database,
  FileBarChart,
  UsersRound,
} from "lucide-react";
import { getDashboardData } from "../lib/dashboard-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const number = new Intl.NumberFormat("en-US");
const compact = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatDate(value) {
  if (!value) {
    return "N/A";
  }

  return dateFormatter.format(new Date(value));
}

function cleanError(error) {
  const message = error instanceof Error ? error.message : "Unknown database error";
  return message.replace(/postgres(?:ql)?:\/\/\S+/g, "[database-url]");
}

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <section className={`stat-card ${tone}`}>
      <div className="stat-icon">
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </section>
  );
}

function BarRows({ rows, labelKey, valueKey, valueFormatter = number.format, maxRows = 8 }) {
  const shown = rows.slice(0, maxRows);
  const max = Math.max(...shown.map((row) => row[valueKey]), 1);

  return (
    <div className="bar-rows">
      {shown.map((row) => {
        const width = `${Math.max((row[valueKey] / max) * 100, 3)}%`;

        return (
          <div className="bar-row" key={row[labelKey]}>
            <div className="bar-label">
              <span>{row[labelKey]}</span>
              <strong>{valueFormatter(row[valueKey])}</strong>
            </div>
            <div className="bar-track" aria-hidden="true">
              <span style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SplitRows({ rows, labelKey, valueKey }) {
  const total = rows.reduce((sum, row) => sum + row[valueKey], 0) || 1;

  return (
    <div className="split-rows">
      {rows.map((row) => (
        <div className="split-row" key={row[labelKey]}>
          <div>
            <span>{row[labelKey]}</span>
            <strong>{number.format(row[valueKey])}</strong>
          </div>
          <p>{Math.round((row[valueKey] / total) * 100)}%</p>
        </div>
      ))}
    </div>
  );
}

function DataTable({ rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Manager</th>
            <th>Since</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.department}-${row.employeeId}`}>
              <td>{row.department}</td>
              <td>{row.name}</td>
              <td>{formatDate(row.fromDate)}</td>
              <td>{row.salary ? currency.format(row.salary) : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Dashboard({ data }) {
  const topDepartment = data.departments[0];
  const activeShare = data.overview.totalEmployees
    ? Math.round((data.overview.activeEmployees / data.overview.totalEmployees) * 100)
    : 0;

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Read-only Postgres</p>
          <h1>SQL Dashboard</h1>
        </div>
        <div className="status-pill">
          <Database size={16} strokeWidth={2} />
          <span>Updated {formatDate(data.generatedAt)}</span>
        </div>
      </header>

      <section className="stats-grid" aria-label="Database overview">
        <StatCard
          icon={UsersRound}
          label="Active employees"
          value={number.format(data.overview.activeEmployees)}
          detail={`${activeShare}% of all employee records`}
          tone="tone-teal"
        />
        <StatCard
          icon={BadgeDollarSign}
          label="Average salary"
          value={currency.format(data.overview.avgSalary)}
          detail={`Median ${currency.format(data.overview.medianSalary)}`}
          tone="tone-gold"
        />
        <StatCard
          icon={Building2}
          label="Top department"
          value={topDepartment?.dept_name || "N/A"}
          detail={topDepartment ? `${number.format(topDepartment.headcount)} employees` : "No rows"}
          tone="tone-red"
        />
        <StatCard
          icon={BriefcaseBusiness}
          label="Departments"
          value={number.format(data.overview.departments)}
          detail={`${number.format(data.overview.currentManagers)} current managers`}
          tone="tone-ink"
        />
      </section>

      <section className="content-grid">
        <article className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Current assignment</p>
              <h2>Headcount by department</h2>
            </div>
            <FileBarChart size={20} strokeWidth={2} />
          </div>
          <BarRows rows={data.departments} labelKey="dept_name" valueKey="headcount" />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Current titles</p>
              <h2>Role mix</h2>
            </div>
            <BarChart3 size={20} strokeWidth={2} />
          </div>
          <BarRows
            rows={data.titles}
            labelKey="title"
            valueKey="employeeCount"
            valueFormatter={compact.format}
            maxRows={7}
          />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Compensation</p>
              <h2>Salary bands</h2>
            </div>
            <BadgeDollarSign size={20} strokeWidth={2} />
          </div>
          <BarRows
            rows={data.salaryBands}
            labelKey="band"
            valueKey="employeeCount"
            valueFormatter={compact.format}
          />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Hiring history</p>
              <h2>Five-year cohorts</h2>
            </div>
            <CalendarClock size={20} strokeWidth={2} />
          </div>
          <BarRows rows={data.hires} labelKey="period" valueKey="employeeCount" valueFormatter={compact.format} />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Employee records</p>
              <h2>Gender split</h2>
            </div>
            <UsersRound size={20} strokeWidth={2} />
          </div>
          <SplitRows rows={data.genders} labelKey="gender" valueKey="employeeCount" />
        </article>

        <article className="panel panel-wide">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Current leadership</p>
              <h2>Department managers</h2>
            </div>
            <BriefcaseBusiness size={20} strokeWidth={2} />
          </div>
          <DataTable rows={data.managers} />
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Schema volume</p>
              <h2>Largest tables</h2>
            </div>
            <Database size={20} strokeWidth={2} />
          </div>
          <BarRows
            rows={data.tables}
            labelKey="tableName"
            valueKey="rowCount"
            valueFormatter={compact.format}
          />
        </article>
      </section>
    </main>
  );
}

export default async function Page() {
  try {
    const data = await getDashboardData();
    return <Dashboard data={data} />;
  } catch (error) {
    return (
      <main className="shell">
        <section className="error-state">
          <div className="stat-icon tone-red">
            <Database size={22} strokeWidth={2} />
          </div>
          <p className="eyebrow">Database unavailable</p>
          <h1>SQL Dashboard</h1>
          <p>{cleanError(error)}</p>
        </section>
      </main>
    );
  }
}

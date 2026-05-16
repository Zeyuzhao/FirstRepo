const dashboardData = {
  source: {
    database: "Postgres",
    schema: "employees",
    generatedAt: "2026-05-16",
    currentRule: "to_date >= CURRENT_DATE",
  },
  summary: {
    totalEmployees: 300024,
    activeEmployees: 240124,
    formerEmployees: 59900,
    departments: 9,
    avgSalary: 72012,
    medianSalary: 69805,
    minSalary: 38623,
    maxSalary: 158220,
    firstHire: "1985-01-01",
    latestHire: "2000-01-23",
    avgTenureYears: 35.8,
  },
  departments: [
    { department: "Development", headcount: 61386, avgSalary: 67658, pctFemale: 40.0, avgTenureYears: 35.8 },
    { department: "Production", headcount: 53304, avgSalary: 67843, pctFemale: 40.1, avgTenureYears: 35.8 },
    { department: "Sales", headcount: 37701, avgSalary: 88853, pctFemale: 39.8, avgTenureYears: 35.8 },
    { department: "Customer Service", headcount: 17569, avgSalary: 67285, pctFemale: 39.9, avgTenureYears: 35.8 },
    { department: "Research", headcount: 15441, avgSalary: 67913, pctFemale: 40.0, avgTenureYears: 35.8 },
    { department: "Marketing", headcount: 14842, avgSalary: 80059, pctFemale: 39.5, avgTenureYears: 35.8 },
    { department: "Quality Management", headcount: 14546, avgSalary: 65442, pctFemale: 40.4, avgTenureYears: 35.8 },
    { department: "Human Resources", headcount: 12898, avgSalary: 63922, pctFemale: 39.9, avgTenureYears: 35.8 },
    { department: "Finance", headcount: 12437, avgSalary: 78560, pctFemale: 40.3, avgTenureYears: 35.8 },
  ],
  titles: [
    { title: "Senior Engineer", headcount: 85939 },
    { title: "Senior Staff", headcount: 82024 },
    { title: "Engineer", headcount: 30983 },
    { title: "Staff", headcount: 25526 },
    { title: "Technique Leader", headcount: 12055 },
    { title: "Assistant Engineer", headcount: 3588 },
    { title: "Manager", headcount: 9 },
  ],
  salaryBands: [
    { band: "<50k", employees: 20305 },
    { band: "50k-69k", employees: 100902 },
    { band: "70k-89k", employees: 81479 },
    { band: "90k-109k", employees: 30550 },
    { band: "110k+", employees: 6888 },
  ],
  gender: [
    { gender: "Female", employees: 96010, color: "#0f766e" },
    { gender: "Male", employees: 144114, color: "#2563eb" },
  ],
  hireTrend: [
    { year: 1985, hires: 35316 },
    { year: 1986, hires: 36150 },
    { year: 1987, hires: 33501 },
    { year: 1988, hires: 31436 },
    { year: 1989, hires: 28394 },
    { year: 1990, hires: 25610 },
    { year: 1991, hires: 22568 },
    { year: 1992, hires: 20402 },
    { year: 1993, hires: 17772 },
    { year: 1994, hires: 14835 },
    { year: 1995, hires: 12115 },
    { year: 1996, hires: 9574 },
    { year: 1997, hires: 6669 },
    { year: 1998, hires: 4155 },
    { year: 1999, hires: 1514 },
    { year: 2000, hires: 13 },
  ],
  tenureBands: [
    { band: "<30 yrs", employees: 14399 },
    { band: "30-34 yrs", employees: 66442 },
    { band: "35-39 yrs", employees: 120026 },
    { band: "40+ yrs", employees: 39257 },
  ],
};

const colors = ["#2563eb", "#0f766e", "#d97706", "#7c3aed", "#be123c", "#0891b2"];

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function formatNumber(value) {
  return numberFormatter.format(value);
}

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function percent(part, total) {
  return total === 0 ? 0 : (part / total) * 100;
}

function renderSummary() {
  const { summary } = dashboardData;
  const cards = [
    {
      label: "Active employees",
      value: formatNumber(summary.activeEmployees),
      detail: `${formatNumber(summary.formerEmployees)} historical records excluded from active views`,
    },
    {
      label: "Current average salary",
      value: formatCurrency(summary.avgSalary),
      detail: `Median ${formatCurrency(summary.medianSalary)} across current salaries`,
    },
    {
      label: "Departments",
      value: summary.departments,
      detail: `Largest team: ${dashboardData.departments[0].department}`,
    },
    {
      label: "Average tenure",
      value: `${summary.avgTenureYears} yrs`,
      detail: `Active hire dates from ${summary.firstHire} to ${summary.latestHire}`,
    },
  ];

  document.getElementById("summaryGrid").innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <div>
            <div class="summary-label">${card.label}</div>
            <div class="summary-value">${card.value}</div>
          </div>
          <div class="summary-detail">${card.detail}</div>
        </article>
      `,
    )
    .join("");
}

function departmentValue(row, metric) {
  if (metric === "avgSalary") return row.avgSalary;
  if (metric === "pctFemale") return row.pctFemale;
  return row.headcount;
}

function departmentDisplay(row, metric) {
  if (metric === "avgSalary") return formatCurrency(row.avgSalary);
  if (metric === "pctFemale") return `${row.pctFemale.toFixed(1)}%`;
  return formatNumber(row.headcount);
}

function renderDepartmentBars(metric = "headcount") {
  const rows = dashboardData.departments;
  const max = Math.max(...rows.map((row) => departmentValue(row, metric)));

  document.getElementById("departmentBars").innerHTML = rows
    .map((row, index) => {
      const width = percent(departmentValue(row, metric), max);
      const color = colors[index % colors.length];
      return `
        <div class="bar-row">
          <div class="row-label">${row.department}</div>
          <div class="track" aria-hidden="true">
            <span class="fill" style="--width: ${width}%; --bar-color: ${color}"></span>
          </div>
          <div class="row-value">${departmentDisplay(row, metric)}</div>
        </div>
      `;
    })
    .join("");
}

function renderTitleRanks() {
  const max = Math.max(...dashboardData.titles.map((row) => row.headcount));

  document.getElementById("titleRanks").innerHTML = dashboardData.titles
    .map((row, index) => `
      <div class="rank-row">
        <div class="row-label">${row.title}</div>
        <div class="track" aria-hidden="true">
          <span class="fill" style="--width: ${percent(row.headcount, max)}%; --bar-color: ${colors[index % colors.length]}"></span>
        </div>
        <div class="row-value">${formatNumber(row.headcount)}</div>
      </div>
    `)
    .join("");
}

function renderSalaryBands() {
  const max = Math.max(...dashboardData.salaryBands.map((row) => row.employees));

  document.getElementById("salaryBands").innerHTML = dashboardData.salaryBands
    .map((row, index) => `
      <div class="column-item">
        <div class="column" aria-hidden="true">
          <span style="--height: ${percent(row.employees, max)}%; --bar-color: ${colors[index % colors.length]}"></span>
        </div>
        <div class="column-label">${row.band}</div>
        <div class="column-value">${formatNumber(row.employees)}</div>
      </div>
    `)
    .join("");
}

function renderGenderBalance() {
  const total = dashboardData.gender.reduce((sum, row) => sum + row.employees, 0);
  const segments = dashboardData.gender
    .map((row) => `<span class="balance-segment" style="--width: ${percent(row.employees, total)}%; --bar-color: ${row.color}"></span>`)
    .join("");
  const stats = dashboardData.gender
    .map((row) => `
      <div class="balance-stat" style="--bar-color: ${row.color}">
        <strong>${percent(row.employees, total).toFixed(1)}%</strong>
        <span>${row.gender} - ${formatNumber(row.employees)}</span>
      </div>
    `)
    .join("");

  document.getElementById("genderBalance").innerHTML = `
    <div class="balance-stack" aria-label="Gender distribution">${segments}</div>
    <div class="balance-grid">${stats}</div>
  `;
}

function renderHireTrend() {
  const rows = dashboardData.hireTrend;
  const width = 640;
  const height = 185;
  const padding = 18;
  const max = Math.max(...rows.map((row) => row.hires));
  const minYear = rows[0].year;
  const maxYear = rows[rows.length - 1].year;
  const points = rows
    .map((row, index) => {
      const x = padding + (index / (rows.length - 1)) * (width - padding * 2);
      const y = height - padding - (row.hires / max) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  document.getElementById("hireTrend").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Annual hires from ${minYear} to ${maxYear}">
      <polygon points="${areaPoints}" fill="rgba(37, 99, 235, 0.12)"></polygon>
      <polyline points="${points}" fill="none" stroke="#2563eb" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${rows
        .map((row, index) => {
          const x = padding + (index / (rows.length - 1)) * (width - padding * 2);
          const y = height - padding - (row.hires / max) * (height - padding * 2);
          return `<circle cx="${x}" cy="${y}" r="4" fill="#ffffff" stroke="#2563eb" stroke-width="2.5"><title>${row.year}: ${formatNumber(row.hires)} hires</title></circle>`;
        })
        .join("")}
    </svg>
    <div class="axis-labels"><span>${minYear}</span><span>${maxYear}</span></div>
  `;
}

function renderDepartmentTable() {
  document.getElementById("departmentTable").innerHTML = dashboardData.departments
    .map((row) => `
      <tr>
        <td>${row.department}</td>
        <td>${formatNumber(row.headcount)}</td>
        <td>${formatCurrency(row.avgSalary)}</td>
        <td>${row.pctFemale.toFixed(1)}%</td>
        <td>${row.avgTenureYears.toFixed(1)} yrs</td>
      </tr>
    `)
    .join("");
}

function initDashboard() {
  renderSummary();
  renderDepartmentBars();
  renderTitleRanks();
  renderSalaryBands();
  renderGenderBalance();
  renderHireTrend();
  renderDepartmentTable();

  document.getElementById("departmentMetric").addEventListener("change", (event) => {
    renderDepartmentBars(event.target.value);
  });
}

document.addEventListener("DOMContentLoaded", initDashboard);

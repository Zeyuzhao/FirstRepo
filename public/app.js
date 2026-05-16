const formatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});
const dateFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium'
});

const elements = {
  status: document.querySelector('#status-pill'),
  refresh: document.querySelector('#refresh-button'),
  activeEmployees: document.querySelector('#active-employees'),
  activeRate: document.querySelector('#active-rate'),
  totalEmployees: document.querySelector('#total-employees'),
  hireRange: document.querySelector('#hire-range'),
  avgSalary: document.querySelector('#avg-salary'),
  medianSalary: document.querySelector('#median-salary'),
  departmentsCount: document.querySelector('#departments-count'),
  titlesCount: document.querySelector('#titles-count'),
  departmentTotal: document.querySelector('#department-total'),
  departmentList: document.querySelector('#department-list'),
  genderDonut: document.querySelector('#gender-donut'),
  genderLegend: document.querySelector('#gender-legend'),
  titleList: document.querySelector('#title-list'),
  salaryChart: document.querySelector('#salary-chart'),
  hiringChart: document.querySelector('#hiring-chart'),
  departmentSalaryTable: document.querySelector('#department-salary-table'),
  dataFreshness: document.querySelector('#data-freshness')
};

function number(value) {
  return formatter.format(value || 0);
}

function money(value) {
  return value === null || value === undefined ? '--' : currencyFormatter.format(value);
}

function percent(value) {
  if (!Number.isFinite(value)) {
    return '--';
  }

  return `${value.toFixed(1)}%`;
}

function formatDate(value) {
  if (!value) {
    return '--';
  }

  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function setStatus(label, mode = 'ready') {
  elements.status.textContent = label;
  elements.status.classList.toggle('error', mode === 'error');
}

function maxBy(rows, key) {
  return Math.max(...rows.map((row) => Number(row[key]) || 0), 1);
}

function barRow({ label, value, max, suffix = '', tone = '' }) {
  const width = `${Math.max(2, ((value || 0) / max) * 100)}%`;

  return `
    <div class="bar-row">
      <span class="row-label" title="${label}">${label}</span>
      <div class="track" aria-hidden="true">
        <div class="fill ${tone}" style="width: ${width}"></div>
      </div>
      <span class="row-value">${number(value)}${suffix}</span>
    </div>
  `;
}

function renderOverview({ overview }) {
  const activeRate = (overview.active_employees / overview.total_employees) * 100;

  elements.activeEmployees.textContent = number(overview.active_employees);
  elements.activeRate.textContent = `${percent(activeRate)} of total employee records`;
  elements.totalEmployees.textContent = number(overview.total_employees);
  elements.hireRange.textContent = `${formatDate(overview.first_hire_date)} to ${formatDate(overview.latest_hire_date)}`;
  elements.avgSalary.textContent = money(overview.avg_current_salary);
  elements.medianSalary.textContent = `${money(overview.median_current_salary)} median`;
  elements.departmentsCount.textContent = number(overview.departments);
  elements.titlesCount.textContent = `${number(overview.active_titles)} active title groups`;
}

function renderDepartments({ departments, overview }) {
  const maxHeadcount = maxBy(departments, 'active_employees');

  elements.departmentTotal.textContent = `${number(overview.active_employees)} active`;
  elements.departmentList.innerHTML = departments
    .map((row) => {
      const share = (row.active_employees / overview.active_employees) * 100;
      const width = `${Math.max(2, (row.active_employees / maxHeadcount) * 100)}%`;

      return `
        <div class="department-row">
          <span class="row-label" title="${row.department}">${row.department}</span>
          <div class="track" aria-hidden="true">
            <div class="fill" style="width: ${width}"></div>
          </div>
          <span class="row-value">${number(row.active_employees)} | ${percent(share)}</span>
        </div>
      `;
    })
    .join('');
}

function renderGender({ genders }) {
  const total = genders.reduce((sum, row) => sum + row.active_employees, 0);
  const colors = ['var(--blue)', 'var(--green)', 'var(--amber)', 'var(--rose)'];
  let cursor = 0;

  const segments = genders.map((row, index) => {
    const start = cursor;
    const degrees = total ? (row.active_employees / total) * 360 : 0;
    cursor += degrees;
    return `${colors[index % colors.length]} ${start}deg ${cursor}deg`;
  });

  elements.genderDonut.style.background = `conic-gradient(${segments.join(', ')})`;
  elements.genderLegend.innerHTML = genders
    .map((row, index) => {
      const share = total ? (row.active_employees / total) * 100 : 0;

      return `
        <div class="legend-item">
          <span class="legend-dot" style="background: ${colors[index % colors.length]}"></span>
          <span>${row.gender}</span>
          <strong>${percent(share)}</strong>
        </div>
      `;
    })
    .join('');
}

function renderTitles({ titles }) {
  const maxTitle = maxBy(titles, 'active_employees');

  elements.titleList.innerHTML = titles
    .map((row) =>
      barRow({
        label: row.title,
        value: row.active_employees,
        max: maxTitle,
        tone: 'green'
      })
    )
    .join('');
}

function renderSalaryBands({ salaryBands }) {
  const maxBand = maxBy(salaryBands, 'employees');

  elements.salaryChart.innerHTML = salaryBands
    .map((row) =>
      barRow({
        label: row.salary_band,
        value: row.employees,
        max: maxBand,
        tone: 'amber'
      })
    )
    .join('');
}

function renderHiringTrend({ hiringTrend }) {
  const maxHires = maxBy(hiringTrend, 'hires');

  elements.hiringChart.innerHTML = hiringTrend
    .map((row) => {
      const height = `${Math.max(2, (row.hires / maxHires) * 100)}%`;
      return `
        <div class="timeline-bar" title="${row.hire_year}: ${number(row.hires)} hires">
          <span style="height: ${height}"></span>
          <span>${row.hire_year}</span>
        </div>
      `;
    })
    .join('');
}

function renderDepartmentSalaries({ departments, managers }) {
  const managersByDepartment = new Map(
    managers.map((row) => [row.department, row.current_managers])
  );
  const maxSalary = maxBy(departments, 'avg_salary');
  const rows = [...departments].sort((a, b) => b.avg_salary - a.avg_salary);

  elements.departmentSalaryTable.innerHTML = rows
    .map((row) => {
      const managersCount = managersByDepartment.get(row.department) || 0;
      const width = `${Math.max(2, (row.avg_salary / maxSalary) * 100)}%`;

      return `
        <div class="salary-row">
          <span class="row-label" title="${row.department}">${row.department}</span>
          <div class="track" aria-hidden="true">
            <div class="fill teal" style="width: ${width}"></div>
          </div>
          <span class="row-value">${money(row.avg_salary)} | ${number(managersCount)} mgr</span>
        </div>
      `;
    })
    .join('');
}

function renderFreshness({ overview, cache }) {
  const refreshed = new Date(cache.refreshedAt);
  elements.dataFreshness.textContent = `Database date ${formatDate(overview.database_date)} | refreshed ${dateFormatter.format(refreshed)} ${refreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}

function renderDashboard(data) {
  renderOverview(data);
  renderDepartments(data);
  renderGender(data);
  renderTitles(data);
  renderSalaryBands(data);
  renderHiringTrend(data);
  renderDepartmentSalaries(data);
  renderFreshness(data);
}

async function loadDashboard() {
  elements.refresh.disabled = true;
  setStatus('Loading');

  try {
    const response = await fetch('/api/employee-dashboard', {
      headers: { accept: 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.error || 'Dashboard data unavailable');
    }

    renderDashboard(data);
    setStatus('Live');
  } catch (error) {
    setStatus('Error', 'error');
    elements.dataFreshness.textContent = error.message;
  } finally {
    elements.refresh.disabled = false;
  }
}

elements.refresh.addEventListener('click', loadDashboard);
loadDashboard();

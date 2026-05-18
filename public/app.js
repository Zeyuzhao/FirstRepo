const state = {
  source: null,
  lastSequence: null
};

const colors = ["#1f7a4d", "#316ea9", "#bb7f19", "#b24f45", "#69a86f", "#6d5fba"];

const elements = {
  metrics: document.querySelector("#metrics"),
  hireTrend: document.querySelector("#hire-trend"),
  genderDonut: document.querySelector("#gender-donut"),
  genderLegend: document.querySelector("#gender-legend"),
  departments: document.querySelector("#departments"),
  employeeRows: document.querySelector("#employee-rows"),
  schemaPill: document.querySelector("#schema-pill"),
  status: document.querySelector("#connection-status"),
  pulse: document.querySelector("#stream-pulse"),
  updatedAt: document.querySelector("#updated-at"),
  refreshRate: document.querySelector("#refresh-rate")
};

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function formatTime(value) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function setStatus(status, tone) {
  elements.status.textContent = status;
  elements.pulse.classList.remove("live", "error");

  if (tone) {
    elements.pulse.classList.add(tone);
  }
}

function renderMetrics(metrics) {
  elements.metrics.innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card">
          <p class="metric-label">${escapeHtml(metric.label)}</p>
          <p class="metric-value">${escapeHtml(metric.value)}</p>
          <p class="metric-detail">${escapeHtml(metric.detail)}</p>
        </article>
      `
    )
    .join("");
}

function renderBars(target, rows) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  target.innerHTML = rows
    .map((row) => {
      const height = Math.max((row.value / max) * 100, 3);
      return `
        <div class="bar-item" title="${escapeHtml(row.label)}: ${formatNumber(row.value)}">
          <div class="bar" style="height: ${height}%"></div>
          <span class="bar-value">${formatNumber(row.value)}</span>
          <span class="bar-label">${escapeHtml(row.label)}</span>
        </div>
      `;
    })
    .join("");
}

function renderDonut(rows) {
  const total = rows.reduce((sum, row) => sum + row.value, 0) || 1;
  let cursor = 0;
  const gradientStops = rows.map((row, index) => {
    const start = cursor;
    const end = cursor + (row.value / total) * 360;
    cursor = end;
    return `${colors[index % colors.length]} ${start}deg ${end}deg`;
  });

  elements.genderDonut.style.background = `conic-gradient(${gradientStops.join(", ")})`;
  elements.genderLegend.innerHTML = rows
    .map(
      (row, index) => `
        <div class="legend-row">
          <span class="swatch" style="background: ${colors[index % colors.length]}"></span>
          <span>${escapeHtml(row.label)}</span>
          <strong>${formatNumber(row.value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderDepartments(rows) {
  const max = Math.max(...rows.map((row) => row.value), 1);

  elements.departments.innerHTML = rows
    .map(
      (row) => `
        <div class="rank-row">
          <span>${escapeHtml(row.label)}</span>
          <span class="rank-track" aria-hidden="true">
            <span class="rank-fill" style="--value: ${(row.value / max) * 100}%"></span>
          </span>
          <strong>${formatNumber(row.value)}</strong>
        </div>
      `
    )
    .join("");
}

function renderRows(rows) {
  if (!rows.length) {
    elements.employeeRows.innerHTML = `<tr><td colspan="5" class="empty-state">No rows returned</td></tr>`;
    return;
  }

  elements.employeeRows.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.id)}</td>
          <td>${escapeHtml(row.name)}</td>
          <td>${escapeHtml(row.gender)}</td>
          <td>${escapeHtml(row.hireDate)}</td>
          <td>${escapeHtml(row.department)}</td>
        </tr>
      `
    )
    .join("");
}

function renderSource(source) {
  const columnSummary = source.columns
    .map((column) => `${column.name} ${column.type}`)
    .join(" | ");
  elements.schemaPill.textContent = `${source.schema}.${source.table}: ${columnSummary}`;
}

function renderDashboard(data) {
  renderMetrics(data.metrics);
  renderBars(elements.hireTrend, data.charts.hireTrend);
  renderDonut(data.charts.gender);
  renderDepartments(data.charts.departments);
  renderRows(data.latestEmployees);
  renderSource(data.source);

  elements.updatedAt.textContent = formatTime(data.generatedAt);
  elements.refreshRate.textContent = `${Math.round(data.refreshMs / 1000)}s`;
  state.lastSequence = data.sequence || state.lastSequence;
  setStatus(`Live${state.lastSequence ? ` #${state.lastSequence}` : ""}`, "live");
}

async function fetchDashboard() {
  const response = await fetch("/api/dashboard", { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Dashboard request failed with ${response.status}`);
  }

  return response.json();
}

function connectStream() {
  const stream = new EventSource("/api/stream");

  stream.addEventListener("open", () => {
    setStatus("Connected", "live");
  });

  stream.addEventListener("dashboard", (event) => {
    renderDashboard(JSON.parse(event.data));
  });

  stream.addEventListener("dashboard-error", (event) => {
    const payload = JSON.parse(event.data);
    setStatus(payload.message || "Query failed", "error");
  });

  stream.addEventListener("error", () => {
    setStatus("Reconnecting", "error");
  });
}

fetchDashboard()
  .then(renderDashboard)
  .then(connectStream)
  .catch((error) => {
    setStatus(error.message, "error");
  });

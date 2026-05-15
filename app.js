const dashboardData = {
  weekEnding: "May 15, 2026",
  ticketsByStatus: [
    { status: "New", count: 18, color: "#2563eb" },
    { status: "In progress", count: 32, color: "#0f766e" },
    { status: "Waiting on customer", count: 14, color: "#b7791f" },
    { status: "Escalated", count: 6, color: "#b42318" },
    { status: "Resolved", count: 108, color: "#15803d" },
  ],
  responseTimeByDay: [
    { day: "Mon", hours: 1.7 },
    { day: "Tue", hours: 1.5 },
    { day: "Wed", hours: 1.9 },
    { day: "Thu", hours: 2.2 },
    { day: "Fri", hours: 1.4 },
    { day: "Sat", hours: 2.8 },
    { day: "Sun", hours: 2.4 },
  ],
  responseTargetHours: 2,
  orderBacklog: [
    { stage: "Pending release", count: 22, color: "#2563eb" },
    { stage: "Picking", count: 34, color: "#0f766e" },
    { stage: "Packing", count: 18, color: "#64748b" },
    { stage: "Ready to ship", count: 27, color: "#15803d" },
    { stage: "Carrier hold", count: 8, color: "#b7791f" },
  ],
  lateOrders: [
    {
      id: "SO-10842",
      account: "Northline Medical",
      stage: "Carrier hold",
      daysLate: 4,
      owner: "M. Chen",
      priority: "High",
    },
    {
      id: "SO-10865",
      account: "Peak Retail Group",
      stage: "Picking",
      daysLate: 3,
      owner: "A. Brooks",
      priority: "High",
    },
    {
      id: "SO-10877",
      account: "Blue Harbor Labs",
      stage: "Packing",
      daysLate: 2,
      owner: "S. Patel",
      priority: "Medium",
    },
    {
      id: "SO-10891",
      account: "Summit Supply",
      stage: "Pending release",
      daysLate: 1,
      owner: "J. Rivera",
      priority: "Medium",
    },
  ],
};

const formatNumber = new Intl.NumberFormat("en-US");

function sumBy(items, key) {
  return items.reduce((total, item) => total + item[key], 0);
}

function average(items, key) {
  return items.reduce((total, item) => total + item[key], 0) / items.length;
}

function renderMetrics(data) {
  const ticketTotal = sumBy(data.ticketsByStatus, "count");
  const activeTickets = data.ticketsByStatus
    .filter((item) => item.status !== "Resolved")
    .reduce((total, item) => total + item.count, 0);
  const avgResponse = average(data.responseTimeByDay, "hours");
  const backlogTotal = sumBy(data.orderBacklog, "count");
  const lateOrderCount = data.lateOrders.length;

  const metrics = [
    {
      label: "Active tickets",
      value: formatNumber.format(activeTickets),
      unit: "open",
      context: `${formatNumber.format(ticketTotal)} total tickets logged this week`,
      tone: "neutral",
    },
    {
      label: "Avg response time",
      value: avgResponse.toFixed(1),
      unit: "hrs",
      context:
        avgResponse <= data.responseTargetHours
          ? "Inside the weekly SLA target"
          : "Above the weekly SLA target",
      tone: avgResponse <= data.responseTargetHours ? "good" : "watch",
    },
    {
      label: "Order backlog",
      value: formatNumber.format(backlogTotal),
      unit: "orders",
      context: "Open orders across fulfillment stages",
      tone: backlogTotal > 100 ? "watch" : "good",
    },
    {
      label: "Late orders",
      value: formatNumber.format(lateOrderCount),
      unit: "orders",
      context: `${Math.max(...data.lateOrders.map((order) => order.daysLate))} days late at highest risk`,
      tone: lateOrderCount > 0 ? "risk" : "good",
    },
  ];

  document.querySelector("#metricGrid").innerHTML = metrics
    .map(
      (metric) => `
        <article class="metric-card ${metric.tone}">
          <h2>${metric.label}</h2>
          <div class="metric-value-row">
            <span class="metric-value">${metric.value}</span>
            <span class="metric-unit">${metric.unit}</span>
          </div>
          <p class="metric-context">${metric.context}</p>
        </article>
      `,
    )
    .join("");
}

function renderTicketStatusChart(data) {
  const maxCount = Math.max(...data.ticketsByStatus.map((item) => item.count));
  const totalTickets = sumBy(data.ticketsByStatus, "count");

  document.querySelector("#ticketTotal").textContent = `${formatNumber.format(totalTickets)} tickets`;
  document.querySelector("#ticketStatusChart").innerHTML = data.ticketsByStatus
    .map((item) => {
      const width = Math.max((item.count / maxCount) * 100, 3);
      return `
        <div class="bar-row">
          <span class="bar-label">${item.status}</span>
          <span class="bar-track" aria-hidden="true">
            <span class="bar-fill" style="width: ${width}%; background: ${item.color};"></span>
          </span>
          <span class="bar-value">${formatNumber.format(item.count)}</span>
        </div>
      `;
    })
    .join("");
}

function renderResponseChart(data) {
  const values = data.responseTimeByDay.map((item) => item.hours);
  const maxValue = Math.max(...values, data.responseTargetHours) + 0.5;
  const width = 560;
  const height = 248;
  const margin = { top: 20, right: 22, bottom: 42, left: 38 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const x = (index) =>
    margin.left + (index / (data.responseTimeByDay.length - 1)) * chartWidth;
  const y = (value) => margin.top + chartHeight - (value / maxValue) * chartHeight;

  const points = data.responseTimeByDay.map((item, index) => `${x(index)},${y(item.hours)}`);
  const areaPoints = [
    `${margin.left},${margin.top + chartHeight}`,
    ...points,
    `${margin.left + chartWidth},${margin.top + chartHeight}`,
  ].join(" ");
  const targetY = y(data.responseTargetHours);

  document.querySelector("#responseChart").innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Average response time by day">
      <line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="#dfe7e8" />
      <line x1="${margin.left}" y1="${targetY}" x2="${margin.left + chartWidth}" y2="${targetY}" stroke="#b42318" stroke-dasharray="6 6" />
      <text x="${margin.left + chartWidth - 74}" y="${targetY - 8}" class="target-label">2.0h target</text>
      <polygon points="${areaPoints}" fill="rgba(15, 118, 110, 0.12)"></polygon>
      <polyline points="${points.join(" ")}" fill="none" stroke="#0f766e" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></polyline>
      ${data.responseTimeByDay
        .map(
          (item, index) => `
            <circle cx="${x(index)}" cy="${y(item.hours)}" r="5" fill="#ffffff" stroke="#0f766e" stroke-width="3"></circle>
            <text x="${x(index)}" y="${height - 14}" text-anchor="middle" class="axis-label">${item.day}</text>
            <text x="${x(index)}" y="${y(item.hours) - 11}" text-anchor="middle" class="data-label">${item.hours.toFixed(1)}</text>
          `,
        )
        .join("")}
    </svg>
  `;
}

function renderBacklogChart(data) {
  const maxCount = Math.max(...data.orderBacklog.map((item) => item.count));
  const backlogTotal = sumBy(data.orderBacklog, "count");

  document.querySelector("#backlogTotal").textContent = `${formatNumber.format(backlogTotal)} open orders`;
  document.querySelector("#backlogChart").innerHTML = data.orderBacklog
    .map((item) => {
      const width = Math.max((item.count / maxCount) * 100, 4);
      return `
        <div class="backlog-row">
          <span class="backlog-stage">${item.stage}</span>
          <span class="backlog-track" aria-hidden="true">
            <span class="backlog-fill" style="width: ${width}%; background: ${item.color};"></span>
          </span>
          <span class="backlog-value">${formatNumber.format(item.count)}</span>
        </div>
      `;
    })
    .join("");
}

function renderLateOrders(data) {
  document.querySelector("#lateOrderTotal").textContent = `${data.lateOrders.length} currently late`;
  document.querySelector("#lateOrdersTable").innerHTML = data.lateOrders
    .map(
      (order) => `
        <tr>
          <td><strong>${order.id}</strong></td>
          <td>${order.account}</td>
          <td>${order.stage} <span class="priority-pill">${order.priority}</span></td>
          <td class="late-days">${order.daysLate}</td>
          <td>${order.owner}</td>
        </tr>
      `,
    )
    .join("");
}

function renderDashboard(data) {
  document.querySelector("#weekEnding").textContent = data.weekEnding;
  renderMetrics(data);
  renderTicketStatusChart(data);
  renderResponseChart(data);
  renderBacklogChart(data);
  renderLateOrders(data);
}

renderDashboard(dashboardData);

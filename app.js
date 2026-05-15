const csv = `date,region,channel,orders,fulfilled_orders,late_orders,revenue,refunds,avg_handle_minutes
2026-04-01,West,Web,118,112,9,15420,420,14.2
2026-04-01,West,Marketplace,92,88,14,10310,390,17.5
2026-04-01,East,Web,136,131,6,18140,280,12.1
2026-04-01,East,Marketplace,84,79,11,9560,510,18.0
2026-04-02,West,Web,124,119,7,16290,310,13.4
2026-04-02,West,Marketplace,97,91,16,10980,460,18.3
2026-04-02,East,Web,142,138,5,18920,250,11.8
2026-04-02,East,Marketplace,90,84,13,10170,540,17.2
2026-04-03,West,Web,131,126,8,17110,360,13.1
2026-04-03,West,Marketplace,101,94,18,11650,620,19.1
2026-04-03,East,Web,149,144,4,19730,220,11.4
2026-04-03,East,Marketplace,94,89,10,10820,410,16.6
2026-04-04,West,Web,127,122,6,16840,330,12.9
2026-04-04,West,Marketplace,108,99,21,12340,710,20.4
2026-04-04,East,Web,153,149,3,20480,190,10.9
2026-04-04,East,Marketplace,99,93,12,11390,480,16.9
2026-04-05,West,Web,135,130,5,17920,270,12.5
2026-04-05,West,Marketplace,112,103,24,13010,760,21.2
2026-04-05,East,Web,158,154,3,21170,180,10.6
2026-04-05,East,Marketplace,103,97,9,11980,390,15.8`;

const colors = {
  teal: "#287d8e",
  tealSoft: "#d9eef2",
  coral: "#d96545",
  green: "#2f855a",
  purple: "#7a5aa6",
  amber: "#c9871d",
  ink: "#1e2933",
  muted: "#66727f",
  line: "#dce3ea"
};

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});
const number = new Intl.NumberFormat("en-US");
const percent = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC"
});

function parseCsv(text) {
  const [headerLine, ...rows] = text.trim().split("\n");
  const headers = headerLine.split(",");
  return rows.map((row) => {
    const values = row.split(",");
    return headers.reduce((record, header, index) => {
      const value = values[index];
      record[header] = Number.isNaN(Number(value)) ? value : Number(value);
      return record;
    }, {});
  });
}

function groupBy(records, key) {
  return records.reduce((groups, record) => {
    const groupKey = typeof key === "function" ? key(record) : record[key];
    if (!groups.has(groupKey)) {
      groups.set(groupKey, []);
    }
    groups.get(groupKey).push(record);
    return groups;
  }, new Map());
}

function sum(records, key) {
  return records.reduce((total, record) => total + record[key], 0);
}

function weightedAverage(records, valueKey, weightKey) {
  const totalWeight = sum(records, weightKey);
  if (!totalWeight) {
    return 0;
  }
  return records.reduce((total, record) => total + record[valueKey] * record[weightKey], 0) / totalWeight;
}

function byDateValue(a, b) {
  return a.date.localeCompare(b.date);
}

function formatDate(date) {
  return shortDate.format(new Date(`${date}T00:00:00Z`));
}

function aggregateRows(records) {
  const daily = Array.from(groupBy(records, "date"), ([date, rows]) => ({
    date,
    orders: sum(rows, "orders"),
    fulfilled_orders: sum(rows, "fulfilled_orders"),
    late_orders: sum(rows, "late_orders"),
    revenue: sum(rows, "revenue"),
    refunds: sum(rows, "refunds"),
    avg_handle_minutes: weightedAverage(rows, "avg_handle_minutes", "orders")
  })).sort(byDateValue);

  const channels = Array.from(groupBy(records, "channel"), ([channel, rows]) => ({
    channel,
    orders: sum(rows, "orders"),
    fulfilled_orders: sum(rows, "fulfilled_orders"),
    fulfillmentRate: sum(rows, "fulfilled_orders") / sum(rows, "orders")
  })).sort((a, b) => b.fulfillmentRate - a.fulfillmentRate);

  const regions = Array.from(groupBy(records, "region"), ([region, rows]) => {
    const channelBreakdown = Array.from(groupBy(rows, "channel"), ([channel, channelRows]) => ({
      channel,
      late_orders: sum(channelRows, "late_orders")
    })).sort((a, b) => a.channel.localeCompare(b.channel));

    return {
      region,
      late_orders: sum(rows, "late_orders"),
      channelBreakdown
    };
  }).sort((a, b) => b.late_orders - a.late_orders);

  const totals = {
    orders: sum(records, "orders"),
    fulfilled_orders: sum(records, "fulfilled_orders"),
    late_orders: sum(records, "late_orders"),
    revenue: sum(records, "revenue"),
    refunds: sum(records, "refunds"),
    avg_handle_minutes: weightedAverage(records, "avg_handle_minutes", "orders")
  };
  totals.fulfillmentRate = totals.fulfilled_orders / totals.orders;
  totals.lateRate = totals.late_orders / totals.orders;
  totals.netRevenue = totals.revenue - totals.refunds;
  totals.refundShare = totals.refunds / totals.revenue;

  return { daily, channels, regions, totals };
}

function svgNode(tag, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function addText(svg, text, attrs) {
  const node = svgNode("text", attrs);
  node.textContent = text;
  svg.appendChild(node);
  return node;
}

function renderSvg(containerId, width, height, draw) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  const svg = svgNode("svg", {
    class: "chart-svg",
    viewBox: `0 0 ${width} ${height}`,
    preserveAspectRatio: "xMidYMid meet",
    role: "presentation"
  });
  draw(svg, width, height);
  container.appendChild(svg);
}

function scaleLinear(value, domainMin, domainMax, rangeMin, rangeMax) {
  if (domainMax === domainMin) {
    return rangeMin;
  }
  return rangeMin + ((value - domainMin) / (domainMax - domainMin)) * (rangeMax - rangeMin);
}

function niceMax(value, step) {
  return Math.ceil(value / step) * step;
}

function drawLegend(svg, items, x, y) {
  items.forEach((item, index) => {
    const itemX = x + index * 132;
    svg.appendChild(svgNode("rect", {
      x: itemX,
      y: y - 10,
      width: 11,
      height: 11,
      rx: 2,
      fill: item.color
    }));
    addText(svg, item.label, {
      x: itemX + 17,
      y,
      class: "legend-label"
    });
  });
}

function renderDailyVolume(daily) {
  renderSvg("daily-volume-chart", 880, 330, (svg, width, height) => {
    const margin = { top: 20, right: 22, bottom: 58, left: 56 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const maxOrders = niceMax(Math.max(...daily.map((row) => row.orders)), 100);
    const barGap = 18;
    const barWidth = (chartWidth - barGap * (daily.length - 1)) / daily.length;

    [0, 0.25, 0.5, 0.75, 1].forEach((step) => {
      const value = maxOrders * step;
      const y = margin.top + chartHeight - chartHeight * step;
      svg.appendChild(svgNode("line", {
        x1: margin.left,
        y1: y,
        x2: width - margin.right,
        y2: y,
        class: "grid-line"
      }));
      addText(svg, number.format(value), {
        x: margin.left - 12,
        y: y + 4,
        "text-anchor": "end",
        class: "tick-label"
      });
    });

    daily.forEach((row, index) => {
      const x = margin.left + index * (barWidth + barGap);
      const barHeight = scaleLinear(row.orders, 0, maxOrders, 0, chartHeight);
      const y = margin.top + chartHeight - barHeight;
      svg.appendChild(svgNode("rect", {
        x,
        y,
        width: barWidth,
        height: barHeight,
        rx: 5,
        fill: index === daily.length - 1 ? colors.coral : colors.teal
      }));
      addText(svg, number.format(row.orders), {
        x: x + barWidth / 2,
        y: y - 8,
        "text-anchor": "middle",
        class: "value-label"
      });
      addText(svg, formatDate(row.date), {
        x: x + barWidth / 2,
        y: margin.top + chartHeight + 28,
        "text-anchor": "middle",
        class: "axis-label"
      });
    });

    svg.appendChild(svgNode("line", {
      x1: margin.left,
      y1: margin.top + chartHeight,
      x2: width - margin.right,
      y2: margin.top + chartHeight,
      class: "axis-line"
    }));
  });
}

function renderFulfillmentRate(channels, overallRate) {
  renderSvg("fulfillment-chart", 540, 260, (svg, width) => {
    const margin = { top: 34, right: 54, bottom: 42, left: 128 };
    const chartWidth = width - margin.left - margin.right;
    const rowHeight = 54;

    [0, 0.5, 1].forEach((step) => {
      const x = margin.left + chartWidth * step;
      svg.appendChild(svgNode("line", {
        x1: x,
        y1: 20,
        x2: x,
        y2: 172,
        class: "grid-line"
      }));
      addText(svg, percent.format(step), {
        x,
        y: 214,
        "text-anchor": "middle",
        class: "tick-label"
      });
    });

    const overallX = margin.left + chartWidth * overallRate;
    svg.appendChild(svgNode("line", {
      x1: overallX,
      y1: 20,
      x2: overallX,
      y2: 172,
      stroke: colors.coral,
      "stroke-width": 2,
      "stroke-dasharray": "5 5"
    }));
    addText(svg, "Overall", {
      x: overallX,
      y: 190,
      "text-anchor": "middle",
      fill: colors.coral,
      "font-size": 12,
      "font-weight": 800
    });

    channels.forEach((row, index) => {
      const y = margin.top + index * rowHeight;
      const barWidth = chartWidth * row.fulfillmentRate;
      addText(svg, row.channel, {
        x: margin.left - 14,
        y: y + 22,
        "text-anchor": "end",
        class: "axis-label"
      });
      svg.appendChild(svgNode("rect", {
        x: margin.left,
        y,
        width: chartWidth,
        height: 26,
        rx: 5,
        fill: colors.tealSoft
      }));
      svg.appendChild(svgNode("rect", {
        x: margin.left,
        y,
        width: barWidth,
        height: 26,
        rx: 5,
        fill: index === 0 ? colors.green : colors.purple
      }));
      addText(svg, percent.format(row.fulfillmentRate), {
        x: margin.left + barWidth + 8,
        y: y + 19,
        class: "value-label"
      });
    });
  });
}

function renderLateOrdersByRegion(regions) {
  renderSvg("late-region-chart", 540, 260, (svg, width) => {
    const margin = { top: 36, right: 62, bottom: 54, left: 78 };
    const chartWidth = width - margin.left - margin.right;
    const rowHeight = 62;
    const maxLate = niceMax(Math.max(...regions.map((row) => row.late_orders)), 25);
    const channelColors = {
      Marketplace: colors.coral,
      Web: colors.teal
    };

    [0, 0.5, 1].forEach((step) => {
      const x = margin.left + chartWidth * step;
      svg.appendChild(svgNode("line", {
        x1: x,
        y1: 26,
        x2: x,
        y2: 164,
        class: "grid-line"
      }));
      addText(svg, number.format(maxLate * step), {
        x,
        y: 206,
        "text-anchor": "middle",
        class: "tick-label"
      });
    });

    regions.forEach((region, index) => {
      const y = margin.top + index * rowHeight;
      let x = margin.left;
      addText(svg, region.region, {
        x: margin.left - 14,
        y: y + 24,
        "text-anchor": "end",
        class: "axis-label"
      });
      region.channelBreakdown.forEach((item) => {
        const segmentWidth = scaleLinear(item.late_orders, 0, maxLate, 0, chartWidth);
        svg.appendChild(svgNode("rect", {
          x,
          y,
          width: segmentWidth,
          height: 30,
          rx: 5,
          fill: channelColors[item.channel]
        }));
        if (segmentWidth > 40) {
          addText(svg, number.format(item.late_orders), {
            x: x + segmentWidth / 2,
            y: y + 20,
            "text-anchor": "middle",
            fill: "#ffffff",
            "font-size": 12,
            "font-weight": 800
          });
        }
        x += segmentWidth;
      });
      addText(svg, number.format(region.late_orders), {
        x: margin.left + scaleLinear(region.late_orders, 0, maxLate, 0, chartWidth) + 10,
        y: y + 21,
        class: "value-label"
      });
    });

    drawLegend(svg, [
      { label: "Marketplace", color: channelColors.Marketplace },
      { label: "Web", color: channelColors.Web }
    ], margin.left, 238);
  });
}

function renderMoneyChart(daily) {
  renderSvg("money-chart", 880, 340, (svg, width, height) => {
    const margin = { top: 20, right: 76, bottom: 62, left: 68 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    const maxRevenue = niceMax(Math.max(...daily.map((row) => row.revenue)), 10000);
    const maxRefunds = niceMax(Math.max(...daily.map((row) => row.refunds)), 500);
    const barGap = 22;
    const barWidth = (chartWidth - barGap * (daily.length - 1)) / daily.length;
    const refundPoints = [];

    [0, 0.25, 0.5, 0.75, 1].forEach((step) => {
      const y = margin.top + chartHeight - chartHeight * step;
      svg.appendChild(svgNode("line", {
        x1: margin.left,
        y1: y,
        x2: width - margin.right,
        y2: y,
        class: "grid-line"
      }));
      addText(svg, currency.format(maxRevenue * step), {
        x: margin.left - 12,
        y: y + 4,
        "text-anchor": "end",
        class: "tick-label"
      });
      addText(svg, currency.format(maxRefunds * step), {
        x: width - margin.right + 12,
        y: y + 4,
        class: "tick-label"
      });
    });

    daily.forEach((row, index) => {
      const x = margin.left + index * (barWidth + barGap);
      const revenueHeight = scaleLinear(row.revenue, 0, maxRevenue, 0, chartHeight);
      const revenueY = margin.top + chartHeight - revenueHeight;
      const refundY = margin.top + chartHeight - scaleLinear(row.refunds, 0, maxRefunds, 0, chartHeight);
      const pointX = x + barWidth / 2;
      refundPoints.push(`${pointX},${refundY}`);

      svg.appendChild(svgNode("rect", {
        x,
        y: revenueY,
        width: barWidth,
        height: revenueHeight,
        rx: 5,
        fill: colors.teal
      }));
      addText(svg, currency.format(row.revenue), {
        x: pointX,
        y: revenueY + 40,
        "text-anchor": "middle",
        fill: "#ffffff",
        "font-size": 12,
        "font-weight": 800
      });
      addText(svg, formatDate(row.date), {
        x: pointX,
        y: margin.top + chartHeight + 28,
        "text-anchor": "middle",
        class: "axis-label"
      });
    });

    svg.appendChild(svgNode("polyline", {
      points: refundPoints.join(" "),
      fill: "none",
      stroke: colors.coral,
      "stroke-width": 3,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
    }));

    daily.forEach((row, index) => {
      const x = margin.left + index * (barWidth + barGap) + barWidth / 2;
      const y = margin.top + chartHeight - scaleLinear(row.refunds, 0, maxRefunds, 0, chartHeight);
      svg.appendChild(svgNode("circle", {
        cx: x,
        cy: y,
        r: 5,
        fill: colors.coral,
        stroke: "#ffffff",
        "stroke-width": 2
      }));
      addText(svg, currency.format(row.refunds), {
        x,
        y: y - 12,
        "text-anchor": "middle",
        fill: colors.coral,
        "font-size": 12,
        "font-weight": 800
      });
    });

    svg.appendChild(svgNode("line", {
      x1: margin.left,
      y1: margin.top + chartHeight,
      x2: width - margin.right,
      y2: margin.top + chartHeight,
      class: "axis-line"
    }));

    drawLegend(svg, [
      { label: "Revenue", color: colors.teal },
      { label: "Refunds", color: colors.coral }
    ], margin.left, 326);
  });
}

function renderDailyTable(daily) {
  const table = document.getElementById("daily-table");
  table.innerHTML = "";
  daily.forEach((row) => {
    const tr = document.createElement("tr");
    [
      formatDate(row.date),
      number.format(row.orders),
      number.format(row.fulfilled_orders),
      number.format(row.late_orders),
      currency.format(row.revenue),
      currency.format(row.refunds)
    ].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
}

function renderMetrics(data) {
  const { daily, channels, regions, totals } = data;
  const bestOrderDay = daily.reduce((best, row) => (row.orders > best.orders ? row : best), daily[0]);
  const peakRefundDay = daily.reduce((peak, row) => (row.refunds > peak.refunds ? row : peak), daily[0]);
  const marketplaceLate = regions.reduce((total, region) => {
    const market = region.channelBreakdown.find((item) => item.channel === "Marketplace");
    return total + (market ? market.late_orders : 0);
  }, 0);
  const lowestFulfillmentChannel = [...channels].sort((a, b) => a.fulfillmentRate - b.fulfillmentRate)[0];
  const highestLateRegion = regions[0];

  document.getElementById("total-orders").textContent = number.format(totals.orders);
  document.getElementById("fulfillment-rate").textContent = percent.format(totals.fulfillmentRate);
  document.getElementById("fulfilled-orders").textContent = `${number.format(totals.fulfilled_orders)} orders fulfilled`;
  document.getElementById("late-orders").textContent = number.format(totals.late_orders);
  document.getElementById("late-rate").textContent = `${percent.format(totals.lateRate)} of all orders`;
  document.getElementById("net-revenue").textContent = currency.format(totals.netRevenue);
  document.getElementById("refund-share").textContent = `${percent.format(totals.refundShare)} of revenue refunded`;
  document.getElementById("best-order-day").textContent = `${formatDate(bestOrderDay.date)} was highest at ${number.format(bestOrderDay.orders)} orders`;
  document.getElementById("refund-peak").textContent = `${formatDate(peakRefundDay.date)} had the most refunds`;
  document.getElementById("avg-handle").textContent = `${totals.avg_handle_minutes.toFixed(1)} min avg handle time`;

  const insights = [
    `Orders rose every day, reaching ${number.format(bestOrderDay.orders)} on ${formatDate(bestOrderDay.date)}.`,
    `${highestLateRegion.region} had ${number.format(highestLateRegion.late_orders)} late orders, the highest regional total.`,
    `${lowestFulfillmentChannel.channel} fulfilled ${percent.format(lowestFulfillmentChannel.fulfillmentRate)} of orders, and Marketplace made up ${percent.format(marketplaceLate / totals.late_orders)} of late orders.`
  ];

  const list = document.getElementById("insight-list");
  list.innerHTML = "";
  insights.forEach((insight) => {
    const li = document.createElement("li");
    li.textContent = insight;
    list.appendChild(li);
  });
}

function renderDashboard() {
  const records = parseCsv(csv);
  const data = aggregateRows(records);
  renderMetrics(data);
  renderDailyVolume(data.daily);
  renderFulfillmentRate(data.channels, data.totals.fulfillmentRate);
  renderLateOrdersByRegion(data.regions);
  renderMoneyChart(data.daily);
  renderDailyTable(data.daily);
}

renderDashboard();

const metrics = [
  {
    label: "Pipeline value",
    value: "$3.8M",
    detail: "+14% vs. demo target",
  },
  {
    label: "Closed revenue",
    value: "$910K",
    detail: "68 sample deals won",
  },
  {
    label: "Avg. sales cycle",
    value: "31d",
    detail: "5 days faster than sample baseline",
  },
  {
    label: "Forecast confidence",
    value: "82%",
    detail: "Weighted demo forecast",
  },
];

const funnel = [
  { stage: "Qualified", value: 86, amount: "$3.8M" },
  { stage: "Proposal", value: 64, amount: "$2.4M" },
  { stage: "Negotiation", value: 42, amount: "$1.3M" },
  { stage: "Commit", value: 27, amount: "$740K" },
];

const regions = [
  { name: "West", revenue: "$340K", attainment: 91 },
  { name: "Northeast", revenue: "$265K", attainment: 84 },
  { name: "Central", revenue: "$188K", attainment: 72 },
  { name: "South", revenue: "$117K", attainment: 63 },
];

const leaderboard = [
  { rep: "Avery Chen", segment: "Enterprise", revenue: "$215K", deals: 12 },
  { rep: "Maya Patel", segment: "Mid-market", revenue: "$184K", deals: 18 },
  { rep: "Jordan Lee", segment: "Commercial", revenue: "$162K", deals: 22 },
  { rep: "Sam Rivera", segment: "Strategic", revenue: "$149K", deals: 9 },
];

const trend = [42, 58, 51, 73, 69, 87, 94, 103];

export default function Home() {
  return (
    <main className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Sales analytics demo</p>
          <h1>Revenue performance workspace</h1>
          <p className="summary">
            A demo page for sales leaders to review pipeline health, regional
            attainment, and rep activity using clearly labeled sample data.
          </p>
        </div>
        <div className="data-banner" aria-label="Sample data notice">
          <strong>Sample data</strong>
          <span>Not current records</span>
        </div>
      </section>

      <section className="metric-grid" aria-label="Sample sales metrics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <span className="sample-chip">Sample data</span>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <small>{metric.detail}</small>
          </article>
        ))}
      </section>

      <section className="analytics-grid">
        <article className="panel panel-large">
          <div className="panel-header">
            <div>
              <p className="section-label">Pipeline funnel</p>
              <h2>Opportunity progression</h2>
            </div>
            <span className="sample-chip">Sample data</span>
          </div>
          <div className="funnel-list">
            {funnel.map((item) => (
              <div className="funnel-row" key={item.stage}>
                <div className="funnel-meta">
                  <strong>{item.stage}</strong>
                  <span>{item.amount}</span>
                </div>
                <div className="track" aria-hidden="true">
                  <span style={{ width: `${item.value}%` }} />
                </div>
                <b>{item.value}%</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Revenue trend</p>
              <h2>Quarter pace</h2>
            </div>
            <span className="sample-chip">Sample data</span>
          </div>
          <div className="bar-chart" aria-label="Sample weekly revenue trend">
            {trend.map((height, index) => (
              <span
                key={`${height}-${index}`}
                style={{ height: `${height}%` }}
                title={`Sample week ${index + 1}`}
              />
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <div>
              <p className="section-label">Regional attainment</p>
              <h2>Team coverage</h2>
            </div>
            <span className="sample-chip">Sample data</span>
          </div>
          <div className="region-list">
            {regions.map((region) => (
              <div className="region-row" key={region.name}>
                <div>
                  <strong>{region.name}</strong>
                  <span>{region.revenue}</span>
                </div>
                <meter min="0" max="100" value={region.attainment}>
                  {region.attainment}%
                </meter>
                <b>{region.attainment}%</b>
              </div>
            ))}
          </div>
        </article>

        <article className="panel panel-large">
          <div className="panel-header">
            <div>
              <p className="section-label">Rep leaderboard</p>
              <h2>Top sample contributors</h2>
            </div>
            <span className="sample-chip">Sample data</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Rep</th>
                  <th>Segment</th>
                  <th>Revenue</th>
                  <th>Deals</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr key={row.rep}>
                    <td>{row.rep}</td>
                    <td>{row.segment}</td>
                    <td>{row.revenue}</td>
                    <td>{row.deals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}

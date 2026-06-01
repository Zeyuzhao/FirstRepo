const metrics = [
  { label: "Sample pipeline", value: "$4.8M", delta: "+12%", tone: "green" },
  { label: "Sample win rate", value: "34%", delta: "+4 pts", tone: "blue" },
  { label: "Sample sales cycle", value: "41 days", delta: "-6 days", tone: "amber" },
  { label: "Sample quota coverage", value: "118%", delta: "+9%", tone: "green" },
];

const pipeline = [
  { stage: "Prospecting", value: "$1.2M", percent: 25 },
  { stage: "Qualified", value: "$1.6M", percent: 33 },
  { stage: "Proposal", value: "$1.1M", percent: 23 },
  { stage: "Negotiation", value: "$0.9M", percent: 19 },
];

const regions = [
  { name: "West", deals: 46, share: 38 },
  { name: "Northeast", deals: 31, share: 26 },
  { name: "Central", deals: 24, share: 20 },
  { name: "Southeast", deals: 19, share: 16 },
];

const deals = [
  { account: "Acme Growth Co.", owner: "M. Chen", stage: "Proposal", value: "$420K" },
  { account: "Northstar Retail", owner: "A. Singh", stage: "Negotiation", value: "$385K" },
  { account: "Harbor Health", owner: "J. Rivera", stage: "Qualified", value: "$260K" },
  { account: "Brightline Labs", owner: "T. Okafor", stage: "Proposal", value: "$215K" },
];

export default function Home() {
  return (
    <main className="dashboard">
      <section className="hero" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Sales analytics demo</p>
          <h1 id="dashboard-title">Revenue workspace for the sales team</h1>
          <p className="summary">
            Sample data dashboard for reviewing pipeline health, regional coverage,
            and priority opportunities before weekly sales standup.
          </p>
        </div>
        <div className="data-badge" aria-label="Data provenance">
          <span>Sample data</span>
          <strong>Not current records</strong>
        </div>
      </section>

      <section className="metric-grid" aria-label="Sample sales metrics">
        {metrics.map((metric) => (
          <article className="metric-card" key={metric.label}>
            <p>{metric.label}</p>
            <div>
              <strong>{metric.value}</strong>
              <span className={`delta ${metric.tone}`}>{metric.delta}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Sample data</p>
              <h2>Pipeline by stage</h2>
            </div>
            <span>$4.8M total</span>
          </div>
          <div className="bar-list">
            {pipeline.map((stage) => (
              <div className="bar-row" key={stage.stage}>
                <div className="bar-copy">
                  <span>{stage.stage}</span>
                  <strong>{stage.value}</strong>
                </div>
                <div className="bar-track" aria-hidden="true">
                  <div style={{ width: `${stage.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel region-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Sample data</p>
              <h2>Regional deal mix</h2>
            </div>
          </div>
          <div className="region-list">
            {regions.map((region) => (
              <div className="region-row" key={region.name}>
                <span>{region.name}</span>
                <div className="region-meter" aria-hidden="true">
                  <div style={{ width: `${region.share}%` }} />
                </div>
                <strong>{region.deals}</strong>
              </div>
            ))}
          </div>
        </article>

        <article className="panel deals-panel">
          <div className="panel-heading">
            <div>
              <p className="section-label">Sample data</p>
              <h2>Priority opportunities</h2>
            </div>
          </div>
          <div className="table" role="table" aria-label="Sample priority opportunities">
            <div className="table-row table-head" role="row">
              <span role="columnheader">Account</span>
              <span role="columnheader">Owner</span>
              <span role="columnheader">Stage</span>
              <span role="columnheader">Value</span>
            </div>
            {deals.map((deal) => (
              <div className="table-row" role="row" key={deal.account}>
                <span role="cell">{deal.account}</span>
                <span role="cell">{deal.owner}</span>
                <span role="cell">{deal.stage}</span>
                <strong role="cell">{deal.value}</strong>
              </div>
            ))}
          </div>
        </article>

        <aside className="panel activity-panel" aria-label="Sample sales activity">
          <p className="section-label">Sample data</p>
          <h2>Standup focus</h2>
          <ul>
            <li>
              <strong>3 proposal follow-ups</strong>
              <span>Draft next steps for high-fit enterprise accounts.</span>
            </li>
            <li>
              <strong>2 renewal risks</strong>
              <span>Review support escalations before outreach.</span>
            </li>
            <li>
              <strong>5 expansion signals</strong>
              <span>Coordinate discovery with account management.</span>
            </li>
          </ul>
        </aside>
      </section>
    </main>
  );
}

const kpis = [
  { label: "Sample revenue", value: "$482K", change: "+12.4%" },
  { label: "Sample pipeline", value: "$1.8M", change: "+8.1%" },
  { label: "Sample win rate", value: "31.6%", change: "+2.7 pts" },
  { label: "Sample sales cycle", value: "42 days", change: "-5 days" },
];

const pipeline = [
  { stage: "Qualified", amount: "$690K", percent: 84 },
  { stage: "Proposal", amount: "$510K", percent: 62 },
  { stage: "Negotiation", amount: "$365K", percent: 45 },
  { stage: "Commit", amount: "$235K", percent: 29 },
];

const regions = [
  { name: "North America", revenue: "$214K", share: 44, color: "#2563eb" },
  { name: "EMEA", revenue: "$146K", share: 30, color: "#0f766e" },
  { name: "APAC", revenue: "$83K", share: 17, color: "#c2410c" },
  { name: "LATAM", revenue: "$39K", share: 9, color: "#7c3aed" },
];

const reps = [
  { name: "Avery Chen", segment: "Enterprise", revenue: "$118K", close: "38%" },
  { name: "Maya Patel", segment: "Mid-market", revenue: "$96K", close: "34%" },
  { name: "Jon Bell", segment: "Commercial", revenue: "$74K", close: "29%" },
  { name: "Nina Ortiz", segment: "Expansion", revenue: "$61K", close: "41%" },
];

export default function Home() {
  return (
    <main className="dashboard">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sales Analytics</p>
          <h1>Demo sales performance</h1>
        </div>
        <div className="sampleBadge">Sample data</div>
      </header>

      <section className="notice" aria-label="Data provenance">
        <strong>Sample data only.</strong> These demo metrics are synthetic and
        are not current records.
      </section>

      <section className="kpiGrid" aria-label="Sample key performance indicators">
        {kpis.map((kpi) => (
          <article className="card kpiCard" key={kpi.label}>
            <p>{kpi.label}</p>
            <div className="metricRow">
              <strong>{kpi.value}</strong>
              <span>{kpi.change}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="contentGrid">
        <article className="card panel">
          <div className="panelHeader">
            <div>
              <h2>Sample pipeline by stage</h2>
              <p>Weighted opportunity value</p>
            </div>
            <span className="smallBadge">Sample data</span>
          </div>
          <div className="stageList">
            {pipeline.map((item) => (
              <div className="stage" key={item.stage}>
                <div className="stageLabel">
                  <span>{item.stage}</span>
                  <strong>{item.amount}</strong>
                </div>
                <div className="barTrack" aria-hidden="true">
                  <div className="barFill" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="card panel">
          <div className="panelHeader">
            <div>
              <h2>Sample regional mix</h2>
              <p>Booked revenue share</p>
            </div>
            <span className="smallBadge">Sample data</span>
          </div>
          <div className="regionList">
            {regions.map((region) => (
              <div className="region" key={region.name}>
                <span className="swatch" style={{ background: region.color }} />
                <div>
                  <strong>{region.name}</strong>
                  <p>{region.revenue}</p>
                </div>
                <span>{region.share}%</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="card tablePanel">
        <div className="panelHeader">
          <div>
            <h2>Sample rep leaderboard</h2>
            <p>Demo revenue and close rate by seller</p>
          </div>
          <span className="smallBadge">Sample data</span>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Rep</th>
                <th>Segment</th>
                <th>Sample revenue</th>
                <th>Sample close rate</th>
              </tr>
            </thead>
            <tbody>
              {reps.map((rep) => (
                <tr key={rep.name}>
                  <td>{rep.name}</td>
                  <td>{rep.segment}</td>
                  <td>{rep.revenue}</td>
                  <td>{rep.close}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

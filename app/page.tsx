export default function Home() {
  const metrics = [
    { label: "Revenue", value: "$128.4K", change: "+12.8%" },
    { label: "Active customers", value: "2,418", change: "+6.1%" },
    { label: "Conversion rate", value: "8.7%", change: "+1.4%" },
    { label: "Open tasks", value: "34", change: "-9.3%" },
  ];

  const pipeline = [
    { stage: "Qualified", value: "$42K", width: "78%" },
    { stage: "Proposal", value: "$31K", width: "58%" },
    { stage: "Negotiation", value: "$19K", width: "36%" },
  ];

  const activity = [
    "Enterprise renewal moved to negotiation",
    "Customer health review queued for West region",
    "Marketing campaign reached target response rate",
  ];

  return (
    <main className="dashboard">
      <section className="hero">
        <div>
          <p className="eyebrow">Mock data</p>
          <h1>Operations Dashboard</h1>
          <p className="summary">
            A focused view of revenue, customer momentum, pipeline health, and
            team follow-up priorities.
          </p>
        </div>
        <span className="status">Sample data, not current records</span>
      </section>

      <section className="metricGrid" aria-label="Dashboard metrics">
        {metrics.map((metric) => (
          <article className="metric" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
            <span>{metric.change}</span>
          </article>
        ))}
      </section>

      <section className="contentGrid">
        <article className="panel">
          <div className="panelHeader">
            <h2>Pipeline</h2>
            <span>Mock data</span>
          </div>
          <div className="pipelineList">
            {pipeline.map((item) => (
              <div className="pipelineItem" key={item.stage}>
                <div>
                  <span>{item.stage}</span>
                  <strong>{item.value}</strong>
                </div>
                <div className="track" aria-hidden="true">
                  <span style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panelHeader">
            <h2>Activity</h2>
            <span>Mock data</span>
          </div>
          <ul className="activityList">
            {activity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}

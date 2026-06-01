export default function Home() {
  const queues = [
    { label: "Urgent SLA risk", value: "18", detail: "+5 since 9:00", tone: "critical" },
    { label: "Waiting on customer", value: "42", detail: "31% of open queue", tone: "steady" },
    { label: "Needs manager review", value: "7", detail: "2 escalations", tone: "warn" },
    { label: "Resolved today", value: "96", detail: "84% first response met", tone: "good" },
  ];

  const focusItems = [
    ["Enterprise escalations", "4 high-value accounts need a decision owner."],
    ["Coverage gap", "Billing queue has the longest median wait."],
    ["Coaching signal", "Authentication macros have repeated low CSAT notes."],
  ];

  const teams = [
    { name: "Billing", load: "86%", status: "Heavy" },
    { name: "Technical", load: "71%", status: "Stable" },
    { name: "Onboarding", load: "58%", status: "Clear" },
  ];

  return (
    <main className="page">
      <section className="dashboard" aria-labelledby="page-title">
        <header className="hero">
          <div>
            <p className="eyebrow">Support command center</p>
            <h1 id="page-title">Queue health at a glance</h1>
          </div>
          <div className="data-label">Sample data</div>
        </header>

        <section className="metric-grid" aria-label="Support queue summary">
          {queues.map((item) => (
            <article className={`metric metric-${item.tone}`} key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
              <span>{item.detail}</span>
            </article>
          ))}
        </section>

        <section className="workbench" aria-label="Manager focus areas">
          <div className="panel priority-panel">
            <div className="panel-heading">
              <p className="eyebrow">Next actions</p>
              <h2>Focus list</h2>
            </div>
            <div className="focus-list">
              {focusItems.map(([title, detail]) => (
                <article className="focus-item" key={title}>
                  <span aria-hidden="true" />
                  <div>
                    <h3>{title}</h3>
                    <p>{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-heading">
              <p className="eyebrow">Team load</p>
              <h2>Coverage</h2>
            </div>
            <div className="team-list">
              {teams.map((team) => (
                <div className="team-row" key={team.name}>
                  <div>
                    <strong>{team.name}</strong>
                    <span>{team.status}</span>
                  </div>
                  <div className="load-bar" aria-label={`${team.name} load ${team.load}`}>
                    <span style={{ width: team.load }} />
                  </div>
                  <b>{team.load}</b>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

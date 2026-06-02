const accounts = [
  {
    name: "Acme Logistics",
    owner: "Maya Chen",
    renewal: "Jun 18",
    arr: "$248K",
    risk: "High",
    riskScore: 86,
    drivers: ["Executive sponsor left", "Usage down 31%", "Open billing dispute"],
    nextStep: "Confirm new sponsor and align success plan",
  },
  {
    name: "Northstar Health",
    owner: "Drew Patel",
    renewal: "Jul 02",
    arr: "$182K",
    risk: "High",
    riskScore: 79,
    drivers: ["Low admin activity", "Delayed security review"],
    nextStep: "Escalate security timeline with procurement",
  },
  {
    name: "Summit Retail",
    owner: "Jordan Lee",
    renewal: "Jul 21",
    arr: "$96K",
    risk: "Medium",
    riskScore: 58,
    drivers: ["Expansion paused", "Champion unresponsive"],
    nextStep: "Book value review with regional VP",
  },
  {
    name: "Brightway Energy",
    owner: "Sam Rivera",
    renewal: "Aug 05",
    arr: "$141K",
    risk: "Medium",
    riskScore: 47,
    drivers: ["Support backlog", "Feature adoption uneven"],
    nextStep: "Send adoption plan and close support items",
  },
];

const signals = [
  { label: "Renewals in 60 days", value: "24", detail: "7 need manager review" },
  { label: "At-risk ARR", value: "$667K", detail: "High and medium risk queue" },
  { label: "No next step", value: "5", detail: "Needs an owner action today" },
  { label: "Avg health score", value: "71", detail: "Down 4 pts this month" },
];

const playbook = [
  "Validate sponsor and decision process",
  "Confirm procurement and legal blockers",
  "Review product usage trend with champion",
  "Log next customer-facing action",
];

function RiskPill({ risk }: { risk: string }) {
  return <span className={`riskPill ${risk.toLowerCase()}`}>{risk}</span>;
}

export default function Home() {
  return (
    <main className="dashboard">
      <section className="hero" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">Renewal risk review</p>
          <h1 id="dashboard-title">Account manager dashboard</h1>
          <p className="summary">
            A focused workspace for scanning upcoming renewals, spotting risk
            drivers, and deciding the next customer action.
          </p>
        </div>
        <div className="dataBadge" aria-label="Data provenance">
          <strong>Sample data</strong>
          <span>Not current customer records</span>
        </div>
      </section>

      <section className="metricGrid" aria-label="Renewal risk summary">
        {signals.map((signal) => (
          <article className="metricCard" key={signal.label}>
            <span>{signal.label}</span>
            <strong>{signal.value}</strong>
            <p>{signal.detail}</p>
          </article>
        ))}
      </section>

      <section className="workspace">
        <div className="panel queuePanel">
          <div className="panelHeader">
            <div>
              <p className="eyebrow compact">Priority queue</p>
              <h2>Renewals needing review</h2>
            </div>
            <button type="button" className="iconButton" aria-label="Filter queue">
              Filter
            </button>
          </div>

          <div className="accountList">
            {accounts.map((account) => (
              <article className="accountRow" key={account.name}>
                <div className="accountMain">
                  <div>
                    <h3>{account.name}</h3>
                    <p>
                      {account.owner} · renews {account.renewal} · {account.arr}
                    </p>
                  </div>
                  <RiskPill risk={account.risk} />
                </div>

                <div className="scoreLine">
                  <span>Risk score</span>
                  <div className="scoreTrack" aria-hidden="true">
                    <span style={{ width: `${account.riskScore}%` }} />
                  </div>
                  <strong>{account.riskScore}</strong>
                </div>

                <ul className="driverList" aria-label={`${account.name} risk drivers`}>
                  {account.drivers.map((driver) => (
                    <li key={driver}>{driver}</li>
                  ))}
                </ul>

                <div className="nextStep">
                  <span>Next action</span>
                  <p>{account.nextStep}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="sideRail" aria-label="Review tools">
          <section className="panel">
            <p className="eyebrow compact">Today</p>
            <h2>Review focus</h2>
            <div className="focusMeter" aria-label="High risk accounts reviewed">
              <strong>63%</strong>
              <span>High-risk accounts reviewed</span>
            </div>
            <button type="button" className="primaryAction">
              Start next review
            </button>
          </section>

          <section className="panel">
            <p className="eyebrow compact">Checklist</p>
            <h2>Manager playbook</h2>
            <ul className="checkList">
              {playbook.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}

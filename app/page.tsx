export default function Home() {
  const priorities = [
    {
      label: "Critical path",
      title: "Route coverage review",
      detail: "Confirm staffing for the highest-risk operating windows.",
      status: "Needs decision",
    },
    {
      label: "Exceptions",
      title: "Delayed handoffs",
      detail: "Triage blockers before they roll into the afternoon queue.",
      status: "Active",
    },
    {
      label: "Readiness",
      title: "Inventory checks",
      detail: "Validate supplies before the next shift change.",
      status: "On track",
    },
  ];

  const lanes = [
    "Today",
    "At risk",
    "Waiting",
    "Done",
  ];

  return (
    <main className="page">
      <section className="shell" aria-labelledby="page-title">
        <header className="hero">
          <div>
            <p className="eyebrow">Operations Command Center</p>
            <h1 id="page-title">Scan the day, spot blockers, move work forward.</h1>
          </div>
          <div className="date-panel" aria-label="Operating day">
            <span>Operating day</span>
            <strong>Today</strong>
          </div>
        </header>

        <section className="status-strip" aria-label="Operational scan">
          {lanes.map((lane) => (
            <div className="status-cell" key={lane}>
              <span>{lane}</span>
              <strong>Review</strong>
            </div>
          ))}
        </section>

        <section className="content-grid" aria-label="Priority work">
          <div className="panel wide-panel">
            <div className="panel-heading">
              <p className="eyebrow">Priority Queue</p>
              <h2>What needs attention first</h2>
            </div>
            <div className="priority-list">
              {priorities.map((item) => (
                <article className="priority-item" key={item.title}>
                  <div>
                    <span className="item-label">{item.label}</span>
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </div>
                  <span className="badge">{item.status}</span>
                </article>
              ))}
            </div>
          </div>

          <aside className="panel compact-panel" aria-label="Manager focus">
            <p className="eyebrow">Manager Focus</p>
            <h2>Run the floor from exceptions</h2>
            <p>
              The homepage now leads with risk, ownership, and work state so an
              operations manager can scan without reading a welcome message.
            </p>
            <div className="focus-list">
              <span>Decision points</span>
              <span>Blocked handoffs</span>
              <span>Shift readiness</span>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

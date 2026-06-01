const metrics = [
  {
    value: "12 min",
    label: "Time to first useful view",
    context: "How quickly a new workspace reaches a report worth sharing.",
    signal: "Fast setup",
  },
  {
    value: "84%",
    label: "Trial teams with a saved workflow",
    context: "Shows whether evaluators are finding a repeatable path.",
    signal: "Adoption",
  },
  {
    value: "4.8x",
    label: "More issues reviewed per session",
    context: "Compares focused review sessions against manual triage.",
    signal: "Efficiency",
  },
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="homepage-title">
        <div className="hero-copy">
          <p className="eyebrow">Trial overview</p>
          <h1 id="homepage-title">See what is working before the trial ends.</h1>
          <p className="summary">
            A clearer homepage metrics section helps new users understand the
            first signs of setup progress, adoption, and team efficiency.
          </p>
        </div>

        <section className="metrics-panel" aria-labelledby="metrics-title">
          <div className="metrics-header">
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="metrics-title">Key trial signals</h2>
            </div>
            <span className="data-badge">Sample data</span>
          </div>

          <div className="metrics-grid">
            {metrics.map((metric) => (
              <article className="metric-card" key={metric.label}>
                <div className="metric-topline">
                  <span className="metric-signal">{metric.signal}</span>
                  <strong>{metric.value}</strong>
                </div>
                <h3>{metric.label}</h3>
                <p>{metric.context}</p>
              </article>
            ))}
          </div>

          <p className="metrics-note">
            Use these metrics to decide whether a trial user needs help with
            setup, workflow design, or value proof.
          </p>
        </section>
      </section>
    </main>
  );
}

export default function Home() {
  const benefits = [
    "Launch customer workflows faster",
    "Keep teams aligned from day one",
    "Scale without rewriting the basics",
  ];

  const features = [
    {
      title: "Fast setup",
      copy: "Start with clean defaults, clear structure, and room to adapt as the product grows.",
    },
    {
      title: "Customer-ready UX",
      copy: "Prominent calls to action, short sections, and direct copy help visitors understand the value quickly.",
    },
    {
      title: "Built for iteration",
      copy: "A focused foundation makes future content, integrations, and product pages easier to add.",
    },
  ];

  return (
    <main className="page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">FirstRepo platform</p>
          <h1 id="hero-title">A clearer starting point for customer workflows.</h1>
          <p className="summary">
            FirstRepo gives new customers a concise path from first visit to first
            action, with the essentials surfaced up front.
          </p>
          <div className="actions" aria-label="Primary actions">
            <a className="button primary" href="#start">
              Start building
            </a>
            <a className="button secondary" href="#features">
              View features
            </a>
          </div>
        </div>

        <div className="product-panel" aria-label="Product overview">
          <div className="panel-header">
            <span />
            <span />
            <span />
          </div>
          <div className="panel-body">
            <div className="status-row">
              <strong>Customer onboarding</strong>
              <span>Ready</span>
            </div>
            <div className="progress-track">
              <span />
            </div>
            <div className="panel-grid">
              <div>
                <b>Plan</b>
                <p>Scope the first workflow.</p>
              </div>
              <div>
                <b>Build</b>
                <p>Ship the customer path.</p>
              </div>
              <div>
                <b>Review</b>
                <p>Refine with feedback.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits" aria-label="Customer benefits">
        {benefits.map((benefit) => (
          <p key={benefit}>{benefit}</p>
        ))}
      </section>

      <section className="feature-section" id="features" aria-labelledby="features-title">
        <div>
          <p className="eyebrow">Why it works</p>
          <h2 id="features-title">Skimmable, practical, and ready for next steps.</h2>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta" id="start" aria-labelledby="cta-title">
        <p className="eyebrow">Next step</p>
        <h2 id="cta-title">Turn the homepage into a guided customer path.</h2>
        <p>
          Add audience-specific messaging, connect the primary action to the
          product flow, and keep every section easy to scan.
        </p>
      </section>
    </main>
  );
}

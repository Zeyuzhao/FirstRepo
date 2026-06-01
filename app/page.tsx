const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For small teams validating a new workflow.",
    badge: "",
    highlights: ["3 seats included", "Core automation", "Email support"],
    cta: "Start Starter",
  },
  {
    name: "Growth",
    price: "$49",
    description: "For teams that need cleaner handoffs and reporting.",
    badge: "Most popular",
    highlights: ["12 seats included", "Advanced automation", "Priority support"],
    cta: "Start Growth",
  },
  {
    name: "Scale",
    price: "$99",
    description: "For larger teams standardizing operations.",
    badge: "",
    highlights: ["Unlimited seats", "Custom approvals", "Dedicated success"],
    cta: "Start Scale",
  },
];

const comparison = [
  ["Setup help", "Guided", "Priority", "Dedicated"],
  ["Reporting", "Basic", "Advanced", "Custom"],
  ["Integrations", "5", "25", "Unlimited"],
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="pricing-heading">
        <p className="data-label">Sample data</p>
        <div>
          <p className="eyebrow">Pricing</p>
          <h1 id="pricing-heading">Choose a plan without the fine print hunt.</h1>
        </div>
        <p className="summary">
          Scan monthly cost, best-fit team size, and the key upgrade points before
          opening the full comparison.
        </p>
      </section>

      <section className="plans" aria-label="Sample pricing plans">
        {plans.map((plan) => (
          <article
            className={`plan ${plan.badge ? "plan-featured" : ""}`}
            key={plan.name}
          >
            <div className="plan-topline">
              <div>
                <h2>{plan.name}</h2>
                <p>{plan.description}</p>
              </div>
              {plan.badge ? <span className="badge">{plan.badge}</span> : null}
            </div>

            <div className="price-row">
              <span className="price">{plan.price}</span>
              <span className="period">per month</span>
            </div>

            <ul className="highlights" aria-label={`${plan.name} highlights`}>
              {plan.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>

            <button type="button">{plan.cta}</button>
          </article>
        ))}
      </section>

      <section className="compare" aria-labelledby="compare-heading">
        <div className="section-heading">
          <p className="eyebrow">Quick compare</p>
          <h2 id="compare-heading">What changes as you grow</h2>
        </div>

        <div className="comparison-list">
          {comparison.map(([feature, starter, growth, scale]) => (
            <div className="comparison-row" key={feature}>
              <span className="feature-name">{feature}</span>
              <span>
                <strong>Starter</strong>
                {starter}
              </span>
              <span>
                <strong>Growth</strong>
                {growth}
              </span>
              <span>
                <strong>Scale</strong>
                {scale}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

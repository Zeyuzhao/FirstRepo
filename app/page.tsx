const planFeatures = [
  {
    label: "Seats included",
    pro: "1 seat",
    team: "5 seats",
  },
  {
    label: "Shared workspaces",
    pro: "1 private workspace",
    team: "Unlimited shared workspaces",
  },
  {
    label: "Approvals",
    pro: "Personal review queue",
    team: "Role-based approvals",
  },
  {
    label: "Reporting",
    pro: "Usage summary",
    team: "Team analytics and exports",
  },
  {
    label: "Support",
    pro: "Priority email",
    team: "Priority email and onboarding",
  },
];

export default function Home() {
  return (
    <main className="page">
      <section className="pricing">
        <div className="pricing__intro">
          <p className="eyebrow">Pricing</p>
          <h1>Pick the plan that fits how your team works.</h1>
          <p className="summary">
            Pro is built for focused individual work. Team adds the shared
            controls, visibility, and seats that make collaboration easier.
          </p>
        </div>

        <div className="plans" aria-label="Pricing plans">
          <article className="plan">
            <div>
              <p className="plan__label">Pro</p>
              <h2>$19</h2>
              <p className="plan__meta">per user, per month</p>
            </div>
            <p className="plan__description">
              Best for independent contributors who need a powerful personal
              workspace.
            </p>
            <ul className="plan__list">
              <li>1 private workspace</li>
              <li>Unlimited projects</li>
              <li>Priority email support</li>
            </ul>
            <button className="button button--secondary">Choose Pro</button>
          </article>

          <article className="plan plan--featured">
            <div className="plan__header">
              <div>
                <p className="plan__label">Team</p>
                <h2>$49</h2>
                <p className="plan__meta">per month, 5 seats included</p>
              </div>
              <span className="badge">Best for teams</span>
            </div>
            <p className="plan__description">
              Adds shared workspaces, team visibility, and controls that help
              groups move faster together.
            </p>
            <ul className="plan__list">
              <li>5 included seats with easy add-ons</li>
              <li>Unlimited shared workspaces</li>
              <li>Team analytics, exports, and onboarding</li>
            </ul>
            <button className="button">Choose Team</button>
          </article>
        </div>

        <section className="comparison" aria-label="Compare Pro and Team">
          <div className="comparison__header">
            <p className="eyebrow">Compare Plans</p>
            <h2>What changes when you move from Pro to Team?</h2>
          </div>

          <div className="comparison__table">
            <div className="comparison__row comparison__row--head">
              <span>Feature</span>
              <span>Pro</span>
              <span>Team</span>
            </div>
            {planFeatures.map((feature) => (
              <div className="comparison__row" key={feature.label}>
                <span>{feature.label}</span>
                <span>{feature.pro}</span>
                <strong>{feature.team}</strong>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

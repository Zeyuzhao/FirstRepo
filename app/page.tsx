export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">Enterprise onboarding</p>
          <h1 id="hero-title">Launch teams with governance already in place.</h1>
          <p className="summary">
            FirstRepo helps buyers evaluate rollout readiness at a glance:
            security, provisioning, adoption, and support are organized into one
            implementation path.
          </p>
          <div className="actions" aria-label="Primary actions">
            <a className="button primary" href="#plan">
              Review rollout plan
            </a>
            <a className="button secondary" href="#requirements">
              Compare requirements
            </a>
          </div>
        </div>

        <aside className="onboarding-panel" aria-label="Enterprise readiness">
          <div className="panel-header">
            <span>Buyer scan</span>
            <strong>Implementation fit</strong>
          </div>
          <dl className="readiness-list">
            <div>
              <dt>Security</dt>
              <dd>SSO, audit controls, and admin roles surfaced first.</dd>
            </div>
            <div>
              <dt>Provisioning</dt>
              <dd>Clear ownership for setup, migration, and access paths.</dd>
            </div>
            <div>
              <dt>Adoption</dt>
              <dd>Enablement milestones grouped by stakeholder priority.</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="detail-band" aria-label="Onboarding priorities">
        <div id="plan">
          <span className="detail-kicker">Rollout</span>
          <h2>Decision-ready plan</h2>
          <p>
            Separate executive confidence from implementation detail so buyers
            can scan risk, ownership, and next steps without digging.
          </p>
        </div>
        <div id="requirements">
          <span className="detail-kicker">Requirements</span>
          <h2>Enterprise checklist</h2>
          <p>
            Put compliance, identity, data handling, and support requirements in
            plain language before procurement slows the evaluation.
          </p>
        </div>
      </section>
    </main>
  );
}

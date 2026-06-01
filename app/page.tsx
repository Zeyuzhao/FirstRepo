export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="home-heading">
        <div className="hero-copy">
          <p className="eyebrow">14-day trial</p>
          <h1 id="home-heading">Start your workspace with a clear next step.</h1>
          <p className="summary">
            FirstRepo helps new teams move from an empty account to an organized
            project plan in minutes. Invite teammates, choose a template, and
            track setup progress from one focused home screen.
          </p>
          <div className="actions" aria-label="Trial actions">
            <a className="button primary" href="#setup">
              Continue setup
            </a>
            <a className="button secondary" href="#tour">
              View product tour
            </a>
          </div>
        </div>

        <aside className="trial-panel" aria-label="Trial progress">
          <div>
            <p className="panel-label">Trial checklist</p>
            <h2>3 steps to a useful first project</h2>
          </div>
          <ol className="setup-list" id="setup">
            <li>
              <span className="step-number">1</span>
              <span>
                <strong>Pick a template</strong>
                <small>Start with a plan that matches your team workflow.</small>
              </span>
            </li>
            <li>
              <span className="step-number">2</span>
              <span>
                <strong>Invite collaborators</strong>
                <small>Bring the people who need visibility into the work.</small>
              </span>
            </li>
            <li>
              <span className="step-number">3</span>
              <span>
                <strong>Track your first milestone</strong>
                <small>Turn trial setup into a concrete project outcome.</small>
              </span>
            </li>
          </ol>
        </aside>
      </section>

      <section className="support-row" id="tour" aria-label="Trial support">
        <div>
          <p className="support-title">Need help choosing where to begin?</p>
          <p>
            Use the product tour for a quick overview, or continue setup to get
            the recommended first project structure.
          </p>
        </div>
        <a className="text-link" href="#setup">
          Back to checklist
        </a>
      </section>
    </main>
  );
}

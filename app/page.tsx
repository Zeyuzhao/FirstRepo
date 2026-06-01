export default function Home() {
  return (
    <main className="page">
      <section className="intro">
        <p className="eyebrow">New trial workspace</p>
        <h1>Start getting value from FirstRepo today.</h1>
        <p className="summary">
          Set up your first workflow, invite teammates, and see what your trial
          can do in just a few minutes.
        </p>
        <div className="cta-panel" aria-label="Trial setup call to action">
          <a className="primary-cta" href="/get-started">
            Start trial setup
          </a>
          <p className="cta-note">Recommended first step for new trial users</p>
        </div>
      </section>
    </main>
  );
}

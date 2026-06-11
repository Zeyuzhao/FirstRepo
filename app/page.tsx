export default function Home() {
  const setupItems = [
    "Next.js App Router",
    "TypeScript configuration",
    "Production build script",
  ];

  return (
    <main className="page">
      <section className="hero" aria-labelledby="page-title">
        <div className="intro">
          <p className="eyebrow">FirstRepo</p>
          <h1 id="page-title">A clean Next.js starter is ready.</h1>
          <p className="summary">
            The repo is set up with TypeScript, the App Router, shared global
            styles, and production scripts so the next feature can start here.
          </p>
        </div>

        <div className="setup-panel" aria-label="Repository setup status">
          <p className="panel-label">Setup status</p>
          <ul>
            {setupItems.map((item) => (
              <li key={item}>
                <span aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

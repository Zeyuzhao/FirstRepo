const checks = ["Next.js app", "Port 3000", "0.0.0.0 bind"];

export default function Home() {
  return (
    <main className="shell">
      <section className="status-panel" aria-labelledby="page-title">
        <div className="eyebrow">FirstRepo</div>
        <h1 id="page-title">Preview is running</h1>
        <p>
          This tiny Next.js app is ready for the Jiro tunnel verification.
        </p>
        <div className="checks" aria-label="Preview checks">
          {checks.map((check) => (
            <span key={check}>{check}</span>
          ))}
        </div>
      </section>
    </main>
  );
}

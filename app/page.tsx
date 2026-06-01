export default function Home() {
  const trustItems = [
    {
      title: "Privacy-first setup",
      description: "Trial workspaces start without exposing customer records.",
    },
    {
      title: "Clear guardrails",
      description: "Every trial includes plain-language security and data-use expectations.",
    },
    {
      title: "Human support",
      description: "New teams can reach a product specialist before connecting data sources.",
    },
  ];

  return (
    <main className="page">
      <section className="intro">
        <p className="eyebrow">Next.js app</p>
        <h1>FirstRepo is ready to build on.</h1>
        <p className="summary">
          Edit <code>app/page.tsx</code> to start shaping the application.
        </p>
      </section>

      <section className="trust" aria-labelledby="trial-trust-heading">
        <div className="trustHeader">
          <p className="eyebrow">For new trial users</p>
          <h2 id="trial-trust-heading">Start with confidence.</h2>
          <p>
            This section shares product commitments only. No customer data,
            customer names, usage metrics, or account details are shown here.
          </p>
        </div>

        <div className="trustItems">
          {trustItems.map((item) => (
            <article className="trustItem" key={item.title}>
              <span aria-hidden="true" className="trustIcon">
                ✓
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

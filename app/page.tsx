const plans = [
  {
    name: "Starter",
    price: "$19",
    note: "For first-time buyers",
    cta: "Start shopping",
    features: ["Free returns", "Basic rewards", "Email support"],
  },
  {
    name: "Plus",
    price: "$39",
    note: "Best for regular orders",
    cta: "Choose Plus",
    featured: true,
    features: ["Free 2-day shipping", "Double rewards", "Priority support"],
  },
  {
    name: "Premium",
    price: "$79",
    note: "For frequent shoppers",
    cta: "Go Premium",
    features: ["Same-day delivery", "VIP rewards", "Concierge support"],
  },
];

export default function Home() {
  return (
    <main className="page">
      <section className="hero" aria-labelledby="pricing-title">
        <div className="heroCopy">
          <p className="eyebrow">Sample pricing</p>
          <h1 id="pricing-title">Pick a plan before checkout.</h1>
          <p className="summary">
            Shorter plan details, clearer savings, and thumb-friendly actions
            help mobile shoppers compare quickly.
          </p>
        </div>

        <div className="trustBar" aria-label="Shopping benefits">
          <span>Cancel anytime</span>
          <span>Returns included</span>
          <span>Secure checkout</span>
        </div>
      </section>

      <section className="plans" aria-label="Pricing plans">
        {plans.map((plan) => (
          <article
            className={plan.featured ? "plan planFeatured" : "plan"}
            key={plan.name}
          >
            {plan.featured ? <p className="badge">Best value</p> : null}
            <div>
              <h2>{plan.name}</h2>
              <p className="planNote">{plan.note}</p>
            </div>
            <div className="priceRow">
              <span className="price">{plan.price}</span>
              <span className="term">/mo</span>
            </div>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <button type="button">{plan.cta}</button>
          </article>
        ))}
      </section>

      <section className="finePrint" aria-label="Pricing note">
        <strong>Sample data.</strong> Prices are placeholder content for preview
        review and are not current records.
      </section>
    </main>
  );
}

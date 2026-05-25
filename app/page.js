"use client";

import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main className="page">
      <section className="app-shell" aria-labelledby="app-title">
        <p className="eyebrow">Next.js app</p>
        <h1 id="app-title">Tiny Counter</h1>
        <p className="summary">
          A compact App Router starter with one interactive client component.
        </p>

        <div className="counter">
          <output className="count" aria-live="polite">
            {count}
          </output>
          <div className="actions">
            <button type="button" onClick={() => setCount((value) => value - 1)}>
              Decrease
            </button>
            <button type="button" onClick={() => setCount(0)}>
              Reset
            </button>
            <button
              type="button"
              className="primary"
              onClick={() => setCount((value) => value + 1)}
            >
              Increase
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

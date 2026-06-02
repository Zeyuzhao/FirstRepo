export default function Home() {
  const reviews = [
    {
      team: "Varsity",
      title: "Press break vs. Northside",
      status: "Needs notes",
      due: "Today",
      owner: "Coach Miller",
      priority: "High",
      clips: "18 clips",
      focus: "Turnovers in trap coverage",
    },
    {
      team: "JV",
      title: "Half-court defense",
      status: "Tagged",
      due: "Tomorrow",
      owner: "Coach Lee",
      priority: "Medium",
      clips: "11 clips",
      focus: "Closeouts and weak-side help",
    },
    {
      team: "Scouts",
      title: "Riverside set plays",
      status: "Ready",
      due: "Friday",
      owner: "Coach Davis",
      priority: "Low",
      clips: "9 clips",
      focus: "Baseline inbound options",
    },
  ];

  return (
    <main className="page">
      <section className="hero" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Sample data</p>
          <h1 id="page-title">Video review queue</h1>
          <p className="summary">
            Prioritize sessions, spot what needs coaching notes, and jump back
            into film review without digging through a long list.
          </p>
        </div>
        <div className="coach-card" aria-label="Review summary">
          <span className="summary-number">3</span>
          <span className="summary-label">sessions needing attention</span>
        </div>
      </section>

      <section className="scan-strip" aria-label="Review status summary">
        <div>
          <span className="metric">1</span>
          <span>needs notes</span>
        </div>
        <div>
          <span className="metric">18</span>
          <span>new clips</span>
        </div>
        <div>
          <span className="metric">2</span>
          <span>ready to send</span>
        </div>
      </section>

      <section className="review-list" aria-label="Video sessions">
        {reviews.map((review) => (
          <article className="review-card" key={review.title}>
            <div className="review-main">
              <div className="review-topline">
                <span className="team">{review.team}</span>
                <span className={`priority ${review.priority.toLowerCase()}`}>
                  {review.priority}
                </span>
              </div>
              <h2>{review.title}</h2>
              <p>{review.focus}</p>
            </div>

            <dl className="review-meta">
              <div>
                <dt>Status</dt>
                <dd>{review.status}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>{review.due}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{review.owner}</dd>
              </div>
              <div>
                <dt>Clips</dt>
                <dd>{review.clips}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </main>
  );
}

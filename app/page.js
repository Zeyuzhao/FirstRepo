const usageData = [
  { label: "Apr 16", value: 10 },
  { label: "Apr 17", value: 3 },
  { label: "Apr 18", value: 0 },
  { label: "Apr 19", value: 0 },
  { label: "Apr 20", value: 0.6 },
  { label: "Apr 21", value: 6 },
  { label: "Apr 22", value: 0.8 },
  { label: "Apr 23", value: 2.2 },
  { label: "Apr 24", value: 0.4 },
  { label: "Apr 25", value: 1.1 },
  { label: "Apr 26", value: 0 },
  { label: "Apr 27", value: 1 },
  { label: "Apr 28", value: 1.1 },
  { label: "Apr 29", value: 0.9 },
  { label: "Apr 30", value: 1.2 },
  { label: "May 1", value: 1.1 },
  { label: "May 2", value: 1.6 },
  { label: "May 3", value: 0 },
  { label: "May 4", value: 1.7 },
  { label: "May 5", value: 20 },
  { label: "May 6", value: 32 },
  { label: "May 7", value: 27 },
  { label: "May 8", value: 22 },
  { label: "May 9", value: 16 },
  { label: "May 10", value: 14 },
  { label: "May 11", value: 33 },
  { label: "May 12", value: 44 },
  { label: "May 13", value: 94 },
  { label: "May 14", value: 94 },
  { label: "May 15", value: 65 },
];

const legendItems = [
  { label: "Desktop App", color: "#df292c" },
  { label: "CLI", color: "#e345ad" },
  { label: "Cloud", color: "#4151d8" },
  { label: "Other", color: "#737987" },
];

export default function Home() {
  return (
    <main className="page">
      <section className="usage-breakdown" aria-labelledby="usage-title">
        <div className="title-row">
          <h1 id="usage-title">Usage breakdown</h1>
          <span className="info-icon" aria-hidden="true">
            i
          </span>
        </div>

        <h2>Personal usage</h2>

        <div
          className="chart"
          role="img"
          aria-label="Personal desktop app usage from Apr 16 to May 15, mostly low until a sharp increase in the final week, peaking around ninety-four percent on May 13 and May 14."
        >
          <span className="axis-label axis-label-top">100%</span>
          <span className="axis-label axis-label-bottom">0%</span>

          <div className="plot" aria-hidden="true">
            {usageData.map((day) => (
              <span
                className="bar"
                key={day.label}
                style={{
                  "--bar-height":
                    day.value === 0 ? "0" : `max(2px, ${day.value}%)`,
                }}
                data-empty={day.value === 0 ? "true" : undefined}
                title={`${day.label}: ${day.value}%`}
              />
            ))}
          </div>

          <span className="date-label date-label-start">Apr 16</span>
          <span className="date-label date-label-end">May 15</span>
        </div>

        <ul className="legend" aria-label="Usage categories">
          {legendItems.map((item) => (
            <li key={item.label}>
              <span
                className="legend-swatch"
                style={{ "--swatch": item.color }}
                aria-hidden="true"
              />
              {item.label}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

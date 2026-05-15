const desktopUsage = [
  10, 3, 0, 0, 0.5, 0, 6, 1, 2.5, 0.3, 1, 0, 1.2, 1, 1.1, 1.6, 1.2, 1.8, 0,
  1.5, 20, 32, 27, 21, 15, 13, 33, 44, 94, 94, 65,
];

const legendItems = [
  { label: "Desktop App", color: "#e1262a" },
  { label: "CLI", color: "#dd48aa" },
  { label: "Cloud", color: "#3948c8" },
  { label: "Other", color: "#727a86" },
];

export default function Home() {
  const maxValue = 100;

  return (
    <main className="page-shell">
      <section className="chart-panel" aria-labelledby="chart-title">
        <h1 id="chart-title">
          Usage breakdown
          <span className="info-dot" aria-label="Usage breakdown information">
            i
          </span>
        </h1>
        <h2>Personal usage</h2>

        <div
          className="chart"
          role="img"
          aria-label="Personal desktop app usage from Apr 16 to May 15. Usage is mostly near zero through the first two thirds of the range, then rises sharply near May 15 with two days just below 100 percent."
        >
          <div className="y-axis" aria-hidden="true">
            <span>100%</span>
            <span>0%</span>
          </div>

          <div className="plot">
            <div className="bars" aria-hidden="true">
              {desktopUsage.map((value, index) => (
                <span
                  className="bar"
                  key={`${index}-${value}`}
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    opacity: value === 0 ? 0 : 1,
                  }}
                />
              ))}
            </div>

            <div className="x-axis" aria-hidden="true">
              <span>Apr 16</span>
              <span>May 15</span>
            </div>
          </div>
        </div>

        <ul className="legend" aria-label="Usage sources">
          {legendItems.map((item) => (
            <li key={item.label}>
              <span
                className="legend-swatch"
                style={{ backgroundColor: item.color }}
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

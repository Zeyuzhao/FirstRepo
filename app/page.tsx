import RealMap from "./real-map";

const stops = [
  { number: "01", name: "Meimei Dumpling", time: "12:15" },
  { number: "02", name: "Tea Alley", time: "12:35" },
  { number: "03", name: "Sentea", time: "12:55" },
  { number: "04", name: "Boba Bar", time: "13:05" },
];

export default function Home() {
  return (
    <main className="trail-page">
      <aside className="itinerary" aria-label="Boba trail itinerary">
        <div className="itinerary-intro">
          <p className="eyebrow">Downtown San José</p>
          <h1>Boba<br /><em>walk.</em></h1>
          <p className="trail-meta">1.47 km · 20 min walk</p>
        </div>

        <ol className="stop-list">
          {stops.map((stop) => (
            <li className="stop" key={stop.name}>
              <div className="stop-topline"><span className="stop-number">{stop.number}</span><span className="stop-time">{stop.time}</span></div>
              <h2>{stop.name}</h2>
            </li>
          ))}
        </ol>
        <p className="source-note">Google Maps venues · OpenStreetMap walk route</p>
      </aside>

      <section className="map-panel" aria-label="Real boba trail map">
        <RealMap />
      </section>
    </main>
  );
}

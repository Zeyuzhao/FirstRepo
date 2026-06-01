"use client";

import { useMemo, useState } from "react";

type Zone = {
  id: string;
  name: string;
  type: string;
  status: "critical" | "warning" | "normal";
  x: number;
  y: number;
  width: number;
  height: number;
  queue: number;
  dwell: string;
  throughput: string;
  note: string;
};

const zones: Zone[] = [
  {
    id: "receiving",
    name: "Receiving Dock",
    type: "Inbound",
    status: "warning",
    x: 34,
    y: 54,
    width: 190,
    height: 116,
    queue: 18,
    dwell: "42 min",
    throughput: "71%",
    note: "Late trailer checks are backing up pallet induction.",
  },
  {
    id: "sortation",
    name: "Sortation Loop",
    type: "Conveyor",
    status: "critical",
    x: 258,
    y: 70,
    width: 260,
    height: 150,
    queue: 43,
    dwell: "1 hr 18 min",
    throughput: "48%",
    note: "Lane 3 rejects are recirculating and slowing all downstream flow.",
  },
  {
    id: "storage",
    name: "Reserve Storage",
    type: "Racking",
    status: "normal",
    x: 552,
    y: 62,
    width: 210,
    height: 250,
    queue: 6,
    dwell: "13 min",
    throughput: "92%",
    note: "Reserve put-away is within the planned service window.",
  },
  {
    id: "pack",
    name: "Pack Stations",
    type: "Packing",
    status: "critical",
    x: 254,
    y: 262,
    width: 236,
    height: 142,
    queue: 31,
    dwell: "56 min",
    throughput: "53%",
    note: "Consumable replenishment is limiting station availability.",
  },
  {
    id: "shipping",
    name: "Shipping Doors",
    type: "Outbound",
    status: "warning",
    x: 536,
    y: 362,
    width: 230,
    height: 118,
    queue: 24,
    dwell: "39 min",
    throughput: "76%",
    note: "Carrier staging needs two more doors before the next wave.",
  },
];

const statusLabels = {
  critical: "Critical",
  warning: "Watch",
  normal: "Clear",
};

export default function Home() {
  const [selectedId, setSelectedId] = useState("sortation");
  const [filter, setFilter] = useState<"all" | Zone["status"]>("all");

  const selected = zones.find((zone) => zone.id === selectedId) ?? zones[0];
  const visibleZones = useMemo(
    () => zones.filter((zone) => filter === "all" || zone.status === filter),
    [filter],
  );

  return (
    <main className="page-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Sample data</p>
          <h1>Warehouse bottleneck map</h1>
        </div>
        <div className="status-strip" aria-label="Bottleneck summary">
          <span>
            <strong>2</strong> critical
          </span>
          <span>
            <strong>2</strong> watch
          </span>
          <span>
            <strong>1</strong> clear
          </span>
        </div>
      </header>

      <section className="workspace" aria-label="Interactive warehouse map">
        <div className="map-panel">
          <div className="map-header">
            <div>
              <p className="label">Facility A</p>
              <h2>Live-flow style floor view</h2>
            </div>
            <div className="filter-group" aria-label="Filter zones">
              {(["all", "critical", "warning", "normal"] as const).map((item) => (
                <button
                  className={filter === item ? "active" : ""}
                  key={item}
                  onClick={() => setFilter(item)}
                  type="button"
                >
                  {item === "all" ? "All" : statusLabels[item]}
                </button>
              ))}
            </div>
          </div>

          <svg className="warehouse-map" viewBox="0 0 800 520" role="img">
            <title>Interactive warehouse map with highlighted bottlenecks</title>
            <defs>
              <filter id="glow-critical" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter id="glow-warning" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <pattern id="rack-lines" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M 22 0 L 0 0 0 22" fill="none" stroke="#d7dee7" strokeWidth="1" />
              </pattern>
            </defs>

            <rect className="floor" x="16" y="24" width="768" height="472" rx="8" />
            <path className="route" d="M116 170 C180 248 272 226 354 226 S504 255 620 362" />
            <path className="route route-alt" d="M360 220 C380 286 372 322 372 404" />
            <rect className="racks" x="562" y="84" width="188" height="206" rx="4" />
            <g className="dock-lines">
              {Array.from({ length: 7 }).map((_, index) => (
                <line key={index} x1={52 + index * 24} x2={52 + index * 24} y1="38" y2="54" />
              ))}
              {Array.from({ length: 8 }).map((_, index) => (
                <line key={index} x1={558 + index * 24} x2={558 + index * 24} y1="480" y2="496" />
              ))}
            </g>

            {visibleZones.map((zone) => {
              const isSelected = selected.id === zone.id;
              return (
                <g key={zone.id}>
                  <rect
                    className={`zone ${zone.status} ${isSelected ? "selected" : ""}`}
                    filter={zone.status === "normal" ? undefined : `url(#glow-${zone.status})`}
                    height={zone.height}
                    onClick={() => setSelectedId(zone.id)}
                    role="button"
                    rx="8"
                    tabIndex={0}
                    width={zone.width}
                    x={zone.x}
                    y={zone.y}
                  />
                  <text className="zone-title" x={zone.x + 18} y={zone.y + 34}>
                    {zone.name}
                  </text>
                  <text className="zone-meta" x={zone.x + 18} y={zone.y + 60}>
                    {statusLabels[zone.status]} · queue {zone.queue}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className={`detail-panel ${selected.status}`} aria-label="Selected bottleneck details">
          <p className="label">Selected zone</p>
          <h2>{selected.name}</h2>
          <span className="pill">{statusLabels[selected.status]}</span>
          <dl className="metrics">
            <div>
              <dt>Queue</dt>
              <dd>{selected.queue}</dd>
            </div>
            <div>
              <dt>Dwell</dt>
              <dd>{selected.dwell}</dd>
            </div>
            <div>
              <dt>Throughput</dt>
              <dd>{selected.throughput}</dd>
            </div>
          </dl>
          <p className="note">{selected.note}</p>
          <div className="mini-flow" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <p className="sample-copy">Sample data, not current records.</p>
        </aside>
      </section>
    </main>
  );
}

const tiles = Array.from({ length: 4 }, (_, row) =>
  Array.from({ length: 4 }, (_, column) => ({ x: 10577 + column, y: 25430 + row })),
).flat();

const pins = [
  { name: "Meimei Dumpling", number: "01", left: 61.96, top: 58.14, color: "coral" },
  { name: "Tea Alley", number: "02", left: 40.73, top: 48.77, color: "gold" },
  { name: "Sentea", number: "03", left: 64, top: 58.89, color: "mint" },
  { name: "Boba Bar", number: "04", left: 64.42, top: 66.28, color: "violet" },
];

const walkingRoute: [number, number][] = [
  [-121.885179, 37.333731], [-121.885358, 37.333715], [-121.885783, 37.333534], [-121.886961, 37.333411], [-121.888134, 37.334961], [-121.889175, 37.334462], [-121.88989, 37.335423], [-121.889175, 37.334462], [-121.888134, 37.334961], [-121.886961, 37.333411], [-121.885783, 37.333534], [-121.885358, 37.333715], [-121.884766, 37.333769], [-121.884673, 37.333803], [-121.884603, 37.333709], [-121.884656, 37.333686], [-121.884603, 37.333709], [-121.884142, 37.333072], [-121.884979, 37.332665], [-121.884733, 37.332341],
];

function project([longitude, latitude]: [number, number]) {
  const scale = 2 ** 16;
  const x = ((longitude + 180) / 360) * scale;
  const y = ((1 - Math.asinh(Math.tan((latitude * Math.PI) / 180)) / Math.PI) / 2) * scale;
  return `${((x - 10577) / 4) * 100} ${((y - 25430) / 4) * 100}`;
}

const walkingPath = walkingRoute.map(project).join(" L");

const panScript = `
  (() => {
    const attach = () => {
      const map = document.querySelector('[data-trail-map]');
      const canvas = document.querySelector('[data-trail-canvas]');
      if (!map || !canvas || map.dataset.panReady) return;
      map.dataset.panReady = 'true';
      let drag = null;
      let offsetX = 0;
      let offsetY = 0;
      let scale = 1;
      const paint = () => { canvas.style.transform = 'translate(calc(-50% + ' + offsetX + 'px), calc(-50% + ' + offsetY + 'px)) scale(' + scale + ')'; };
      const zoom = (delta) => { scale = Math.max(1, Math.min(2.4, scale + delta)); paint(); };
      map.addEventListener('pointerdown', (event) => {
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, originX: offsetX, originY: offsetY };
        map.setPointerCapture(event.pointerId);
        map.classList.add('is-panning');
      });
      map.addEventListener('pointermove', (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        offsetX = Math.max(-130, Math.min(130, drag.originX + event.clientX - drag.x));
        offsetY = Math.max(-130, Math.min(130, drag.originY + event.clientY - drag.y));
        paint();
      });
      const stop = (event) => {
        if (!drag || event.pointerId !== drag.id) return;
        drag = null;
        map.classList.remove('is-panning');
      };
      map.addEventListener('pointerup', stop);
      map.addEventListener('pointercancel', stop);
      map.addEventListener('wheel', (event) => {
        event.preventDefault();
        zoom(event.deltaY < 0 ? 0.15 : -0.15);
      }, { passive: false });
      map.querySelector('[data-zoom-in]').addEventListener('click', () => zoom(0.2));
      map.querySelector('[data-zoom-out]').addEventListener('click', () => zoom(-0.2));
      map.querySelector('[data-reset-map]').addEventListener('click', () => { offsetX = 0; offsetY = 0; scale = 1; paint(); });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach, { once: true }); else attach();
  })();
`;

export default function RealMap() {
  return (
    <div className="real-map" data-trail-map role="application" aria-label="Draggable OpenStreetMap street map of the Meimei Dumpling boba trail">
      <div className="map-canvas" data-trail-canvas>
        <div className="tile-grid" aria-hidden="true">
          {tiles.map((tile) => <img key={`${tile.x}-${tile.y}`} src={`https://tile.openstreetmap.org/16/${tile.x}/${tile.y}.png`} alt="" />)}
        </div>
        <svg className="real-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d={`M${walkingPath}`} /></svg>
        {pins.map((pin) => <div className="real-pin-wrap" key={pin.name} style={{ left: `${pin.left}%`, top: `${pin.top}%` }}><span className={`real-pin ${pin.color}`}>{pin.number}</span></div>)}
        <span className="osm-credit">© OpenStreetMap contributors</span>
      </div>
      <div className="map-controls" aria-label="Map controls">
        <button type="button" data-zoom-in aria-label="Zoom in">+</button>
        <button type="button" data-zoom-out aria-label="Zoom out">−</button>
        <button type="button" data-reset-map aria-label="Reset map view">↺</button>
      </div>
      <script dangerouslySetInnerHTML={{ __html: panScript }} />
    </div>
  );
}

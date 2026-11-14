import type { TelemetrySample } from "@/types/domain";

export function WindRose({ latest }: { latest: TelemetrySample | null }) {
  const speed = latest?.wind_ms ?? 11.2;
  const angle = (speed * 15) % 360;
  return (
    <section className="panel p-5">
      <p className="panel-title">07 / Aerodynamic forcing</p>
      <h2 className="mt-2 text-lg font-semibold">Bridge deck wind vector</h2>
      <div className="mx-auto mt-2 max-w-[230px]">
        <svg viewBox="0 0 240 240" className="w-full" role="img"
          aria-label="Synthetic wind direction compass rose">
          {[40, 70, 100].map((radius) => (
            <circle key={radius} cx="120" cy="120" r={radius} fill="none"
              stroke="#365064" strokeDasharray="4 4" />
          ))}
          <line x1="120" y1="15" x2="120" y2="225" stroke="#365064" />
          <line x1="15" y1="120" x2="225" y2="120" stroke="#365064" />
          <g transform={`rotate(${angle} 120 120)`}>
            <path d="M 120 28 L 132 136 L 120 119 L 108 136 Z" fill="#adf5c4" />
          </g>
          <circle cx="120" cy="120" r="8" fill="#adf5c4" />
          <text x="120" y="14" fill="#9cadc1" fontSize="11" textAnchor="middle">N</text>
        </svg>
      </div>
      <p className="text-center text-2xl font-semibold">{speed.toFixed(1)} m/s</p>
      <p className="mt-1 text-center text-xs text-haze">Synthetic compass bearing</p>
    </section>
  );
}

import type { TelemetrySample } from "@/types/domain";

export function SensorRail({ samples }: { samples: TelemetrySample[] }) {
  const points = samples.length
    ? samples.slice(-50).map((sample) => sample.deck_accel_ms2)
    : Array.from({ length: 50 }, (_, i) => 0.22 + 0.05 * Math.abs(Math.sin(i * 0.42)));
  const geometry = points.map((point, i) => {
    const x = (i / Math.max(1, points.length - 1)) * 720;
    const y = 115 - point * 200;
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <section className="panel p-5">
      <p className="panel-title">02 / Vertical deck response</p>
      <h2 className="mt-2 text-lg font-semibold">Accelerometer response trace</h2>
      <svg viewBox="0 0 720 130" className="mt-5 w-full" role="img"
        aria-label="Synthetic deck acceleration line chart">
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="0" x2="720" y1={20 + line * 30}
            y2={20 + line * 30} stroke="#2b4151" strokeDasharray="4 5" />
        ))}
        <path d={geometry} fill="none" stroke="#adf5c4" strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <p className="mt-2 text-xs text-haze">Live-simulation window / acceleration in m/s²</p>
    </section>
  );
}

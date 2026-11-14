import type { BridgeSnapshot, TelemetrySample } from "@/types/domain";

export function TelemetryKpis({
  snapshot,
  latest,
}: {
  snapshot: BridgeSnapshot;
  latest: TelemetrySample | null;
}) {
  const entries = [
    { label: "Fundamental mode", value: latest?.mode_hz ?? snapshot.metrics.median_mode_hz,
      unit: "Hz", note: "Modal baseline: 0.850" },
    { label: "Peak simulated wind", value: latest?.wind_ms ?? snapshot.metrics.peak_wind_ms,
      unit: "m/s", note: "Anemometry / deck level" },
    { label: "Deck strain", value: latest?.strain_micro ?? snapshot.metrics.max_strain_micro,
      unit: "µε", note: "Thermal + live-load proxy" },
    { label: "Cable force spread", value: snapshot.metrics.cable_force_spread_pct,
      unit: "%", note: "Relative to reference" },
  ];
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Current monitoring indicators">
      {entries.map((entry) => (
        <article className="panel p-5" key={entry.label}>
          <p className="panel-title">{entry.label}</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">
            {entry.value.toFixed(entry.unit === "Hz" ? 3 : 1)}
            <span className="ml-2 text-sm font-normal text-mint">{entry.unit}</span>
          </p>
          <p className="mt-2 text-xs text-haze">{entry.note}</p>
        </article>
      ))}
    </section>
  );
}

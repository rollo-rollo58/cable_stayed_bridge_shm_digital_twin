"use client";

import { useState } from "react";
import { compareScenario } from "@/lib/api-client";
import { baseObservation, type ScenarioComparison } from "@/types/domain";

export function ScenarioWorkbench() {
  const [wind, setWind] = useState(1);
  const [traffic, setTraffic] = useState(1);
  const [temperature, setTemperature] = useState(0);
  const [comparison, setComparison] = useState<ScenarioComparison | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    setError("");
    try {
      setComparison(await compareScenario(baseObservation, wind, traffic, temperature));
    } catch {
      setComparison(null);
      setError("The analysis API is unavailable. Start the FastAPI service to compare scenarios.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="panel p-5">
      <p className="panel-title">10 / What-if load synthesis</p>
      <h2 className="mt-2 text-lg font-semibold">Scenario laboratory</h2>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          { title: "Wind multiplier", value: wind, change: setWind, min: 0, max: 3, step: 0.1 },
          { title: "Traffic multiplier", value: traffic, change: setTraffic,
            min: 0, max: 3, step: 0.1 },
          { title: "Temperature offset (°C)", value: temperature, change: setTemperature,
            min: -20, max: 20, step: 1 },
        ].map((slider) => (
          <label className="block text-xs text-haze" key={slider.title}>
            <span className="flex justify-between gap-2">
              {slider.title}<strong className="text-white">{slider.value.toFixed(1)}</strong>
            </span>
            <input className="focus-control mt-3 w-full" type="range" min={slider.min}
              max={slider.max} step={slider.step} value={slider.value}
              onChange={(event) => slider.change(Number(event.target.value))} />
          </label>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button type="button" onClick={run} disabled={busy}
          className="focus-control rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-abyss"
          >{busy ? "Evaluating" : "Evaluate scenario"}</button>
        {comparison && (
          <p className="text-sm">Score shift: <strong className="text-mint">
            {comparison.risk_change > 0 ? "+" : ""}{comparison.risk_change.toFixed(2)}
          </strong></p>
        )}
        {error && <p role="alert" className="text-xs text-coral">{error}</p>}
      </div>
      <p className="mt-3 text-xs text-haze">
        What-if results are research proxies; never use them as bridge safety decisions.
      </p>
    </section>
  );
}

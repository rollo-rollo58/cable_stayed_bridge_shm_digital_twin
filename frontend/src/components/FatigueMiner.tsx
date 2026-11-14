"use client";

import { useState } from "react";

export function FatigueMiner() {
  const [cycles, setCycles] = useState(150000);
  const [stress, setStress] = useState(65);
  const damage = cycles * stress ** 3 / 2e12;
  return (
    <section className="panel p-5">
      <p className="panel-title">08 / Cumulative fatigue</p>
      <h2 className="mt-2 text-lg font-semibold">Miner damage proxy</h2>
      <p className="mt-3 text-3xl font-semibold text-mint">{damage.toFixed(4)}</p>
      <p className="mt-1 text-xs text-haze">Dimensionless; synthetic detail constant</p>
      <div className="mt-5 space-y-4">
        <label className="block text-sm">
          Stress cycles: {cycles.toLocaleString()}
          <input className="focus-control mt-2 w-full" type="range" min="10000"
            max="1000000" step="10000" value={cycles}
            onChange={(event) => setCycles(Number(event.target.value))} />
        </label>
        <label className="block text-sm">
          Stress range: {stress.toFixed(0)} MPa
          <input className="focus-control mt-2 w-full" type="range" min="10"
            max="180" value={stress}
            onChange={(event) => setStress(Number(event.target.value))} />
        </label>
      </div>
      <p className="mt-3 text-xs text-haze">Not a design-code fatigue life assessment</p>
    </section>
  );
}

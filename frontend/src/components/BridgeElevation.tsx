"use client";

import { useState } from "react";
import type { BridgeCable } from "@/types/domain";

export function BridgeElevation({ cables }: { cables: BridgeCable[] }) {
  const [selected, setSelected] = useState(6);
  const active = cables[selected];
  return (
    <section className="panel grid-dots overflow-hidden p-5 lg:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="panel-title">01 / Structural elevation</p>
          <h2 className="mt-2 text-xl font-semibold">Cable-stayed superstructure</h2>
        </div>
        <span className="rounded-full border border-mint/30 px-3 py-1 text-xs text-mint">
          980 m span / illustrative
        </span>
      </div>
      <svg viewBox="0 0 1000 315" className="mt-4 w-full" role="img"
        aria-label="Bridge elevation with fifteen selectable stay cable positions">
        <defs>
          <linearGradient id="deckGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#83ccb4" />
            <stop offset="1" stopColor="#295d70" />
          </linearGradient>
        </defs>
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={40 + i * 115} x2={40 + i * 115} y1="20" y2="260"
            stroke="#284054" strokeDasharray="4 8" strokeWidth="1" />
        ))}
        <rect x="30" y="220" width="940" height="12" rx="3" fill="url(#deckGradient)" />
        {[240, 760].map((x) => (
          <g key={x}>
            <path d={`M ${x - 9} 285 L ${x - 5} 52 L ${x + 5} 52 L ${x + 9} 285`}
              fill="none" stroke="#d2e7e0" strokeWidth="5" />
            <rect x={x - 18} y="277" width="36" height="9" fill="#446476" />
          </g>
        ))}
        {cables.map((cable, index) => {
          const x = 53 + index * 63;
          const anchor = x < 500 ? 240 : 760;
          const isActive = selected === index;
          return (
            <g key={cable.code} onClick={() => setSelected(index)}
              className="cursor-pointer" role="button" tabIndex={0}
              onKeyDown={(event) => event.key === "Enter" && setSelected(index)}
              aria-label={`Inspect ${cable.code}`}>
              <line x1={anchor} y1={70 + Math.abs(anchor - x) * 0.15}
                x2={x} y2="221" stroke={isActive ? "#adf5c4" : "#648d9d"}
                strokeWidth={isActive ? 3 : 1.2} />
              <circle cx={x} cy="226" r={isActive ? 6 : 4}
                fill={isActive ? "#adf5c4" : "#648d9d"} />
            </g>
          );
        })}
        <text x="28" y="304" fill="#9cadc1" fontSize="12">WEST ABUTMENT</text>
        <text x="970" y="304" fill="#9cadc1" fontSize="12" textAnchor="end">
          EAST ABUTMENT
        </text>
      </svg>
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div>
          <span className="text-xs text-haze">Selected stay</span>
          <p className="text-lg font-semibold text-mint">{active?.code || "C-07"}</p>
        </div>
        <div>
          <span className="text-xs text-haze">Estimated cable tension</span>
          <p className="text-lg font-semibold">{active?.tension_kn.toFixed(0)} kN</p>
        </div>
        <div>
          <span className="text-xs text-haze">Deviation from reference</span>
          <p className="text-lg font-semibold">
            {active ? ((active.tension_kn / active.baseline_kn - 1) * 100).toFixed(2) : "0"}%
          </p>
        </div>
      </div>
    </section>
  );
}

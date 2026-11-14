"use client";

import { useState } from "react";

export function StrainRosette() {
  const [station, setStation] = useState(3);
  const x = 145 + 9 * Math.sin(station * 0.9);
  const y = -30 + 6 * Math.cos(station);
  const shear = 12 + 5 * Math.sin(station * 0.4);
  return (
    <section className="panel p-5">
      <p className="panel-title">04 / Strain rosette</p>
      <h2 className="mt-2 text-lg font-semibold">Principal response explorer</h2>
      <div className="mt-4 grid grid-cols-2 items-center gap-3">
        <svg viewBox="0 0 220 220" className="w-full" role="img"
          aria-label="Three-axis strain gauge rosette">
          <circle cx="110" cy="110" r="87" fill="none" stroke="#335064" />
          {[0, 60, 120].map((degree) => (
            <g transform={`rotate(${degree} 110 110)`} key={degree}>
              <rect x="96" y="34" width="28" height="152" rx="8"
                fill="#173f46" stroke="#adf5c4" strokeWidth="2" />
              <line x1="110" y1="43" x2="110" y2="177" stroke="#adf5c4"
                strokeWidth="3" strokeDasharray="6 6" />
            </g>
          ))}
          <circle cx="110" cy="110" r="18" fill="#adf5c4" />
        </svg>
        <div className="space-y-4 text-sm">
          <div><p className="text-haze">Longitudinal</p><strong>{x.toFixed(1)} µε</strong></div>
          <div><p className="text-haze">Transverse</p><strong>{y.toFixed(1)} µε</strong></div>
          <div><p className="text-haze">Shear</p><strong>{shear.toFixed(1)} µε</strong></div>
        </div>
      </div>
      <label htmlFor="strain-station" className="mt-3 block text-xs text-haze">
        Deck station {station + 1} / 8
      </label>
      <input id="strain-station" className="focus-control mt-2 w-full" type="range"
        min="0" max="7" value={station}
        onChange={(event) => setStation(Number(event.target.value))} />
    </section>
  );
}

"use client";

import { useState } from "react";

export function TrafficLoadTimeline() {
  const [hour, setHour] = useState(8);
  const samples = Array.from({ length: 24 }, (_, index) => (
    15 + 13 * Math.sin((index - 6) * Math.PI / 18) ** 2 + 22 * Math.exp(-(((index - 8) / 3) ** 2))
  ));
  return (
    <section className="panel p-5">
      <p className="panel-title">06 / Vehicle load reconstruction</p>
      <h2 className="mt-2 text-lg font-semibold">Hourly axle-group envelope</h2>
      <div className="mt-5 flex h-36 items-end gap-1">
        {samples.map((value, index) => (
          <button key={index} type="button" onClick={() => setHour(index)}
            className={`focus-control flex-1 rounded-t-sm transition-colors ${
              hour === index ? "bg-mint" : "bg-[#3c7988] hover:bg-[#69a9a4]"
            }`} style={{ height: `${value * 1.55}%` }}
            aria-label={`Select hour ${index}: ${value.toFixed(0)} synthetic axle groups`} />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-haze">
        <span>00:00</span><span>{String(hour).padStart(2, "0")}:00 / selected</span>
        <span>23:00</span>
      </div>
    </section>
  );
}

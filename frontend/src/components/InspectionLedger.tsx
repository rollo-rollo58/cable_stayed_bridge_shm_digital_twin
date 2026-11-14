"use client";

import { useEffect, useState } from "react";
import { getInspections } from "@/lib/api-client";
import type { Inspection } from "@/types/domain";

const demo: Inspection[] = [
  { id: "INSP-026-042", date: "2026-09-14", zone: "Pylon N / anchorage bank",
    severity: "routine", finding: "Routine inspection; imagery review completed" },
  { id: "INSP-026-043", date: "2026-10-03", zone: "Cable 07 / damper saddle",
    severity: "review", finding: "Additional close-range measurement recommended" },
  { id: "INSP-026-044", date: "2026-10-27", zone: "Expansion joint / south approach",
    severity: "routine", finding: "Seasonal movement within synthetic reference band" },
];

export function InspectionLedger() {
  const [rows, setRows] = useState(demo);
  useEffect(() => {
    getInspections().then(setRows).catch(() => setRows(demo));
  }, []);
  return (
    <section className="panel p-5">
      <p className="panel-title">11 / Engineering inspection record</p>
      <h2 className="mt-2 text-lg font-semibold">Inspection ledger</h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="text-xs text-haze">
            <tr><th className="pb-3">Date</th><th className="pb-3">Location</th>
              <th className="pb-3">Finding</th><th className="pb-3">Status</th></tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-white/10">
                <td className="py-3 text-haze">{row.date}</td>
                <td className="py-3">{row.zone}</td>
                <td className="py-3 text-haze">{row.finding}</td>
                <td className="py-3 text-mint">{row.severity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

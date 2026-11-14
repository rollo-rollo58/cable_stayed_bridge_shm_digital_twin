"use client";

import { useEffect, useState } from "react";
import { AlertQueue } from "@/components/AlertQueue";
import { BridgeElevation } from "@/components/BridgeElevation";
import { CableTensionMatrix } from "@/components/CableTensionMatrix";
import { FatigueMiner } from "@/components/FatigueMiner";
import { InspectionLedger } from "@/components/InspectionLedger";
import { ModalSpectrum } from "@/components/ModalSpectrum";
import { ScenarioWorkbench } from "@/components/ScenarioWorkbench";
import { SensorRail } from "@/components/SensorRail";
import { StrainRosette } from "@/components/StrainRosette";
import { TelemetryKpis } from "@/components/TelemetryKpis";
import { TrafficLoadTimeline } from "@/components/TrafficLoadTimeline";
import { WindRose } from "@/components/WindRose";
import { useDomainTelemetry } from "@/hooks/useDomainTelemetry";
import { getOverview } from "@/lib/api-client";
import { fallbackSnapshot, type BridgeSnapshot } from "@/types/domain";

function ResearchMethodCard() {
  return (
    <section className="panel p-5">
      <p className="panel-title">12 / Model provenance</p>
      <h2 className="mt-2 text-lg font-semibold">Research boundaries</h2>
      <div className="mt-4 space-y-3 text-sm text-haze">
        <p>Modal sensing is simulated; no field instrumentation is connected by default.</p>
        <p>Cable forces use an ideal vibrating-string approximation, excluding sag and bending.</p>
        <p>Fatigue estimates apply a synthetic S-N coefficient rather than verified detail data.</p>
        <p>Policy catalogues contain executable but uncalibrated scenario coefficients.</p>
      </div>
      <div className="mt-5 rounded-lg border border-coral/30 bg-coral/10 p-3 text-xs text-coral">
        Not suitable for structural clearance, real-time emergency warning, or traffic control.
      </div>
    </section>
  );
}

export default function Dashboard() {
  const [snapshot, setSnapshot] = useState<BridgeSnapshot>(fallbackSnapshot);
  const [dataSource, setDataSource] = useState("Offline demo snapshot");
  const { latest, samples, status } = useDomainTelemetry();

  useEffect(() => {
    getOverview()
      .then((data) => { setSnapshot(data); setDataSource("API reference snapshot"); })
      .catch(() => setDataSource("Offline demo snapshot"));
  }, []);

  return (
    <main className="min-h-screen pb-14">
      <header className="border-b border-white/10 px-5 py-5 md:px-10">
        <div className="mx-auto flex max-w-[1540px] flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="rounded-xl border border-mint/40 p-3 text-lg font-black text-mint">
              BS
            </span>
            <div><p className="text-lg font-bold tracking-tight">BRIDGESCOPE</p>
              <p className="text-xs text-haze">Structural health / research studio</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-haze">
            <span className="rounded-full border border-white/20 px-3 py-2">{dataSource}</span>
            <span className="rounded-full border border-mint/30 px-3 py-2 text-mint">
              Stream: {status}
            </span>
            <span className="rounded-full bg-coral/15 px-3 py-2 text-coral">
              Synthetic data / no safety authority
            </span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1540px] space-y-5 px-5 pt-8 md:px-10">
        <section className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="panel-title">Strait crossing / Demo asset 001</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Structural intelligence workbench
            </h1>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-haze">
            Independent load, vibration, cable and fatigue research views.
            Values are demonstrative and are not a structural assessment.
          </p>
        </section>
        <TelemetryKpis snapshot={snapshot} latest={latest} />
        <BridgeElevation cables={snapshot.cables} />
        <div className="grid gap-5 xl:grid-cols-2">
          <SensorRail samples={samples} />
          <ModalSpectrum snapshot={snapshot} />
        </div>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          <StrainRosette />
          <CableTensionMatrix cables={snapshot.cables} />
          <WindRose latest={latest} />
        </div>
        <div className="grid gap-5 xl:grid-cols-2">
          <TrafficLoadTimeline />
          <FatigueMiner />
        </div>
        <ScenarioWorkbench />
        <div className="grid gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2"><InspectionLedger /></div>
          <AlertQueue alerts={snapshot.alerts} />
        </div>
        <ResearchMethodCard />
        <footer className="pb-5 pt-3 text-center text-xs text-haze">
          BridgeScope / research-only digital twin / synthetic inputs
        </footer>
      </div>
    </main>
  );
}

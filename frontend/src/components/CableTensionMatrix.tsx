import type { BridgeCable } from "@/types/domain";

export function CableTensionMatrix({ cables }: { cables: BridgeCable[] }) {
  return (
    <section className="panel p-5">
      <p className="panel-title">05 / Stay force matrix</p>
      <h2 className="mt-2 text-lg font-semibold">Cable tension deviation</h2>
      <div className="mt-4 grid grid-cols-5 gap-2">
        {cables.map((cable) => {
          const deviation = (cable.tension_kn / cable.baseline_kn - 1) * 100;
          const outsideBand = Math.abs(deviation) > 2.5;
          return (
            <div className={`rounded-lg p-2 text-center ${outsideBand
              ? "bg-coral/20 text-coral" : "bg-mint/10 text-mint"}`}
              key={cable.code} title={`${cable.tension_kn.toFixed(0)} kN`}>
              <p className="text-[10px] font-semibold">{cable.code}</p>
              <p className="mt-1 text-xs">{deviation > 0 ? "+" : ""}{deviation.toFixed(1)}%</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-haze">Color band is illustrative, not a safe-load criterion</p>
    </section>
  );
}

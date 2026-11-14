import type { BridgeSnapshot } from "@/types/domain";

export function ModalSpectrum({ snapshot }: { snapshot: BridgeSnapshot }) {
  return (
    <section className="panel p-5">
      <p className="panel-title">03 / Modal identification</p>
      <h2 className="mt-2 text-lg font-semibold">Natural frequency modes</h2>
      <div className="mt-5 flex h-44 items-end gap-4 border-b border-white/20 pb-2">
        {snapshot.modes_hz.map((value, index) => {
          const amplitude = 35 + 65 * Math.abs(Math.sin(value * 2.8));
          return (
            <div key={value} className="flex h-full flex-1 flex-col justify-end gap-2">
              <p className="text-center text-xs text-haze">{value.toFixed(3)}</p>
              <div className="rounded-t-md bg-gradient-to-t from-[#397c81] to-mint"
                style={{ height: `${amplitude}%` }} />
              <p className="text-center text-xs text-haze">M{index + 1}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-haze">Frequencies (Hz); bar heights illustrative only</p>
    </section>
  );
}

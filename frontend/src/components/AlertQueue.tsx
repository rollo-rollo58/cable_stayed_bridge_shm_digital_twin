import type { BridgeAlert } from "@/types/domain";

export function AlertQueue({ alerts }: { alerts: BridgeAlert[] }) {
  return (
    <section className="panel p-5">
      <p className="panel-title">09 / Observation triage</p>
      <h2 className="mt-2 text-lg font-semibold">Review queue</h2>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <article key={alert.id} className="rounded-xl border border-white/10 p-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold">{alert.zone}</h3>
              <span className={alert.severity === "review" ? "text-xs text-coral"
                : "text-xs text-mint"}>{alert.severity}</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-haze">{alert.message}</p>
            <p className="mt-2 text-[10px] uppercase tracking-wider text-haze">{alert.id}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

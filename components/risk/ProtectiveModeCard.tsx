import { formatMinutesAsHours } from "@/lib/risk/format";
import { ProtectiveAction } from "@/types/risk";

interface ProtectiveModeCardProps {
  actions: ProtectiveAction[];
  activeUntil?: string;
}

function formatTimestamp(isoDate?: string): string {
  if (!isoDate) {
    return "-";
  }
  const date = new Date(isoDate);
  return date.toLocaleString("sv-SE");
}

export function ProtectiveModeCard({ actions, activeUntil }: ProtectiveModeCardProps): JSX.Element {
  return (
    <section className="rounded-2xl border border-elevated/40 bg-elevated/10 p-4 shadow-neon">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-elevated">Skyddsläge aktivt</h3>
        <span className="rounded-full border border-elevated/45 px-2 py-1 text-xs text-elevated">Sänkt maxinsats</span>
      </div>
      <p className="mt-2 text-sm text-white/80">
        Skyddsåtgärder är aktiverade utifrån riskprofilen för att förstärka omsorgsplikten.
      </p>
      <div className="mt-3 space-y-2">
        {actions.map((action) => (
          <article key={action.id} className="rounded-lg border border-white/15 bg-black/20 px-3 py-2">
            <p className="text-sm font-semibold">{action.label}</p>
            <p className="text-xs text-white/70">{action.details}</p>
          </article>
        ))}
      </div>
      <p className="mt-3 text-xs text-white/60">Aktivt till: {formatTimestamp(activeUntil)}</p>
      <a
        href="https://www.spelpaus.se"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium"
      >
        Spelpaus.se
      </a>
      <p className="mt-3 text-[11px] text-white/45">Statusuppdatering var {formatMinutesAsHours(15)} i aktiv session.</p>
    </section>
  );
}

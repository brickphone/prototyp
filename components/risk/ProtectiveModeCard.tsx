import { formatMinutesAsHours } from "@/lib/risk/format";
import { ProtectiveAction } from "@/types/risk";

interface ProtectiveModeCardProps {
  active: boolean;
  actions: ProtectiveAction[];
  activeUntil?: string;
  canEnable?: boolean;
  onEnable?: () => void;
  onDisable?: () => void;
}

function formatTimestamp(isoDate?: string): string {
  if (!isoDate) {
    return "-";
  }
  const date = new Date(isoDate);
  return date.toLocaleString("sv-SE");
}

function actionTone(action: ProtectiveAction): string {
  if (action.type === "PAUSE" || action.type === "MAX_BET_REDUCTION") {
    return "border-elevated/45 bg-elevated/10";
  }
  if (action.type === "DEPOSIT_DELAY") {
    return "border-sky-400/45 bg-sky-500/10";
  }
  return "border-high/45 bg-high/10";
}

export function ProtectiveModeCard({
  active,
  actions,
  activeUntil,
  canEnable = false,
  onEnable,
  onDisable
}: ProtectiveModeCardProps): JSX.Element {
  const containerClass = active
    ? "border-[#ff9d2f]/55 bg-[linear-gradient(160deg,rgba(255,157,47,0.16),rgba(22,12,5,0.88))] shadow-[0_0_36px_rgba(255,157,47,0.24)]"
    : "border-high/45 bg-[linear-gradient(160deg,rgba(255,74,95,0.12),rgba(8,8,16,0.8))]";
  const statusPillClass = active
    ? "border-[#ffb45e]/55 bg-[#ff9d2f]/20 text-[#ffb45e]"
    : "border-high/55 bg-high/20 text-high";

  return (
    <section className={`rounded-2xl border p-4 ${containerClass}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className={`text-base font-semibold ${active ? "text-[#ffb45e]" : "text-high"}`}>
          {active ? "Skyddsläge aktivt" : "Skyddsläge rekommenderas"}
        </h3>
        <span className={`rounded-full border px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusPillClass}`}>
          {active ? "Aktivt läge" : "Rekommenderat"}
        </span>
      </div>
      <p className="mt-2 text-sm text-white/80">
        {active
          ? "Skyddsåtgärder är aktiverade utifrån riskprofilen för att förstärka omsorgsplikten."
          : "Ditt spelmönster indikerar förhöjd risk. Aktivera skyddsläge för att minska spelrelaterad risk."}
      </p>
      {!active && canEnable ? (
        <button
          type="button"
          onClick={onEnable}
          className="mt-3 inline-flex items-center rounded-lg border border-elevated/50 bg-elevated/20 px-3 py-2 text-sm font-semibold text-elevated hover:bg-elevated/30"
        >
          Aktivera skyddsläge
        </button>
      ) : null}
      <div className="mt-3 space-y-2">
        {actions.map((action) => (
          <article key={action.id} className={`rounded-lg border px-3 py-2 ${actionTone(action)}`}>
            <p className="text-sm font-semibold text-white/95">{action.label}</p>
            <p className="text-xs text-white/70">{action.details}</p>
          </article>
        ))}
      </div>
      {active ? <p className="mt-3 text-xs text-white/60">Aktivt till: {formatTimestamp(activeUntil)}</p> : null}
      <a
        href="https://www.spelpaus.se"
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium"
      >
        Spelpaus.se
      </a>
      {active && onDisable ? (
        <button
          type="button"
          onClick={onDisable}
          className="mt-3 ml-2 inline-flex items-center rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
        >
          Avaktivera manuellt läge
        </button>
      ) : null}
      <p className="mt-3 text-[11px] text-white/45">Statusuppdatering var {formatMinutesAsHours(15)} i aktiv session.</p>
    </section>
  );
}

import { formatMinutesAsHours, formatPercentDelta, formatSek } from "@/lib/risk/format";
import { GameplayMetrics } from "@/types/risk";

interface KpiGridProps {
  metrics: GameplayMetrics;
  previous: GameplayMetrics;
}

function deltaClass(current: number, previous: number): string {
  return current >= previous ? "text-high" : "text-low";
}

export function KpiGrid({ metrics, previous }: KpiGridProps): JSX.Element {
  const items = [
    {
      title: "Speltid",
      value: formatMinutesAsHours(metrics.playTimeMinutes),
      delta: `${formatPercentDelta(metrics.playTimeMinutes, previous.playTimeMinutes)} vs förra perioden`,
      positiveRisk: metrics.playTimeMinutes >= previous.playTimeMinutes
    },
    {
      title: "Nettoresultat",
      value: formatSek(metrics.netResultSek),
      delta: `${formatPercentDelta(metrics.netResultSek, previous.netResultSek)} vs förra perioden`,
      positiveRisk: metrics.netResultSek <= previous.netResultSek
    },
    {
      title: "Insättningar",
      value: formatSek(metrics.depositsSek),
      delta: `${formatPercentDelta(metrics.depositsSek, previous.depositsSek)} vs förra perioden`,
      positiveRisk: metrics.depositsSek >= previous.depositsSek
    },
    {
      title: "Sessioner",
      value: `${metrics.sessionCount} st`,
      delta: `${formatPercentDelta(metrics.sessionCount, previous.sessionCount)} vs förra perioden`,
      positiveRisk: metrics.sessionCount >= previous.sessionCount
    }
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-panel"
        >
          <p className="text-xs uppercase tracking-[0.14em] text-white/60">{item.title}</p>
          <p className="mt-2 text-4xl font-semibold leading-none">{item.value}</p>
          <p className={`mt-3 text-xs font-medium ${deltaClass(item.positiveRisk ? 1 : 0, 0)}`}>{item.delta}</p>
        </article>
      ))}
    </div>
  );
}

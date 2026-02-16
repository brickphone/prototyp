"use client";

import { KpiGrid } from "@/components/risk/KpiGrid";
import { BehaviorChanges } from "@/components/risk/BehaviorChanges";
import { ProtectiveModeCard } from "@/components/risk/ProtectiveModeCard";
import { RiskFactorsList } from "@/components/risk/RiskFactorsList";
import { RiskIndicator } from "@/components/risk/RiskIndicator";
import { formatSek } from "@/lib/risk/format";
import { DashboardSnapshot, ProtectiveAction, TimePeriod } from "@/types/risk";

interface RiskPanelProps {
  snapshot: DashboardSnapshot;
  period: TimePeriod;
  minimized: boolean;
  manualProtectiveModeEnabled: boolean;
  manualProtectiveModeActivatedAt: string | null;
  onPeriodChange: (period: TimePeriod) => void;
  onToggleMinimized: () => void;
  onEnableProtectiveMode: () => void;
  onDisableProtectiveMode: () => void;
}

const periodOptions: Array<{ label: string; value: TimePeriod }> = [
  { label: "Idag", value: "TODAY" },
  { label: "Vecka", value: "WEEK" },
  { label: "Månad", value: "MONTH" },
  { label: "År", value: "YEAR" }
];

function periodButtonClass(active: boolean): string {
  return active
    ? "bg-white/18 text-white"
    : "bg-transparent text-white/65 hover:bg-white/10 hover:text-white";
}

export function RiskPanel({
  snapshot,
  period,
  minimized,
  manualProtectiveModeEnabled,
  manualProtectiveModeActivatedAt,
  onPeriodChange,
  onToggleMinimized,
  onEnableProtectiveMode,
  onDisableProtectiveMode
}: RiskPanelProps): JSX.Element {
  const fallbackProtectiveActions: ProtectiveAction[] = [
    {
      id: "manual-pause",
      type: "PAUSE",
      label: "Tillfällig paus",
      status: "ACTIVE",
      details: "Ditt konto pausas i 24 timmar för att ge tid till reflektion."
    },
    {
      id: "manual-max-bet",
      type: "MAX_BET_REDUCTION",
      label: "Sänkt maxinsats",
      status: "ACTIVE",
      details: "Maxinsatsen sänks automatiskt baserat på ditt spelmönster."
    },
    {
      id: "manual-deposit-delay",
      type: "DEPOSIT_DELAY",
      label: "Fördröjd insättning",
      status: "ACTIVE",
      details: "Insättningar fördröjs för att ge extra betänketid."
    },
    {
      id: "manual-spelpaus",
      type: "SUSPENSION_RECOMMENDATION",
      label: "Avstängning via Spelpaus.se",
      status: "PENDING",
      details: "Du får direktlänk för tillfällig avstängning från licensierat spel."
    }
  ];

  const protectiveModeActive = snapshot.risk.protectiveModeActive || manualProtectiveModeEnabled;
  const protectiveActions = snapshot.risk.protectiveModeActive ? snapshot.risk.protectiveActions : fallbackProtectiveActions;
  const activeUntil =
    snapshot.risk.protectiveModeActive && snapshot.risk.activeUntil
      ? snapshot.risk.activeUntil
      : manualProtectiveModeActivatedAt
        ? new Date(new Date(manualProtectiveModeActivatedAt).getTime() + 24 * 60 * 60 * 1000).toISOString()
        : undefined;
  const showRecommendation = !protectiveModeActive && snapshot.risk.level !== "LOW";

  if (minimized) {
    return (
      <aside className="pointer-events-auto fixed bottom-4 left-4 z-40 w-[290px] rounded-2xl border border-white/15 bg-panel/85 p-3 shadow-glass backdrop-blur-panel md:bottom-8 md:left-8">
        <RiskIndicator level={snapshot.risk.level} score={snapshot.risk.score} compact />
        <button
          type="button"
          onClick={onToggleMinimized}
          className="mt-2 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20"
        >
          Visa översikt
        </button>
      </aside>
    );
  }

  return (
    <aside className="pointer-events-auto fixed left-1/2 top-[52%] z-40 h-[88vh] min-h-[620px] w-[96vw] max-h-[840px] max-w-[960px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/20 bg-panel/70 p-4 text-white shadow-glass backdrop-blur-panel md:min-h-[680px] md:p-5">
      <div className="panel-gradient-sweep absolute inset-y-0 left-[-20%] w-[65%]" />
      <div className="relative flex h-full flex-col gap-4">
        <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">Spelaröversikt</p>
            <h2 className="mt-1 text-2xl font-semibold">Mr Green Ansvarigt Spelande</h2>
          </div>
          <div className="flex items-start gap-2">
            <RiskIndicator level={snapshot.risk.level} score={snapshot.risk.score} compact />
            <button
              type="button"
              onClick={onToggleMinimized}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
            >
              Minimera
            </button>
          </div>
        </header>

        <div className="grid grid-cols-4 rounded-xl border border-white/10 bg-black/20 p-1">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onPeriodChange(option.value)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${periodButtonClass(period === option.value)}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
          <KpiGrid metrics={snapshot.metrics} previous={snapshot.previousMetrics} />

          <section className="rounded-xl border border-white/10 bg-black/20 px-3 py-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <p className="uppercase tracking-[0.14em] text-white/60">Riskpoäng</p>
              <p>{snapshot.risk.score}/100</p>
            </div>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-elevated via-high to-high"
                style={{ width: `${snapshot.risk.score}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/60">Nuvarande session: {formatSek(snapshot.metrics.currentSessionNetResultSek)}</p>
          </section>

          <RiskFactorsList factors={snapshot.risk.factors} />
          <BehaviorChanges items={snapshot.risk.behaviorChanges} />

          {protectiveModeActive || showRecommendation ? (
            <ProtectiveModeCard
              active={protectiveModeActive}
              actions={protectiveActions}
              activeUntil={activeUntil}
              canEnable={showRecommendation}
              onEnable={onEnableProtectiveMode}
              onDisable={manualProtectiveModeEnabled ? onDisableProtectiveMode : undefined}
            />
          ) : null}
        </div>
      </div>
    </aside>
  );
}

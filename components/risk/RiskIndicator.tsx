import { riskLabel } from "@/lib/risk/format";
import { RiskLevel } from "@/types/risk";

interface RiskIndicatorProps {
  level: RiskLevel;
  score: number;
  compact?: boolean;
}

const levelClassMap: Record<RiskLevel, string> = {
  LOW: "text-low border-low/60 bg-low/10",
  ELEVATED: "text-elevated border-elevated/60 bg-elevated/10",
  HIGH: "text-high border-high/60 bg-high/10"
};

const dotClassMap: Record<RiskLevel, string> = {
  LOW: "bg-low",
  ELEVATED: "bg-elevated",
  HIGH: "bg-high"
};

export function RiskIndicator({ level, score, compact = false }: RiskIndicatorProps): JSX.Element {
  return (
    <div className={`rounded-xl border px-3 py-2 ${levelClassMap[level]} ${compact ? "w-fit" : "w-full"}`}>
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClassMap[level]}`} />
        <p className="text-xs uppercase tracking-[0.18em] opacity-80">Riskstatus</p>
      </div>
      <div className="mt-1 flex items-end justify-between gap-4">
        <p className="text-lg font-semibold leading-none">{riskLabel(level)}</p>
        <p className="text-sm font-medium leading-none">{score}/100</p>
      </div>
    </div>
  );
}

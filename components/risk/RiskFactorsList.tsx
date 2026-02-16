import { RiskFactor } from "@/types/risk";

interface RiskFactorsListProps {
  factors: RiskFactor[];
}

const severityClass: Record<RiskFactor["severity"], string> = {
  LOW: "border-low/35 bg-low/10",
  MEDIUM: "border-elevated/35 bg-elevated/10",
  HIGH: "border-high/35 bg-high/10"
};

export function RiskFactorsList({ factors }: RiskFactorsListProps): JSX.Element {
  return (
    <section>
      <p className="text-xs uppercase tracking-[0.14em] text-white/55">Identifierade riskfaktorer</p>
      <div className="mt-3 space-y-2">
        {factors.map((factor) => (
          <article
            key={factor.id}
            className={`rounded-xl border p-3 ${severityClass[factor.severity]} backdrop-blur-panel`}
          >
            <p className="text-sm font-semibold">{factor.label}</p>
            <p className="mt-1 text-xs text-white/75">{factor.explanation}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

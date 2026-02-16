import {
  BehaviorChange,
  GameplayMetrics,
  ProtectiveAction,
  RiskAssessment,
  RiskFactor,
  RiskLevel
} from "@/types/risk";
import { formatPercentDelta } from "@/lib/risk/format";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function scoreDepositFrequency(metrics: GameplayMetrics): number {
  return clamp((metrics.depositFrequencyPerDay / 6) * 25, 0, 25);
}

function scoreSessionDuration(metrics: GameplayMetrics): number {
  return clamp((metrics.sessionDurationAvgMinutes / 180) * 20, 0, 20);
}

function scoreLossPattern(metrics: GameplayMetrics): number {
  const streakScore = clamp((metrics.lossStreak / 6) * 12, 0, 12);
  const netLossScore = clamp((Math.abs(Math.min(metrics.netResultSek, 0)) / 12000) * 18, 0, 18);
  return clamp(streakScore + netLossScore, 0, 30);
}

function scoreBehaviorShift(metrics: GameplayMetrics): number {
  const limitChangeScore = clamp(metrics.depositLimitChanges30d * 8, 0, 16);
  const nightScore = clamp(metrics.nightPlayRatio * 9, 0, 9);
  return clamp(limitChangeScore + nightScore, 0, 25);
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 32) {
    return "LOW";
  }
  if (score <= 65) {
    return "ELEVATED";
  }
  return "HIGH";
}

function buildRiskFactors(metrics: GameplayMetrics, score: number): RiskFactor[] {
  const factors: RiskFactor[] = [];

  if (metrics.depositFrequencyPerDay >= 4) {
    factors.push({
      id: "deposit-frequency",
      label: "Hög insättningsfrekvens",
      severity: metrics.depositFrequencyPerDay >= 5 ? "HIGH" : "MEDIUM",
      explanation: "Insättningar sker tätare än normalprofilen."
    });
  }

  if (metrics.sessionDurationAvgMinutes >= 120) {
    factors.push({
      id: "long-sessions",
      label: "Långa spelsessioner",
      severity: metrics.sessionDurationAvgMinutes >= 160 ? "HIGH" : "MEDIUM",
      explanation: "Sessionstiden ligger tydligt över tidigare period."
    });
  }

  if (metrics.lossStreak >= 3) {
    factors.push({
      id: "loss-streak",
      label: "Flera förluster i rad",
      severity: metrics.lossStreak >= 5 ? "HIGH" : "MEDIUM",
      explanation: "Förlustmönster i serie ökar ekonomisk och emotionell risk."
    });
  }

  if (metrics.depositLimitChanges30d > 0) {
    factors.push({
      id: "limit-changes",
      label: "Insättningsgräns ändrad nyligen",
      severity: "MEDIUM",
      explanation: "Nyliga gränsändringar indikerar förändrat beteende."
    });
  }

  if (score > 75) {
    factors.push({
      id: "critical-score",
      label: "Kritisk sammanvägd risknivå",
      severity: "HIGH",
      explanation: "Flera högriskmönster är aktiva samtidigt."
    });
  }

  return factors;
}

function buildBehaviorChanges(metrics: GameplayMetrics, previous: GameplayMetrics): BehaviorChange[] {
  return [
    {
      id: "playtime",
      label: "Speltiden har",
      value: `${formatPercentDelta(metrics.playTimeMinutes, previous.playTimeMinutes)} jämfört med föregående period`,
      direction: metrics.playTimeMinutes > previous.playTimeMinutes ? "UP" : "DOWN"
    },
    {
      id: "deposits",
      label: "Insättningar har",
      value: `${formatPercentDelta(metrics.depositsSek, previous.depositsSek)} jämfört med föregående period`,
      direction: metrics.depositsSek > previous.depositsSek ? "UP" : "DOWN"
    },
    {
      id: "sessions",
      label: "Antal sessioner är",
      value: `${formatPercentDelta(metrics.sessionCount, previous.sessionCount)} jämfört med föregående period`,
      direction: metrics.sessionCount > previous.sessionCount ? "UP" : "DOWN"
    }
  ];
}

function buildProtectiveActions(level: RiskLevel): { active: boolean; actions: ProtectiveAction[]; activeUntil?: string } {
  if (level !== "HIGH") {
    return { active: false, actions: [] };
  }

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return {
    active: true,
    activeUntil: tomorrow.toISOString(),
    actions: [
      {
        id: "pause",
        type: "PAUSE",
        label: "Tillfällig pausfunktion",
        status: "ACTIVE",
        details: "Pausläge aktiverat för att bryta intensivt spelmönster."
      },
      {
        id: "max-bet",
        type: "MAX_BET_REDUCTION",
        label: "Sänkt maxinsats",
        status: "ACTIVE",
        details: "Maxinsats reducerad automatiskt utifrån risknivån."
      },
      {
        id: "deposit-delay",
        type: "DEPOSIT_DELAY",
        label: "Fördröjningar vid insättning",
        status: "ACTIVE",
        details: "Ny insättning får säkerhetsfördröjning före bekräftelse."
      },
      {
        id: "suspension",
        type: "SUSPENSION_RECOMMENDATION",
        label: "Avstängning (rekommendation)",
        status: "PENDING",
        details: "Systemet rekommenderar tillfällig avstängning och Spelpaus-information."
      }
    ]
  };
}

export function calculateRiskAssessment(
  metrics: GameplayMetrics,
  previous: GameplayMetrics
): RiskAssessment {
  const score = Math.round(
    clamp(
      scoreDepositFrequency(metrics) +
        scoreSessionDuration(metrics) +
        scoreLossPattern(metrics) +
        scoreBehaviorShift(metrics),
      0,
      100
    )
  );

  const level = riskLevelFromScore(score);
  const factors = buildRiskFactors(metrics, score);
  const behaviorChanges = buildBehaviorChanges(metrics, previous);
  const protective = buildProtectiveActions(level);

  return {
    score,
    level,
    factors,
    behaviorChanges,
    protectiveModeActive: protective.active,
    protectiveActions: protective.actions,
    activeUntil: protective.activeUntil
  };
}

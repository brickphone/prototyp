import { calculateRiskAssessment } from "@/lib/risk/engine";
import { DashboardSnapshot, GameplayMetrics, TimePeriod } from "@/types/risk";

const currentMetricsByPeriod: Record<TimePeriod, GameplayMetrics> = {
  TODAY: {
    playTimeMinutes: 670,
    currentSessionMinutes: 135,
    netResultSek: -3580,
    currentSessionNetResultSek: -980,
    depositsSek: 6600,
    sessionCount: 7,
    depositFrequencyPerDay: 5.4,
    sessionDurationAvgMinutes: 136,
    lossStreak: 4,
    depositLimitChanges30d: 1,
    nightPlayRatio: 0.35
  },
  WEEK: {
    playTimeMinutes: 1630,
    currentSessionMinutes: 140,
    netResultSek: -7800,
    currentSessionNetResultSek: -980,
    depositsSek: 15400,
    sessionCount: 18,
    depositFrequencyPerDay: 3.8,
    sessionDurationAvgMinutes: 110,
    lossStreak: 3,
    depositLimitChanges30d: 1,
    nightPlayRatio: 0.26
  },
  MONTH: {
    playTimeMinutes: 5920,
    currentSessionMinutes: 140,
    netResultSek: -14100,
    currentSessionNetResultSek: -980,
    depositsSek: 42100,
    sessionCount: 58,
    depositFrequencyPerDay: 2.7,
    sessionDurationAvgMinutes: 84,
    lossStreak: 2,
    depositLimitChanges30d: 2,
    nightPlayRatio: 0.22
  },
  YEAR: {
    playTimeMinutes: 53400,
    currentSessionMinutes: 140,
    netResultSek: -53100,
    currentSessionNetResultSek: -980,
    depositsSek: 398000,
    sessionCount: 396,
    depositFrequencyPerDay: 1.9,
    sessionDurationAvgMinutes: 64,
    lossStreak: 2,
    depositLimitChanges30d: 3,
    nightPlayRatio: 0.16
  }
};

const previousMetricsByPeriod: Record<TimePeriod, GameplayMetrics> = {
  TODAY: {
    playTimeMinutes: 294,
    currentSessionMinutes: 72,
    netResultSek: -1140,
    currentSessionNetResultSek: -320,
    depositsSek: 2100,
    sessionCount: 3,
    depositFrequencyPerDay: 2.2,
    sessionDurationAvgMinutes: 78,
    lossStreak: 1,
    depositLimitChanges30d: 0,
    nightPlayRatio: 0.12
  },
  WEEK: {
    playTimeMinutes: 1180,
    currentSessionMinutes: 90,
    netResultSek: -3800,
    currentSessionNetResultSek: -650,
    depositsSek: 10200,
    sessionCount: 11,
    depositFrequencyPerDay: 2.3,
    sessionDurationAvgMinutes: 82,
    lossStreak: 2,
    depositLimitChanges30d: 0,
    nightPlayRatio: 0.18
  },
  MONTH: {
    playTimeMinutes: 5010,
    currentSessionMinutes: 96,
    netResultSek: -10100,
    currentSessionNetResultSek: -760,
    depositsSek: 31200,
    sessionCount: 49,
    depositFrequencyPerDay: 2.2,
    sessionDurationAvgMinutes: 75,
    lossStreak: 2,
    depositLimitChanges30d: 1,
    nightPlayRatio: 0.18
  },
  YEAR: {
    playTimeMinutes: 50200,
    currentSessionMinutes: 100,
    netResultSek: -45100,
    currentSessionNetResultSek: -800,
    depositsSek: 355000,
    sessionCount: 370,
    depositFrequencyPerDay: 1.6,
    sessionDurationAvgMinutes: 59,
    lossStreak: 1,
    depositLimitChanges30d: 2,
    nightPlayRatio: 0.13
  }
};

function withSmallLiveVariation(metrics: GameplayMetrics): GameplayMetrics {
  const minuteOffset = new Date().getMinutes() % 4;
  return {
    ...metrics,
    playTimeMinutes: metrics.playTimeMinutes + minuteOffset,
    currentSessionMinutes: metrics.currentSessionMinutes + minuteOffset,
    currentSessionNetResultSek: metrics.currentSessionNetResultSek - minuteOffset * 10
  };
}

export function getMockSnapshot(period: TimePeriod): DashboardSnapshot {
  const metrics = withSmallLiveVariation(currentMetricsByPeriod[period]);
  const previousMetrics = previousMetricsByPeriod[period];
  const risk = calculateRiskAssessment(metrics, previousMetrics);

  return {
    period,
    metrics,
    previousMetrics,
    risk,
    lastUpdatedAt: new Date().toISOString()
  };
}

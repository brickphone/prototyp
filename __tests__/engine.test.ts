import { describe, expect, it } from "vitest";
import { calculateRiskAssessment } from "@/lib/risk/engine";
import { GameplayMetrics } from "@/types/risk";

const lowRiskMetrics: GameplayMetrics = {
  playTimeMinutes: 90,
  currentSessionMinutes: 45,
  netResultSek: -200,
  currentSessionNetResultSek: -50,
  depositsSek: 500,
  sessionCount: 1,
  depositFrequencyPerDay: 0.8,
  sessionDurationAvgMinutes: 40,
  lossStreak: 1,
  depositLimitChanges30d: 0,
  nightPlayRatio: 0.05
};

const highRiskMetrics: GameplayMetrics = {
  playTimeMinutes: 1200,
  currentSessionMinutes: 210,
  netResultSek: -14000,
  currentSessionNetResultSek: -2400,
  depositsSek: 13000,
  sessionCount: 9,
  depositFrequencyPerDay: 6,
  sessionDurationAvgMinutes: 180,
  lossStreak: 6,
  depositLimitChanges30d: 2,
  nightPlayRatio: 0.7
};

describe("risk engine", () => {
  it("returns low risk for calm profile", () => {
    const result = calculateRiskAssessment(lowRiskMetrics, lowRiskMetrics);
    expect(result.level).toBe("LOW");
    expect(result.score).toBeLessThanOrEqual(32);
    expect(result.protectiveModeActive).toBe(false);
  });

  it("activates protective mode for high risk", () => {
    const result = calculateRiskAssessment(highRiskMetrics, lowRiskMetrics);
    expect(result.level).toBe("HIGH");
    expect(result.score).toBeGreaterThan(65);
    expect(result.protectiveModeActive).toBe(true);
    expect(result.protectiveActions.length).toBeGreaterThan(0);
  });
});

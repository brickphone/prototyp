export type RiskLevel = "LOW" | "ELEVATED" | "HIGH";

export type TimePeriod = "TODAY" | "WEEK" | "MONTH" | "YEAR";

export interface GameplayMetrics {
  playTimeMinutes: number;
  currentSessionMinutes: number;
  netResultSek: number;
  currentSessionNetResultSek: number;
  depositsSek: number;
  sessionCount: number;
  depositFrequencyPerDay: number;
  sessionDurationAvgMinutes: number;
  lossStreak: number;
  depositLimitChanges30d: number;
  nightPlayRatio: number;
}

export interface RiskFactor {
  id: string;
  label: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  explanation: string;
}

export interface BehaviorChange {
  id: string;
  label: string;
  value: string;
  direction: "UP" | "DOWN" | "STABLE";
}

export interface ProtectiveAction {
  id: string;
  type: "PAUSE" | "MAX_BET_REDUCTION" | "SUSPENSION_RECOMMENDATION" | "DEPOSIT_DELAY";
  label: string;
  status: "ACTIVE" | "PENDING";
  details: string;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
  behaviorChanges: BehaviorChange[];
  protectiveModeActive: boolean;
  protectiveActions: ProtectiveAction[];
  activeUntil?: string;
}

export interface DashboardSnapshot {
  period: TimePeriod;
  metrics: GameplayMetrics;
  previousMetrics: GameplayMetrics;
  risk: RiskAssessment;
  lastUpdatedAt: string;
}

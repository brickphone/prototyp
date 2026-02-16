"use client";

import { create } from "zustand";
import { DashboardSnapshot, TimePeriod } from "@/types/risk";

interface RiskState {
  period: TimePeriod;
  minimized: boolean;
  manualProtectiveModeEnabled: boolean;
  manualProtectiveModeActivatedAt: string | null;
  snapshot: DashboardSnapshot | null;
  loading: boolean;
  error: string | null;
  setPeriod: (period: TimePeriod) => void;
  toggleMinimized: () => void;
  setSnapshot: (snapshot: DashboardSnapshot) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  enableManualProtectiveMode: () => void;
  disableManualProtectiveMode: () => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  period: "TODAY",
  minimized: false,
  manualProtectiveModeEnabled: false,
  manualProtectiveModeActivatedAt: null,
  snapshot: null,
  loading: false,
  error: null,
  setPeriod: (period) => set({ period }),
  toggleMinimized: () => set((state) => ({ minimized: !state.minimized })),
  setSnapshot: (snapshot) => set({ snapshot }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  enableManualProtectiveMode: () =>
    set({
      manualProtectiveModeEnabled: true,
      manualProtectiveModeActivatedAt: new Date().toISOString()
    }),
  disableManualProtectiveMode: () =>
    set({
      manualProtectiveModeEnabled: false,
      manualProtectiveModeActivatedAt: null
    })
}));

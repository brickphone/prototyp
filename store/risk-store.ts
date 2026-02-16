"use client";

import { create } from "zustand";
import { DashboardSnapshot, TimePeriod } from "@/types/risk";

interface RiskState {
  period: TimePeriod;
  minimized: boolean;
  snapshot: DashboardSnapshot | null;
  loading: boolean;
  error: string | null;
  setPeriod: (period: TimePeriod) => void;
  toggleMinimized: () => void;
  setSnapshot: (snapshot: DashboardSnapshot) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useRiskStore = create<RiskState>((set) => ({
  period: "TODAY",
  minimized: false,
  snapshot: null,
  loading: false,
  error: null,
  setPeriod: (period) => set({ period }),
  toggleMinimized: () => set((state) => ({ minimized: !state.minimized })),
  setSnapshot: (snapshot) => set({ snapshot }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));

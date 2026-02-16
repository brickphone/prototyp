"use client";

import { useEffect } from "react";
import { RiskPanel } from "@/components/risk/RiskPanel";
import { DashboardSnapshot, TimePeriod } from "@/types/risk";
import { useRiskStore } from "@/store/risk-store";

function periodToQuery(period: TimePeriod): string {
  return period.toLowerCase();
}

async function fetchSnapshot(period: TimePeriod): Promise<DashboardSnapshot> {
  const response = await fetch(`/api/risk-feed?period=${periodToQuery(period)}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error("Kunde inte hämta riskdata");
  }

  return (await response.json()) as DashboardSnapshot;
}

export function RiskExperience(): JSX.Element {
  const {
    period,
    minimized,
    snapshot,
    loading,
    error,
    setPeriod,
    toggleMinimized,
    setSnapshot,
    setLoading,
    setError
  } = useRiskStore();

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchSnapshot(period);
        if (mounted) {
          setSnapshot(data);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError instanceof Error ? fetchError.message : "Okänt fel");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    const refresh = setInterval(load, 15000);

    return () => {
      mounted = false;
      clearInterval(refresh);
    };
  }, [period, setError, setLoading, setSnapshot]);

  if (loading && !snapshot) {
    return (
      <div className="fixed inset-x-0 top-6 z-40 mx-auto w-fit rounded-full border border-white/20 bg-black/55 px-4 py-2 text-sm text-white">
        Laddar spelaröversikt...
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="fixed inset-x-0 top-6 z-40 mx-auto w-fit rounded-full border border-high/45 bg-high/20 px-4 py-2 text-sm text-white">
        {error ?? "Ingen riskdata tillgänglig"}
      </div>
    );
  }

  return (
    <RiskPanel
      snapshot={snapshot}
      period={period}
      minimized={minimized}
      onPeriodChange={setPeriod}
      onToggleMinimized={toggleMinimized}
    />
  );
}

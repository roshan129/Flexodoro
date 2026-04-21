"use client";

import { useEffect, useMemo, useState } from "react";
import { formatSeconds } from "@/lib/time";
import type { InsightsSummary, StatsSummary } from "@/lib/stats";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const EMPTY_STATS: StatsSummary = {
  totalTimeSec: 0,
  avgSessionSec: 0,
  sessionsCount: 0,
  dailyFocusTimeSec: 0,
  weeklyTrend: [],
};

const EMPTY_INSIGHTS: InsightsSummary = {
  bestFocusTime: "Not enough data yet",
  avgSessionLengthSec: 0,
};

export function StatsDashboard() {
  const [stats, setStats] = useState<StatsSummary>(EMPTY_STATS);
  const [insights, setInsights] = useState<InsightsSummary>(EMPTY_INSIGHTS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [statsRes, insightsRes] = await Promise.all([
        fetch("/api/stats", { cache: "no-store" }),
        fetch("/api/insights", { cache: "no-store" }),
      ]);

      if (!statsRes.ok || !insightsRes.ok) {
        setErrorMessage("Could not load analytics right now. Please try again.");
        return;
      }

      const [statsPayload, insightsPayload] = (await Promise.all([
        statsRes.json(),
        insightsRes.json(),
      ])) as [ApiResponse<StatsSummary>, ApiResponse<InsightsSummary>];

      if (!statsPayload.success || !insightsPayload.success) {
        setErrorMessage("Could not load analytics right now. Please try again.");
        return;
      }

      setStats(statsPayload.data);
      setInsights(insightsPayload.data);
    } catch (error) {
      console.error("Failed to load dashboard", error);
      setErrorMessage("Could not load analytics right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, []);

  const maxTrendSec = useMemo(
    () => Math.max(1, ...stats.weeklyTrend.map((point) => point.totalDurationSec)),
    [stats.weeklyTrend],
  );
  const hasSessions = stats.sessionsCount > 0;

  return (
    <section className="surface-card animate-rise p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Sprint 4 Analytics</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">Stats Dashboard</h3>

      {errorMessage ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800/70 dark:bg-red-950/40 dark:text-red-300">
          <p>{errorMessage}</p>
          <button
            type="button"
            onClick={() => {
              void loadDashboard();
            }}
            className="rounded-md border border-current px-3 py-1 text-xs font-medium"
          >
            Retry
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted">Daily Focus Time</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {isLoading ? "..." : formatSeconds(stats.dailyFocusTimeSec)}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted">Total Focus Time</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {isLoading ? "..." : formatSeconds(stats.totalTimeSec)}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted">Avg Session</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {isLoading ? "..." : formatSeconds(stats.avgSessionSec)}
          </p>
        </div>

        <div className="rounded-lg border border-border p-4">
          <p className="text-xs text-muted">Sessions Count</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {isLoading ? "..." : stats.sessionsCount}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border p-4">
        <p className="text-sm font-medium">Weekly Trend</p>
        {isLoading ? (
          <p className="mt-3 text-sm text-muted">Loading weekly trend...</p>
        ) : !hasSessions ? (
          <p className="mt-3 text-sm text-muted">
            No focus sessions yet. Start a session to unlock your weekly trend.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-7 gap-2">
            {stats.weeklyTrend.map((point) => {
              const barHeight = Math.max(
                6,
                Math.round((point.totalDurationSec / maxTrendSec) * 64),
              );

              return (
                <div key={point.date} className="flex flex-col items-center gap-2">
                  <div className="flex h-20 w-full items-end justify-center rounded-md bg-white/5 px-1">
                    <div
                      className="w-6 rounded-sm bg-primary transition-all"
                      style={{ height: `${barHeight}px` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted">{point.date.slice(5)}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-lg border border-border p-4">
        <p className="text-sm font-medium">Insights</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-border p-3">
            <p className="text-xs text-muted">Best Focus Time</p>
            <p className="mt-1 text-base font-semibold">
              {isLoading
                ? "..."
                : hasSessions
                  ? insights.bestFocusTime
                  : "No sessions yet"}
            </p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-xs text-muted">Avg Session Length</p>
            <p className="mt-1 text-base font-semibold tabular-nums">
              {isLoading
                ? "..."
                : hasSessions
                  ? formatSeconds(insights.avgSessionLengthSec)
                  : "00:00"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

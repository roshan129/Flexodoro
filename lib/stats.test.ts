import { afterEach, describe, expect, it, vi } from "vitest";
import { buildInsightsSummary, buildStatsSummary } from "./stats";

function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

describe("lib/stats aggregation", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("buildStatsSummary aggregates totals, daily focus, and 7-day buckets in local time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 16, 12, 0, 0)); // May 16, 2026 local time

    const sessions = [
      { durationSec: 1800, startedAt: new Date(2026, 4, 16, 9, 0, 0) }, // today
      { durationSec: 1200, startedAt: new Date(2026, 4, 16, 14, 0, 0) }, // today
      { durationSec: 1500, startedAt: new Date(2026, 4, 15, 10, 0, 0) }, // yesterday
      { durationSec: 600, startedAt: new Date(2026, 4, 10, 8, 0, 0) }, // oldest in window
      { durationSec: 900, startedAt: new Date(2026, 4, 9, 8, 0, 0) }, // outside 7-day window
    ];

    const summary = buildStatsSummary(sessions);

    expect(summary.totalTimeSec).toBe(6000);
    expect(summary.sessionsCount).toBe(5);
    expect(summary.avgSessionSec).toBe(1200);
    expect(summary.dailyFocusTimeSec).toBe(3000);
    expect(summary.weeklyTrend).toHaveLength(7);

    const todayBucket = summary.weeklyTrend.find((point) => point.date === dateKey(new Date(2026, 4, 16)));
    expect(todayBucket).toEqual({
      date: dateKey(new Date(2026, 4, 16)),
      totalDurationSec: 3000,
      sessionsCount: 2,
    });

    const outsideWindowBucket = summary.weeklyTrend.find(
      (point) => point.date === dateKey(new Date(2026, 4, 9)),
    );
    expect(outsideWindowBucket).toBeUndefined();
  });

  it("buildInsightsSummary returns fallback when empty", () => {
    const insights = buildInsightsSummary([]);
    expect(insights.bestFocusTime).toBe("Not enough data yet");
    expect(insights.avgSessionLengthSec).toBe(0);
    expect(insights.personalBestDay).toBeNull();
    expect(insights.hourlyFocusSec).toHaveLength(24);
    expect(insights.hourlyFocusSec.every((item) => item.totalDurationSec === 0)).toBe(true);
  });

  it("buildInsightsSummary computes best focus hour and average session length", () => {
    const sessions = [
      { durationSec: 1800, startedAt: new Date(2026, 4, 16, 10, 0, 0) },
      { durationSec: 1200, startedAt: new Date(2026, 4, 16, 10, 30, 0) },
      { durationSec: 900, startedAt: new Date(2026, 4, 16, 14, 0, 0) },
    ];

    const insights = buildInsightsSummary(sessions);
    expect(insights.bestFocusTime).toBe("10:00 AM");
    expect(insights.avgSessionLengthSec).toBe(1300);
    expect(insights.personalBestDay).toEqual({
      date: dateKey(new Date(2026, 4, 16)),
      totalDurationSec: 3900,
    });
    expect(insights.hourlyFocusSec).toHaveLength(24);
    expect(insights.hourlyFocusSec.find((item) => item.hour === 10)?.totalDurationSec).toBe(3000);
    expect(insights.hourlyFocusSec.find((item) => item.hour === 14)?.totalDurationSec).toBe(900);
  });
});

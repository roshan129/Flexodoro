export interface SessionStatRow {
  durationSec: number;
  startedAt: Date;
}

export interface WeeklyTrendPoint {
  date: string;
  totalDurationSec: number;
  sessionsCount: number;
}

export interface StatsSummary {
  totalTimeSec: number;
  avgSessionSec: number;
  sessionsCount: number;
  dailyFocusTimeSec: number;
  weeklyTrend: WeeklyTrendPoint[];
}

export interface InsightsSummary {
  bestFocusTime: string;
  avgSessionLengthSec: number;
}

function formatDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function roundToInt(value: number): number {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

export function buildStatsSummary(sessions: SessionStatRow[]): StatsSummary {
  const now = new Date();
  const todayKey = formatDateKey(now);

  const totalTimeSec = sessions.reduce((sum, session) => sum + session.durationSec, 0);
  const sessionsCount = sessions.length;
  const avgSessionSec = sessionsCount > 0 ? roundToInt(totalTimeSec / sessionsCount) : 0;

  const dailyFocusTimeSec = sessions
    .filter((session) => formatDateKey(session.startedAt) === todayKey)
    .reduce((sum, session) => sum + session.durationSec, 0);

  const dayBuckets = new Map<string, { totalDurationSec: number; sessionsCount: number }>();

  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setUTCDate(now.getUTCDate() - i);
    dayBuckets.set(formatDateKey(day), { totalDurationSec: 0, sessionsCount: 0 });
  }

  for (const session of sessions) {
    const key = formatDateKey(session.startedAt);
    const bucket = dayBuckets.get(key);
    if (!bucket) {
      continue;
    }

    bucket.totalDurationSec += session.durationSec;
    bucket.sessionsCount += 1;
  }

  const weeklyTrend: WeeklyTrendPoint[] = Array.from(dayBuckets.entries()).map(
    ([date, value]) => ({
      date,
      totalDurationSec: value.totalDurationSec,
      sessionsCount: value.sessionsCount,
    }),
  );

  return {
    totalTimeSec,
    avgSessionSec,
    sessionsCount,
    dailyFocusTimeSec,
    weeklyTrend,
  };
}

export function buildInsightsSummary(sessions: SessionStatRow[]): InsightsSummary {
  if (sessions.length === 0) {
    return {
      bestFocusTime: "Not enough data yet",
      avgSessionLengthSec: 0,
    };
  }

  const hourBuckets = new Map<number, number>();

  for (let hour = 0; hour < 24; hour += 1) {
    hourBuckets.set(hour, 0);
  }

  let totalDuration = 0;
  for (const session of sessions) {
    totalDuration += session.durationSec;
    const hour = session.startedAt.getHours();
    hourBuckets.set(hour, (hourBuckets.get(hour) || 0) + session.durationSec);
  }

  let bestHour = 0;
  let bestValue = -1;

  for (const [hour, value] of hourBuckets.entries()) {
    if (value > bestValue) {
      bestValue = value;
      bestHour = hour;
    }
  }

  const toHourLabel = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const normalized = hour % 12 === 0 ? 12 : hour % 12;
    return `${normalized}:00 ${period}`;
  };

  return {
    bestFocusTime: toHourLabel(bestHour),
    avgSessionLengthSec: roundToInt(totalDuration / sessions.length),
  };
}

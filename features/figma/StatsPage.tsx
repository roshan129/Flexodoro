/* eslint-disable react/no-unescaped-entities */
"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import {
  Flame,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Sun,
  Sunset,
  Moon,
  Award,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const BG = 'var(--background)';
const SURFACE = 'var(--surface)';
const SURFACE2 = 'var(--surface-2)';
const BORDER = 'var(--border)';
const ACCENT = '#7C5CFC';
const TEXT = 'var(--foreground)';
const MUTED = 'var(--muted)';
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

// ─── Mock Data ────────────────────────────────────────────────────────────────
type WeeklyTrendPoint = {
  date: string;
  totalDurationSec: number;
  sessionsCount: number;
};

type StatsSummary = {
  totalTimeSec: number;
  avgSessionSec: number;
  sessionsCount: number;
  dailyFocusTimeSec: number;
  weeklyTrend: WeeklyTrendPoint[];
};

type InsightsSummary = {
  bestFocusTime: string;
  avgSessionLengthSec: number;
  personalBestDay: {
    date: string;
    totalDurationSec: number;
  } | null;
  hourlyFocusSec: Array<{
    hour: number;
    totalDurationSec: number;
  }>;
};

function parseLocalDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: accent || ACCENT,
          opacity: 0.5,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `${accent || ACCENT}18`,
            border: `1px solid ${accent || ACCENT}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent || ACCENT,
          }}
        >
          {icon}
        </div>
      </div>
      <p style={{ fontSize: 11, color: MUTED, fontWeight: 600, letterSpacing: '0.06em', marginBottom: 6 }}>
        {label.toUpperCase()}
      </p>
      <p
        style={{
          fontFamily: FONT_DISPLAY,
          fontSize: 28,
          fontWeight: 700,
          color: TEXT,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: sub ? 6 : 0,
        }}
      >
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: MUTED }}>{sub}</p>
      )}
    </motion.div>
  );
}

type ChartTooltipItem = {
  dataKey: string;
  value: number;
  payload?: {
    fullLabel?: string;
  };
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: string;
};

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const primary = payload[0];
  const header = primary?.payload?.fullLabel ?? label;
  return (
    <div
      style={{
        background: SURFACE2,
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{header}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
          {Math.round(p.value)}
          <span style={{ fontWeight: 400, color: MUTED, fontSize: 11 }}> min focused</span>
        </p>
      ))}
    </div>
  );
}

// Daily goal ring
function GoalRing({ progress, size = 80 }: { progress: number; size?: number }) {
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(1, progress));

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--subtle-fill-strong)"
        strokeWidth="6"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={ACCENT}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ filter: `drop-shadow(0 0 6px ${ACCENT}80)` }}
      />
    </svg>
  );
}

function formatMinutes(totalMinutes: number): string {
  if (totalMinutes <= 0) {
    return '0m';
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}m`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}m`;
}

function formatHoursDecimal(totalMinutes: number): string {
  return `${(Math.round((totalMinutes / 60) * 10) / 10).toFixed(1)}h`;
}

function formatHourLabel(hour: number): string {
  const period = hour >= 12 ? 'pm' : 'am';
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}${period}`;
}

export function StatsPage() {
  const [view, setView] = useState<'week' | 'month'>('week');
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [insightsData, setInsightsData] = useState<InsightsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const [statsRes, insightsRes] = await Promise.all([
          fetch('/api/stats', { cache: 'no-store' }),
          fetch('/api/insights', { cache: 'no-store' }),
        ]);

        if (!statsRes.ok || !insightsRes.ok) {
          throw new Error('Failed to fetch stats.');
        }

        const statsJson = await statsRes.json();
        const insightsJson = await insightsRes.json();

        if (!cancelled) {
          setStats(statsJson.data ?? null);
          setInsightsData(insightsJson.data ?? null);
        }
      } catch {
        if (!cancelled) {
          setErrorMessage('Unable to load stats right now. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  const weeklyData = useMemo(() => {
    if (!stats?.weeklyTrend) {
      return [];
    }

    return stats.weeklyTrend.map((point) => {
      const date = parseLocalDateKey(point.date);
      return {
        day: date.toLocaleDateString(undefined, { weekday: 'short' }),
        date: point.date,
        focus: Math.round(point.totalDurationSec / 60),
        sessions: point.sessionsCount,
      };
    });
  }, [stats]);

  const monthlyData = useMemo(() => {
    return weeklyData.map((d) => {
      const date = parseLocalDateKey(d.date);
      return {
        day: date.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
        fullLabel: date.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }),
        focus: d.focus,
      };
    });
  }, [weeklyData]);

  const totalWeekFocus = weeklyData.reduce((a, d) => a + d.focus, 0);
  const totalWeekSessions = weeklyData.reduce((a, d) => a + d.sessions, 0);
  const todayFocus = Math.round((stats?.dailyFocusTimeSec ?? 0) / 60);
  const dailyGoal = 120;
  const goalProgress = dailyGoal > 0 ? Math.min(1, todayFocus / dailyGoal) : 0;
  const streak = weeklyData.reduce((count, day) => (day.focus > 0 ? count + 1 : 0), 0);
  const avgSession = Math.round((stats?.avgSessionSec ?? 0) / 60);
  const deepWorkSessions = totalWeekSessions;

  const chartData =
    view === 'week'
      ? weeklyData.map((d) => ({
          day: d.day,
          focus: d.focus,
          fullLabel: parseLocalDateKey(d.date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          }),
        }))
      : monthlyData.map((d) => ({ day: `${d.day}`, focus: d.focus, fullLabel: d.fullLabel }));
  const todayDateKey = toLocalDateKey(new Date());
  const recentSessions = weeklyData
    .filter((d) => d.sessions > 0)
    .slice(-5)
    .reverse()
    .map((d, idx) => ({
      id: idx + 1,
      label: 'Focus Sessions',
      duration: d.focus,
      type: `${d.sessions} sessions`,
      time: parseLocalDateKey(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      color: idx % 2 === 0 ? ACCENT : '#A78BFA',
    }));
  const focusInsights = [
    {
      icon: <Sun size={14} />,
      text: `You focus best around ${insightsData?.bestFocusTime ?? 'N/A'}`,
      color: '#F59E0B',
    },
    {
      icon: <Zap size={14} />,
      text: `Your average session is ${formatMinutes(Math.round((insightsData?.avgSessionLengthSec ?? 0) / 60))}`,
      color: ACCENT,
    },
    {
      icon: <TrendingUp size={14} />,
      text: `${stats?.sessionsCount ?? 0} total work sessions recorded`,
      color: '#10B981',
    },
    {
      icon: <Moon size={14} />,
      text: `${formatHoursDecimal(Math.round((stats?.totalTimeSec ?? 0) / 60))} total focused time`,
      color: '#8B5CF6',
    },
  ];
  const hasAnyData = (stats?.sessionsCount ?? 0) > 0;
  const personalBest = insightsData?.personalBestDay ?? null;
  const personalBestDurationMinutes = Math.round((personalBest?.totalDurationSec ?? 0) / 60);
  const personalBestDateLabel = personalBest
    ? parseLocalDateKey(personalBest.date).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : 'No sessions yet';

  const daytimeHours = Array.from({ length: 14 }, (_, i) => i + 6);
  const hourlyFocusMap = new Map((insightsData?.hourlyFocusSec ?? []).map((item) => [item.hour, item.totalDurationSec]));
  const peakHourBars = daytimeHours.map((hour) => ({
    hour,
    label: formatHourLabel(hour),
    totalDurationSec: hourlyFocusMap.get(hour) ?? 0,
  }));
  const peakHourMax = Math.max(...peakHourBars.map((bar) => bar.totalDurationSec), 0);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: BG,
        padding: '40px 24px',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 40 }}
        >
          <h1
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 28,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: '-0.03em',
              marginBottom: 6,
            }}
          >
            Focus Stats
          </h1>
          <p style={{ fontSize: 14, color: MUTED }}>
            {isHydrated
              ? new Date().toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })
              : ' '}
          </p>
        </motion.div>

        {isLoading ? (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, color: MUTED }}>
            Loading stats...
          </div>
        ) : null}

        {errorMessage ? (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, color: '#F97316', marginTop: isLoading ? 12 : 0 }}>
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && !hasAnyData ? (
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 24, color: MUTED }}>
            No sessions yet. Start a focus session to populate your stats.
          </div>
        ) : null}

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon={<Clock size={16} />}
            label="Today's Focus"
            value={`${todayFocus}m`}
            sub={`${formatHoursDecimal(todayFocus)} out of ${formatHoursDecimal(dailyGoal)} goal`}
            delay={0}
          />
          <StatCard
            icon={<Flame size={16} />}
            label="Current Streak"
            value={`${streak}`}
            sub="days in a row"
            accent="#F59E0B"
            delay={0.05}
          />
          <StatCard
            icon={<TrendingUp size={16} />}
            label="This Week"
            value={formatHoursDecimal(totalWeekFocus)}
            sub={`${totalWeekSessions} sessions`}
            accent="#10B981"
            delay={0.1}
          />
          <StatCard
            icon={<Target size={16} />}
            label="Avg Session"
            value={formatMinutes(avgSession)}
            sub="optimal for flow"
            accent="#EC4899"
            delay={0.15}
          />
          <StatCard
            icon={<Award size={16} />}
            label="Deep Work"
            value={`${deepWorkSessions}`}
            sub="sessions this week"
            accent="#8B5CF6"
            delay={0.2}
          />
        </div>

        {/* Main chart + Today's goal */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 16,
            marginBottom: 24,
            alignItems: 'stretch',
          }}
        >
          {/* Focus time chart */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
              }}
            >
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>Focus Time</p>
                <p style={{ fontSize: 12, color: MUTED }}>
                  {view === 'week' ? 'Last 7 days (weekday view)' : 'Last 7 days (date view)'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(['week', 'month'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: 7,
                      border: `1px solid ${view === v ? 'rgba(124,92,252,0.4)' : BORDER}`,
                      background: view === v ? 'rgba(124,92,252,0.1)' : 'transparent',
                      color: view === v ? '#A78BFA' : MUTED,
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: MUTED }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: MUTED }}
                  tickFormatter={(value) => `${Math.round(value)}m`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="focus"
                  stroke={ACCENT}
                  strokeWidth={2}
                  fill="url(#focusGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: ACCENT, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Today's goal */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, textAlign: 'center' }}>
              Today's Goal
            </p>

            <div style={{ position: 'relative' }}>
              <GoalRing progress={goalProgress} size={120} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 22,
                    fontWeight: 700,
                    color: TEXT,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {Math.round(goalProgress * 100)}%
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: 18,
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: '-0.02em',
                }}
              >
                {todayFocus}
                <span style={{ fontSize: 13, color: MUTED, fontWeight: 400 }}> / {dailyGoal} min</span>
              </p>
              <p style={{ fontSize: 12, color: MUTED, marginTop: 4 }}>
                {todayFocus >= dailyGoal
                  ? 'Goal reached'
                  : `${dailyGoal - todayFocus} min to go`}
              </p>
            </div>

            {/* Daily bar mini chart */}
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: 11, color: MUTED, marginBottom: 8, fontWeight: 500 }}>WEEK OVERVIEW</p>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
                {weeklyData.map((d, i) => {
                  const h = (d.focus / 210) * 40;
                  const isToday = d.date === todayDateKey;
                  return (
                    <motion.div
                      key={d.day}
                      initial={{ height: 0 }}
                      animate={{ height: h }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      title={`${d.day}: ${d.focus}m`}
                      style={{
                        flex: 1,
                        borderRadius: 3,
                        background: isToday ? ACCENT : 'rgba(124,92,252,0.25)',
                        boxShadow: isToday ? `0 0 6px ${ACCENT}60` : 'none',
                        cursor: 'default',
                      }}
                    />
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                {weeklyData.map((d) => (
                  <p
                    key={d.day}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 9,
                      color: d.date === todayDateKey ? '#A78BFA' : MUTED,
                      fontWeight: d.date === todayDateKey ? 700 : 400,
                    }}
                  >
                    {d.day[0]}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom section: sessions + insights */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
            gap: 16,
          }}
        >
          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: SURFACE,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: '24px',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 20 }}>
              Recent Sessions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {recentSessions.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: `${s.color}15`,
                      border: `1px solid ${s.color}25`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Clock size={12} color={s.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: TEXT }}>{s.label}</p>
                    <p style={{ fontSize: 11, color: MUTED }}>{s.time}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontSize: 14,
                        fontWeight: 700,
                        color: s.color,
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {s.duration}m
                    </p>
                    <p style={{ fontSize: 10, color: MUTED }}>
                      {s.type}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: '24px',
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 16 }}>
                Focus Insights
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {focusInsights.map((insight, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.06 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: `${insight.color}08`,
                      border: `1px solid ${insight.color}18`,
                    }}
                  >
                    <div style={{ color: insight.color, flexShrink: 0 }}>{insight.icon}</div>
                    <p style={{ fontSize: 13, color: TEXT }}>{insight.text}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Best day */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                background: 'rgba(124,92,252,0.06)',
                border: '1px solid rgba(124,92,252,0.15)',
                borderRadius: 16,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: 'rgba(124,92,252,0.15)',
                  border: '1px solid rgba(124,92,252,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: ACCENT,
                  flexShrink: 0,
                }}
              >
                <Award size={22} />
              </div>
              <div>
                <p style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600, marginBottom: 3 }}>
                  PERSONAL BEST
                </p>
                <p
                  style={{
                    fontFamily: FONT_DISPLAY,
                    fontSize: 20,
                    fontWeight: 700,
                    color: TEXT,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {formatMinutes(personalBestDurationMinutes)}
                </p>
                <p style={{ fontSize: 12, color: MUTED }}>{personalBestDateLabel}</p>
              </div>
            </motion.div>

            {/* Peak hours */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: '20px 24px',
              }}
            >
              <p style={{ fontSize: 13, fontWeight: 600, color: TEXT, marginBottom: 14 }}>Peak Hours</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 48 }}>
                {peakHourBars.map(({ hour, label, totalDurationSec }) => {
                  const normalized =
                    peakHourMax > 0 ? totalDurationSec / peakHourMax : 0;
                  return (
                  <motion.div
                    key={hour}
                    title={`${label}: ${formatMinutes(Math.round(totalDurationSec / 60))}`}
                    initial={{ height: 0 }}
                    animate={{ height: normalized * 48 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                      flex: 1,
                      borderRadius: 3,
                      background:
                        normalized > 0.8
                          ? ACCENT
                          : normalized > 0.5
                          ? 'rgba(124,92,252,0.45)'
                          : 'rgba(124,92,252,0.18)',
                      cursor: 'default',
                    }}
                  />
                );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                {[
                  { label: 'Morning', icon: <Sun size={10} />, color: '#F59E0B' },
                  { label: 'Afternoon', icon: <Sunset size={10} />, color: '#F97316' },
                  { label: 'Evening', icon: <Moon size={10} />, color: '#8B5CF6' },
                ].map((t) => (
                  <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ color: t.color }}>{t.icon}</span>
                    <span style={{ fontSize: 10, color: MUTED }}>{t.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

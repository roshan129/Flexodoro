/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState } from 'react';
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
const BG = '#07070F';
const SURFACE = '#0F0F1A';
const SURFACE2 = '#161625';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#7C5CFC';
const TEXT = '#E8E8F0';
const MUTED = '#66667A';
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const weeklyData = [
  { day: 'Mon', focus: 95, sessions: 3 },
  { day: 'Tue', focus: 145, sessions: 5 },
  { day: 'Wed', focus: 200, sessions: 7 },
  { day: 'Thu', focus: 60, sessions: 2 },
  { day: 'Fri', focus: 175, sessions: 6 },
  { day: 'Sat', focus: 120, sessions: 4 },
  { day: 'Sun', focus: 42, sessions: 1 },
];

const monthlyData = Array.from({ length: 28 }, (_, i) => {
  const baseline = 95 + 35 * Math.sin(i / 2.7);
  const trend = (i % 6) * 4;
  const burst = [0, 18, -6, 22, -10, 8, 14][i % 7];
  return {
    day: i + 1,
    focus: Math.max(25, Math.round(baseline + trend + burst)),
  };
});

const recentSessions = [
  { id: 1, label: 'Deep Work', duration: 52, type: 'flexible', time: '2h ago', color: ACCENT },
  { id: 2, label: 'Fixed Pomodoro', duration: 25, type: 'fixed', time: '4h ago', color: '#A78BFA' },
  { id: 3, label: 'Deep Work', duration: 38, type: 'flexible', time: 'Yesterday', color: ACCENT },
  { id: 4, label: 'Fixed Pomodoro', duration: 40, type: 'fixed', time: 'Yesterday', color: '#A78BFA' },
  { id: 5, label: 'Flow Session', duration: 67, type: 'flexible', time: '2 days ago', color: ACCENT },
];

const insights = [
  { icon: <Sun size={14} />, text: 'You focus best between 9–11am', color: '#F59E0B' },
  { icon: <Zap size={14} />, text: 'Your average session is 42 minutes', color: ACCENT },
  { icon: <TrendingUp size={14} />, text: 'Focus time up 23% this week', color: '#10B981' },
  { icon: <Moon size={14} />, text: 'You rarely work after 8pm — healthy!', color: '#8B5CF6' },
];

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
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipItem[];
  label?: string;
};

// Custom tooltip for charts
function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
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
      <p style={{ fontSize: 12, color: MUTED, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ fontSize: 14, fontWeight: 600, color: TEXT }}>
          {p.value}
          <span style={{ fontWeight: 400, color: MUTED, fontSize: 11 }}> min</span>
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
        stroke="rgba(255,255,255,0.06)"
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

export function StatsPage() {
  const [view, setView] = useState<'week' | 'month'>('week');

  const totalWeekFocus = weeklyData.reduce((a, d) => a + d.focus, 0);
  const totalWeekSessions = weeklyData.reduce((a, d) => a + d.sessions, 0);
  const todayFocus = weeklyData[4].focus; // Friday = today
  const dailyGoal = 120;
  const goalProgress = todayFocus / dailyGoal;
  const streak = 12;
  const avgSession = Math.round(totalWeekFocus / totalWeekSessions);
  const deepWorkSessions = 8;

  const chartData = view === 'week' ? weeklyData : monthlyData.map((d) => ({ day: `${d.day}`, focus: d.focus }));

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
          <p style={{ fontSize: 14, color: MUTED }}>Monday, April 13, 2026</p>
        </motion.div>

        {/* Stat cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 14,
            marginBottom: 32,
          }}
        >
          <StatCard
            icon={<Clock size={16} />}
            label="Today's Focus"
            value={`${todayFocus}m`}
            sub={`${Math.round((todayFocus / 60) * 10) / 10}h out of ${dailyGoal / 60}h goal`}
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
            value={`${Math.round(totalWeekFocus / 60 * 10) / 10}h`}
            sub={`${totalWeekSessions} sessions`}
            accent="#10B981"
            delay={0.1}
          />
          <StatCard
            icon={<Target size={16} />}
            label="Avg Session"
            value={`${avgSession}m`}
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
            gridTemplateColumns: '1fr 260px',
            gap: 16,
            marginBottom: 24,
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
                <p style={{ fontSize: 12, color: MUTED }}>Minutes per day</p>
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
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: MUTED }} />
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
                  ? '🎉 Goal reached!'
                  : `${dailyGoal - todayFocus} min to go`}
              </p>
            </div>

            {/* Daily bar mini chart */}
            <div style={{ width: '100%' }}>
              <p style={{ fontSize: 11, color: MUTED, marginBottom: 8, fontWeight: 500 }}>WEEK OVERVIEW</p>
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 40 }}>
                {weeklyData.map((d, i) => {
                  const h = (d.focus / 210) * 40;
                  const isToday = i === 4;
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
                {weeklyData.map((d, i) => (
                  <p
                    key={d.day}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontSize: 9,
                      color: i === 4 ? '#A78BFA' : MUTED,
                      fontWeight: i === 4 ? 700 : 400,
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
            gridTemplateColumns: '1fr 1fr',
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
                    <p style={{ fontSize: 10, color: MUTED, textTransform: 'capitalize' }}>
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
                {insights.map((insight, i) => (
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
                  3h 42m
                </p>
                <p style={{ fontSize: 12, color: MUTED }}>Wednesday, March 18</p>
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
                {[
                  { h: '6am', v: 0.1 },
                  { h: '7am', v: 0.2 },
                  { h: '8am', v: 0.45 },
                  { h: '9am', v: 0.9 },
                  { h: '10am', v: 1 },
                  { h: '11am', v: 0.85 },
                  { h: '12pm', v: 0.5 },
                  { h: '1pm', v: 0.3 },
                  { h: '2pm', v: 0.65 },
                  { h: '3pm', v: 0.75 },
                  { h: '4pm', v: 0.7 },
                  { h: '5pm', v: 0.4 },
                  { h: '6pm', v: 0.2 },
                  { h: '7pm', v: 0.15 },
                ].map(({ h, v }) => (
                  <motion.div
                    key={h}
                    title={h}
                    initial={{ height: 0 }}
                    animate={{ height: v * 48 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{
                      flex: 1,
                      borderRadius: 3,
                      background:
                        v > 0.8
                          ? ACCENT
                          : v > 0.5
                          ? 'rgba(124,92,252,0.45)'
                          : 'rgba(124,92,252,0.18)',
                      cursor: 'default',
                    }}
                  />
                ))}
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

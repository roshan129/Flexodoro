/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusAudioEngine } from "@/features/music/hooks/use-focus-audio-engine";
import { saveSession } from "@/lib/session";
import { useAppStore } from "@/store/use-app-store";
import type { MusicTrackId } from "@/store/use-app-store";
import {
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Music2,
  X,
  Volume2,
  VolumeX,
  Waves,
  Wind,
  Music,
  Flag,
  SkipForward,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const SURFACE = 'var(--surface)';
const SURFACE2 = 'var(--surface-2)';
const BORDER = 'var(--border)';
const ACCENT = '#7C5CFC';
const BREAK_COLOR = '#10B981';
const TEXT = 'var(--foreground)';
const MUTED = 'var(--muted)';
const FONT_DISPLAY = "'Space Grotesk', sans-serif";

const WORK_DURATIONS = { '25/5': 25 * 60, '40/10': 40 * 60 } as const;
const BREAK_DURATIONS = { '25/5': 5 * 60, '40/10': 10 * 60 } as const;
const FLEX_LOOP = 25 * 60;
const MODE_STORAGE_KEY = 'flexodoro.timer.mode';

const RING_RADIUS = 130;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

type Mode = 'fixed' | 'flexible';
type Preset = '25/5' | '40/10';
type Phase = 'idle' | 'work' | 'break';

type TimerTiming = {
  startedAtMs: number | null;
  pausedAtMs: number | null;
  accumulatedPausedMs: number;
  durationSeconds: number | null;
};

type Sound = { id: string; label: string; icon: ReactNode; color: string };
const SOUNDS: Sound[] = [
  { id: 'rain', label: 'Rain', icon: <Waves size={16} />, color: '#06B6D4' },
  { id: 'white', label: 'White Noise', icon: <Wind size={16} />, color: '#8B5CF6' },
  { id: 'ambient', label: 'Ambient', icon: <Music size={16} />, color: '#10B981' },
];

const SOUND_TO_TRACK: Record<string, MusicTrackId> = {
  rain: "soft-rain",
  white: "alpha-pulse",
  ambient: "deep-focus",
};

const TRACK_TO_SOUND: Record<MusicTrackId, string> = {
  "deep-focus": "ambient",
  "soft-rain": "rain",
  "alpha-pulse": "white",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatTime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function calcSuggestedBreak(workedSeconds: number): number {
  const mins = workedSeconds / 60;
  const breakMins = Math.round(mins / 5);
  return Math.max(1, Math.min(30, breakMins)) * 60;
}

function getElapsedSecondsFromTiming(timing: TimerTiming, atMs = Date.now()) {
  const { startedAtMs, pausedAtMs, accumulatedPausedMs } = timing;
  if (startedAtMs === null) {
    return 0;
  }

  const effectiveNow = pausedAtMs ?? atMs;
  return Math.max(0, Math.floor((effectiveNow - startedAtMs - accumulatedPausedMs) / 1000));
}

function getDisplaySecondsFromTiming({
  timing,
  atMs,
  phase,
  mode,
  preset,
  breakDur,
}: {
  timing: TimerTiming;
  atMs: number;
  phase: Phase;
  mode: Mode;
  preset: Preset;
  breakDur: number;
}) {
  if (phase === 'idle') {
    return mode === 'fixed' ? WORK_DURATIONS[preset] : 0;
  }

  const elapsedSeconds = getElapsedSecondsFromTiming(timing, atMs);
  const durationSeconds =
    timing.durationSeconds ??
    (phase === 'break' ? breakDur : mode === 'fixed' ? WORK_DURATIONS[preset] : null);

  if (phase === 'work' && mode === 'flexible') {
    return elapsedSeconds;
  }

  return Math.max(0, (durationSeconds ?? 0) - elapsedSeconds);
}

function getWorkedSecondsFromTiming({
  timing,
  atMs,
  phase,
  mode,
  preset,
}: {
  timing: TimerTiming;
  atMs: number;
  phase: Phase;
  mode: Mode;
  preset: Preset;
}) {
  if (phase !== 'work') {
    return 0;
  }

  const elapsedSeconds = getElapsedSecondsFromTiming(timing, atMs);
  return mode === 'fixed' ? Math.min(WORK_DURATIONS[preset], elapsedSeconds) : elapsedSeconds;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Progress ring SVG */
function ProgressRing({ progress, color }: { progress: number; color: string }) {
  const offset = RING_CIRC * (1 - Math.min(1, Math.max(0, progress)));

  return (
    <svg
      width="300"
      height="300"
      viewBox="0 0 300 300"
      style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
    >
      {/* Track */}
      <circle
        cx="150"
        cy="150"
        r={RING_RADIUS}
        fill="none"
        stroke="var(--subtle-fill-strong)"
        strokeWidth="5"
      />
      {/* Glow ring (behind) */}
      <circle
        cx="150"
        cy="150"
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRC}
        strokeDashoffset={offset}
        opacity={0.15}
        style={{ filter: `blur(8px)` }}
      />
      {/* Main progress arc */}
      <motion.circle
        cx="150"
        cy="150"
        r={RING_RADIUS}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={RING_CIRC}
        initial={{ strokeDashoffset: RING_CIRC }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ filter: `drop-shadow(0 0 10px ${color}80)` }}
      />
      {/* Dot at the tip */}
      {progress > 0.01 && (
        <motion.circle
          cx={150 + RING_RADIUS * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
          cy={150 + RING_RADIUS * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
          r="4"
          fill={color}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          animate={{
            cx: 150 + RING_RADIUS * Math.cos(2 * Math.PI * progress - Math.PI / 2),
            cy: 150 + RING_RADIUS * Math.sin(2 * Math.PI * progress - Math.PI / 2),
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}

/** Break Modal */
function BreakModal({
  workedSeconds,
  breakSeconds,
  onStartBreak,
  onSkip,
}: {
  workedSeconds: number;
  breakSeconds: number;
  onStartBreak: () => void;
  onSkip: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          background: SURFACE,
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          padding: 40,
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'rgba(16,185,129,0.12)',
            border: '1px solid rgba(16,185,129,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <Flag size={24} color="#10B981" />
        </div>

        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 22,
            fontWeight: 700,
            color: TEXT,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          Session Complete
        </h2>
        <p style={{ fontSize: 14, color: MUTED, marginBottom: 32, lineHeight: 1.6 }}>
          Great work! Here's your session summary.
        </p>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              background: SURFACE2,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: '16px',
            }}
          >
            <p style={{ fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 500 }}>YOU WORKED FOR</p>
            <p
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 24,
                fontWeight: 700,
                color: TEXT,
                letterSpacing: '-0.03em',
              }}
            >
              {formatTime(workedSeconds)}
            </p>
          </div>
          <div
            style={{
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: 12,
              padding: '16px',
            }}
          >
            <p style={{ fontSize: 11, color: MUTED, marginBottom: 6, fontWeight: 500 }}>SUGGESTED BREAK</p>
            <p
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 24,
                fontWeight: 700,
                color: '#10B981',
                letterSpacing: '-0.03em',
              }}
            >
              {formatTime(breakSeconds)}
            </p>
          </div>
        </div>

        {/* Formula */}
        <div
          style={{
            background: 'rgba(124,92,252,0.06)',
            border: '1px solid rgba(124,92,252,0.15)',
            borderRadius: 10,
            padding: '10px 16px',
            marginBottom: 28,
            fontSize: 12,
            color: '#A78BFA',
          }}
        >
          {Math.round(workedSeconds / 60)} min work ÷ 5 = {Math.round(breakSeconds / 60)} min break
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartBreak}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 12,
              background: BREAK_COLOR,
              border: 'none',
              color: 'white',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(16,185,129,0.3)',
            }}
          >
            Start Break
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSkip}
            style={{
              flex: 1,
              padding: '13px',
              borderRadius: 12,
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              color: MUTED,
              fontSize: 14,
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <SkipForward size={14} />
            Skip Break
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ModeSwitchConfirmModal({
  targetMode,
  workedSeconds,
  onConfirm,
  onCancel,
}: {
  targetMode: Mode;
  workedSeconds: number;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 110,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32 }}
        style={{
          background: SURFACE,
          border: `1px solid ${BORDER}`,
          borderRadius: 20,
          padding: 32,
          maxWidth: 420,
          width: '100%',
          boxShadow: '0 36px 80px rgba(0,0,0,0.7)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(124,92,252,0.12)',
            border: '1px solid rgba(124,92,252,0.24)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 22px',
            color: ACCENT,
          }}
        >
          <Flag size={22} />
        </div>

        <h2
          style={{
            fontFamily: FONT_DISPLAY,
            fontSize: 22,
            fontWeight: 700,
            color: TEXT,
            marginBottom: 8,
            letterSpacing: '-0.02em',
          }}
        >
          Switch mode?
        </h2>
        <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.6, marginBottom: 26 }}>
          Switching mode will end your current session.
        </p>

        <div
          style={{
            background: SURFACE2,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 14,
            marginBottom: 26,
          }}
        >
          <p style={{ fontSize: 11, color: MUTED, fontWeight: 600, marginBottom: 5 }}>
            CURRENT SESSION
          </p>
          <p
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: '-0.03em',
            }}
          >
            {formatTime(workedSeconds)}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: `1px solid ${BORDER}`,
              background: 'var(--subtle-fill)',
              color: MUTED,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              background: ACCENT,
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(124,92,252,0.35)',
            }}
          >
            Switch to {targetMode === 'fixed' ? 'Fixed' : 'Flexible'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Focus Music Panel */
function MusicPanel({
  onClose,
  activeSound,
  setActiveSound,
  volume,
  setVolume,
  autoPlay,
  setAutoPlay,
}: {
  onClose: () => void;
  activeSound: string | null;
  setActiveSound: (id: string | null) => void;
  volume: number;
  setVolume: (v: number) => void;
  autoPlay: boolean;
  setAutoPlay: (v: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20, scale: 0.97 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'fixed',
        top: '50%',
        right: 24,
        transform: 'translateY(-50%)',
        width: 260,
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
        padding: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        zIndex: 40,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Music2 size={14} color={ACCENT} />
          <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Focus Sounds</span>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            border: 'none',
            background: 'var(--subtle-fill-strong)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: MUTED,
          }}
        >
          <X size={12} />
        </button>
      </div>

      {/* Sound options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
        {SOUNDS.map((sound) => {
          const isActive = activeSound === sound.id;
          return (
            <motion.button
              key={sound.id}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveSound(isActive ? null : sound.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 10,
                border: isActive ? `1px solid ${sound.color}40` : `1px solid transparent`,
                background: isActive ? `${sound.color}12` : 'var(--subtle-fill)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: `${sound.color}18`,
                  border: `1px solid ${sound.color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: sound.color,
                  flexShrink: 0,
                }}
              >
                {sound.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: isActive ? TEXT : MUTED }}>{sound.label}</p>
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{ display: 'flex', alignItems: 'center', gap: 2 }}
                >
                  {[1, 2, 3].map((b) => (
                    <motion.div
                      key={b}
                      animate={{ height: [6, 14, 6] }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: b * 0.15,
                        ease: 'easeInOut',
                      }}
                      style={{
                        width: 3,
                        height: 6,
                        borderRadius: 2,
                        background: sound.color,
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Volume */}
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 11, color: MUTED, fontWeight: 500 }}>VOLUME</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: MUTED }}>
            {volume === 0 ? <VolumeX size={12} /> : <Volume2 size={12} />}
            <span style={{ fontSize: 11 }}>{Math.round(volume * 100)}%</span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: 4,
            accentColor: ACCENT,
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Auto-play toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 12px',
          background: 'var(--subtle-fill)',
          borderRadius: 10,
          border: `1px solid ${BORDER}`,
        }}
      >
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Auto-play on start</span>
        <button
          onClick={() => setAutoPlay(!autoPlay)}
          style={{
            width: 36,
            height: 20,
            borderRadius: 10,
            border: 'none',
            background: autoPlay ? ACCENT : 'rgba(255,255,255,0.1)',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background 0.2s ease',
            flexShrink: 0,
          }}
        >
          <motion.div
            animate={{ x: autoPlay ? 18 : 2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'absolute',
              top: 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'white',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}
          />
        </button>
      </div>

      {/* Now playing note */}
      {activeSound && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            marginTop: 12,
            fontSize: 11,
            color: MUTED,
            textAlign: 'center',
          }}
        >
          🎵 Playing {SOUNDS.find((s) => s.id === activeSound)?.label}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Deep Work overlay */
function DeepWorkOverlay({
  time,
  phase,
  progress,
  color,
  label,
  onExit,
}: {
  time: number;
  phase: Phase;
  progress: number;
  color: string;
  label: string;
  onExit: () => void;
}) {
  const [showHint, setShowHint] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: '#05050C',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
      }}
      onMouseMove={() => {
        setShowHint(true);
        const t = setTimeout(() => setShowHint(false), 2000);
        return () => clearTimeout(t);
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at center, ${color}08 0%, transparent 60%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Timer */}
      <div style={{ position: 'relative', width: 340, height: 340 }}>
        <ProgressRing progress={progress} color={color} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <motion.span
            key={time}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: phase === 'idle' ? 52 : time >= 3600 ? 44 : 68,
              fontWeight: 700,
              color: TEXT,
              letterSpacing: '-0.04em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatTime(time)}
          </motion.span>
          <span style={{ fontSize: 13, color: MUTED, fontWeight: 500 }}>{label}</span>
        </div>
      </div>

      {/* Exit hint */}
      <AnimatePresence>
        {showHint && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onExit}
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              border: `1px solid ${BORDER}`,
              background: 'rgba(255,255,255,0.05)',
              color: MUTED,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            <Minimize2 size={13} />
            Exit Deep Work
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function TimerScreen() {
  useFocusAudioEngine();

  const mode = useAppStore((state) => state.mode);
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const isMusicPlaying = useAppStore((state) => state.isMusicPlaying);
  const musicVolume = useAppStore((state) => state.musicVolume);
  const setStoreMode = useAppStore((state) => state.setMode);
  const setSelectedTrackId = useAppStore((state) => state.setSelectedTrackId);
  const setMusicPlaying = useAppStore((state) => state.setMusicPlaying);
  const setMusicVolume = useAppStore((state) => state.setMusicVolume);

  const [preset, setPreset] = useState<Preset>('25/5');
  const [phase, setPhase] = useState<Phase>('idle');
  const [paused, setPaused] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [breakDur, setBreakDur] = useState(0);
  const [showBreakModal, setShowBreakModal] = useState(false);
  const [deepWork, setDeepWork] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [pendingMode, setPendingMode] = useState<Mode | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [completedSessions, setCompletedSessions] = useState(0);
  const defaultTitleRef = useRef<string>("Flexodoro");
  const intervalRef = useRef<number | null>(null);
  const [timing, setTiming] = useState<TimerTiming>({
    startedAtMs: null,
    pausedAtMs: null,
    accumulatedPausedMs: 0,
    durationSeconds: null,
  });
  const timingRef = useRef<TimerTiming>({
    startedAtMs: null,
    pausedAtMs: null,
    accumulatedPausedMs: 0,
    durationSeconds: null,
  });
  const isTransitioningRef = useRef(false);
  const tapSoundRef = useRef<HTMLAudioElement | null>(null);
  const bellSoundRef = useRef<HTMLAudioElement | null>(null);

  const setTimingSnapshot = useCallback((nextTiming: TimerTiming) => {
    timingRef.current = nextTiming;
    setTiming(nextTiming);
  }, []);

  const resetTiming = useCallback((nextNow = Date.now()) => {
    setTimingSnapshot({
      startedAtMs: null,
      pausedAtMs: null,
      accumulatedPausedMs: 0,
      durationSeconds: null,
    });
    setNowMs(nextNow);
  }, [setTimingSnapshot]);

  const startPhaseTiming = useCallback((durationSeconds: number | null, nextNow = Date.now()) => {
    setTimingSnapshot({
      startedAtMs: nextNow,
      pausedAtMs: null,
      accumulatedPausedMs: 0,
      durationSeconds,
    });
    setNowMs(nextNow);
  }, [setTimingSnapshot]);

  const pauseTiming = useCallback((nextNow = Date.now()) => {
    if (timingRef.current.startedAtMs === null || timingRef.current.pausedAtMs !== null) {
      return;
    }

    setTimingSnapshot({
      ...timingRef.current,
      pausedAtMs: nextNow,
    });
    setNowMs(nextNow);
  }, [setTimingSnapshot]);

  const resumeTiming = useCallback((nextNow = Date.now()) => {
    const { pausedAtMs } = timingRef.current;
    if (pausedAtMs === null) {
      return;
    }

    setTimingSnapshot({
      ...timingRef.current,
      pausedAtMs: null,
      accumulatedPausedMs:
        timingRef.current.accumulatedPausedMs + Math.max(0, nextNow - pausedAtMs),
    });
    setNowMs(nextNow);
  }, [setTimingSnapshot]);

  const getElapsedSeconds = useCallback((atMs = Date.now()) => {
    return getElapsedSecondsFromTiming(timingRef.current, atMs);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedMode = window.localStorage.getItem(MODE_STORAGE_KEY);

    if (savedMode !== 'fixed' && savedMode !== 'flexible') {
      return;
    }

    if (mode === 'fixed' && savedMode !== mode) {
      const frame = window.requestAnimationFrame(() => {
        setStoreMode(savedMode);
        resetTiming();
      });
      window.localStorage.removeItem(MODE_STORAGE_KEY);
      return () => window.cancelAnimationFrame(frame);
    }

    window.localStorage.removeItem(MODE_STORAGE_KEY);
  }, [mode, resetTiming, setStoreMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    defaultTitleRef.current = document.title;

    tapSoundRef.current = new Audio('/sounds/tap_notification.mp3');
    tapSoundRef.current.preload = 'auto';

    bellSoundRef.current = new Audio('/sounds/bell_break_long_tone.mp3');
    bellSoundRef.current.preload = 'auto';
  }, []);

  const playTapSound = useCallback(() => {
    const tap = tapSoundRef.current;
    if (!tap) return;

    tap.currentTime = 0;
    void tap.play().catch(() => {
      // Ignore browser autoplay/gesture blocks.
    });
  }, []);

  const playBellSound = useCallback(() => {
    const bell = bellSoundRef.current;
    if (!bell) return;

    bell.currentTime = 0;
    void bell.play().catch(() => {
      // Ignore browser autoplay/gesture blocks.
    });
  }, []);

  const isTimerRunning = phase !== 'idle' && !paused;
  const activeSound = isMusicPlaying ? TRACK_TO_SOUND[selectedTrackId] : null;

  useEffect(() => {
    useAppStore.setState({
      status: isTimerRunning ? "running" : phase === "idle" ? "idle" : "paused",
    });
  }, [isTimerRunning, phase]);

  useEffect(() => {
    if (!isTimerRunning) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isTimerRunning]);

  const handleCloseMusicPanel = useCallback(() => {
    setMusicOpen(false);

    if (!isTimerRunning) {
      setMusicPlaying(false);
    }
  }, [isTimerRunning, setMusicPlaying]);

  useEffect(() => {
    if (phase === 'break' && isMusicPlaying) {
      setMusicPlaying(false);
    }
  }, [phase, isMusicPlaying, setMusicPlaying]);

  useEffect(() => {
    if (!feedbackMessage) return;

    const timeout = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 3200);

    return () => window.clearTimeout(timeout);
  }, [feedbackMessage]);

  const getWorkedSeconds = useCallback(() => {
    return getWorkedSecondsFromTiming({
      timing: timingRef.current,
      atMs: Date.now(),
      phase,
      mode,
      preset,
    });
  }, [mode, phase, preset]);

  const persistWorkSession = useCallback((workedSeconds: number, endedAtMs = Date.now()) => {
    if (workedSeconds <= 0) {
      return;
    }

    const startedAt = new Date(endedAtMs - workedSeconds * 1000);
    const endedAt = new Date(endedAtMs);

    void saveSession({
      mode: mode === "fixed" ? "FIXED" : "FLEXIBLE",
      type: "WORK",
      durationSec: workedSeconds,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
    });
  }, [mode]);

  const refreshTimer = useCallback(() => {
    const nextNow = Date.now();
    setNowMs(nextNow);

    if (phase === 'idle' || paused || isTransitioningRef.current) {
      return;
    }

    const durationSeconds =
      timingRef.current.durationSeconds ??
      (phase === 'break' ? breakDur : mode === 'fixed' ? WORK_DURATIONS[preset] : null);

    if (durationSeconds === null) {
      return;
    }

    if (getElapsedSeconds(nextNow) < durationSeconds) {
      return;
    }

    isTransitioningRef.current = true;

    if (phase === 'work' && mode === 'fixed') {
      persistWorkSession(WORK_DURATIONS[preset], nextNow);
      const nextBreakDuration = BREAK_DURATIONS[preset];
      setBreakDur(nextBreakDuration);
      pauseTiming(nextNow);
      setPaused(true);
      setShowBreakModal(true);
      setMusicPlaying(false);
      setCompletedSessions((c) => c + 1);
      playBellSound();
    } else if (phase === 'break') {
      resetTiming(nextNow);
      setPhase('idle');
      setPaused(false);
      playBellSound();
    }

    window.setTimeout(() => {
      isTransitioningRef.current = false;
    }, 0);
  }, [breakDur, getElapsedSeconds, mode, pauseTiming, paused, phase, playBellSound, persistWorkSession, preset, resetTiming, setMusicPlaying]);

  // ─── Timer tick ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase === 'idle' || paused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    const initialRefreshId = window.setTimeout(refreshTimer, 0);
    intervalRef.current = window.setInterval(refreshTimer, 1000);
    window.addEventListener('focus', refreshTimer);
    document.addEventListener('visibilitychange', refreshTimer);

    return () => {
      window.clearTimeout(initialRefreshId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      window.removeEventListener('focus', refreshTimer);
      document.removeEventListener('visibilitychange', refreshTimer);
    };
  }, [phase, paused, refreshTimer]);

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    playTapSound();
    startPhaseTiming(mode === 'fixed' ? WORK_DURATIONS[preset] : null);
    setPhase('work');
    setPaused(false);
    if (autoPlay && !isMusicPlaying) {
      setMusicPlaying(true);
    }
  }, [mode, preset, autoPlay, isMusicPlaying, setMusicPlaying, playTapSound, startPhaseTiming]);

  const handlePause = useCallback(() => {
    playTapSound();
    pauseTiming();
    setPaused(true);
    setMusicPlaying(false);
  }, [pauseTiming, setMusicPlaying, playTapSound]);
  const handleResume = useCallback(() => {
    playTapSound();
    resumeTiming();
    setPaused(false);
    if (autoPlay) {
      setMusicPlaying(true);
    }
  }, [autoPlay, resumeTiming, setMusicPlaying, playTapSound]);

  const handleStop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setPhase('idle');
    setPaused(false);
    resetTiming();
    setMusicPlaying(false);
  }, [resetTiming, setMusicPlaying]);

  const handleEndSession = useCallback(() => {
    playTapSound();
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    const worked = getWorkedSeconds();

    if (worked < 3 * 60) {
      handleStop();
      return;
    }

    const suggested = calcSuggestedBreak(worked);
    persistWorkSession(worked);
    setBreakDur(suggested);
    pauseTiming();
    setPaused(true);
    setShowBreakModal(true);
    setMusicPlaying(false);
    setCompletedSessions((c) => c + 1);
  }, [getWorkedSeconds, handleStop, pauseTiming, persistWorkSession, setMusicPlaying, playTapSound]);

  const handleStartBreak = useCallback(() => {
    setShowBreakModal(false);
    setPhase('break');
    startPhaseTiming(breakDur);
    setPaused(false);
    setMusicPlaying(false);
  }, [breakDur, setMusicPlaying, startPhaseTiming]);

  const handleSkipBreak = useCallback(() => {
    setShowBreakModal(false);
    handleStop();
  }, [handleStop]);

  // ─── Keyboard shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const hasBlockingModal = showBreakModal || pendingMode;

      if (e.code === 'Space' && !hasBlockingModal) {
        e.preventDefault();
        if (phase === 'idle') {
          playTapSound();
          startPhaseTiming(mode === 'fixed' ? WORK_DURATIONS[preset] : null);
          setPhase('work');
          setPaused(false);
          if (autoPlay && !isMusicPlaying) {
            setMusicPlaying(true);
          }
        } else if (paused) {
          playTapSound();
          resumeTiming();
          setPaused(false);
          if (autoPlay) {
            setMusicPlaying(true);
          }
        } else {
          playTapSound();
          pauseTiming();
          setPaused(true);
          setMusicPlaying(false);
        }
      }

      if (e.key.toLowerCase() === 'e' && !hasBlockingModal && phase === 'work') {
        e.preventDefault();
        handleEndSession();
      }

      if (e.key === 'Escape') {
        if (deepWork) setDeepWork(false);
        if (musicOpen) handleCloseMusicPanel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [
    showBreakModal,
    pendingMode,
    phase,
    paused,
    deepWork,
    musicOpen,
    mode,
    preset,
    autoPlay,
    isMusicPlaying,
    setMusicPlaying,
    handleCloseMusicPanel,
    handleEndSession,
    playTapSound,
    pauseTiming,
    resumeTiming,
    startPhaseTiming,
  ]);

  const handleSetActiveSound = useCallback((id: string | null) => {
    if (id === null) {
      setMusicPlaying(false);
      return;
    }

    const mappedTrack = SOUND_TO_TRACK[id] ?? "deep-focus";
    setSelectedTrackId(mappedTrack);
    setMusicPlaying(phase !== 'break');
  }, [phase, setMusicPlaying, setSelectedTrackId]);

  const completeModeSwitch = useCallback((nextMode: Mode) => {
    const worked = getWorkedSeconds();

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setShowBreakModal(false);
    setPendingMode(null);
    setPaused(false);
    setPhase('idle');
    setStoreMode(nextMode);
    resetTiming();
    setBreakDur(0);
    setDeepWork(false);
    setMusicOpen(false);
    setMusicPlaying(false);
    setFeedbackMessage(
      worked > 0
        ? `Session ended at ${formatTime(worked)}.`
        : 'Session ended.',
    );
  }, [getWorkedSeconds, resetTiming, setMusicPlaying, setStoreMode]);

  const handleModeSwitch = (m: Mode) => {
    if (mode === m) return;

    if (isTimerRunning) {
      setPendingMode(m);
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setShowBreakModal(false);
    setPaused(false);
    setPhase('idle');
    setStoreMode(m);
    resetTiming();
  };

  const handlePresetSwitch = (p: Preset) => {
    if (phase !== 'idle') return;
    setPreset(p);
    resetTiming();
  };

  // ─── Computed values ─────────────────────────────────────────────────────────
  const ringColor = phase === 'break' ? BREAK_COLOR : ACCENT;
  const time = getDisplaySecondsFromTiming({
    timing,
    atMs: nowMs,
    phase,
    mode,
    preset,
    breakDur,
  });
  const workedSeconds = getWorkedSecondsFromTiming({
    timing,
    atMs: nowMs,
    phase,
    mode,
    preset,
  });

  const progress = (() => {
    if (phase === 'idle') return 0;
    if (phase === 'work') {
      if (mode === 'fixed') {
        const total = WORK_DURATIONS[preset];
        return (total - time) / total;
      }
      return (time % FLEX_LOOP) / FLEX_LOOP;
    }
    if (phase === 'break' && breakDur > 0) {
      return (breakDur - time) / breakDur;
    }
    return 0;
  })();

  const sessionLabel = (() => {
    if (phase === 'idle') return paused ? 'Paused' : 'Ready to Focus';
    if (phase === 'work') return mode === 'fixed' ? 'Deep Work' : 'Flow Session';
    if (phase === 'break') return 'Break Time';
    return '';
  })();

  const displayTime = (() => {
    if (phase === 'idle' && mode === 'fixed') return WORK_DURATIONS[preset];
    if (phase === 'idle' && mode === 'flexible') return 0;
    return time;
  })();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const phaseLabel = phase === "break" ? "Break" : "Focus";
    const timerValue = formatTime(displayTime);

    if (phase === "idle") {
      document.title = defaultTitleRef.current;
      return;
    }

    if (paused) {
      document.title = `${timerValue} · ${phaseLabel} (Paused)`;
      return;
    }

    document.title = `${timerValue} · ${phaseLabel}`;

    return () => {
      document.title = defaultTitleRef.current;
    };
  }, [displayTime, paused, phase]);

  return (
    <>
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: '40px 24px',
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        <AnimatePresence>
          {feedbackMessage && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                position: 'fixed',
                top: 76,
                left: 0,
                right: 0,
                width: 'fit-content',
                margin: '0 auto',
                zIndex: 80,
                background: SURFACE,
                border: `1px solid ${BORDER}`,
                borderRadius: 999,
                padding: '10px 16px',
                color: TEXT,
                fontSize: 13,
                fontWeight: 600,
                boxShadow: '0 16px 36px rgba(0,0,0,0.35)',
              }}
            >
              {feedbackMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient glow */}
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 500,
            height: 400,
            background: `radial-gradient(ellipse, ${ringColor}08 0%, transparent 65%)`,
            pointerEvents: 'none',
            transition: 'background 0.5s ease',
          }}
        />

        {/* Mode Toggle */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: 'flex',
            marginBottom: 36,
            background: SURFACE,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            padding: 4,
            gap: 4,
          }}
        >
          {(['flexible', 'fixed'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeSwitch(m)}
              style={{
                padding: '7px 20px',
                borderRadius: 10,
                border: 'none',
                background: mode === m ? ACCENT : 'transparent',
                color: mode === m ? 'white' : MUTED,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                opacity: 1,
                transition: 'all 0.2s ease',
                letterSpacing: '0.02em',
                boxShadow: mode === m ? '0 2px 10px rgba(124,92,252,0.3)' : 'none',
              }}
            >
              {m === 'fixed' ? 'Fixed Mode' : 'Flexible Mode'}
            </button>
          ))}
        </motion.div>

        {/* Session status badge */}
        <motion.div
          key={sessionLabel}
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          {phase === 'work' && (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: ringColor,
                boxShadow: `0 0 8px ${ringColor}`,
              }}
            />
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: phase === 'idle' ? MUTED : phase === 'break' ? '#34D399' : '#A78BFA',
            }}
          >
            {sessionLabel.toUpperCase()}
          </span>
        </motion.div>

        {/* Timer Ring */}
        <div
          style={{
            position: 'relative',
            width: 300,
            height: 300,
            marginBottom: 32,
          }}
        >
          <ProgressRing progress={progress} color={ringColor} />

          {/* Timer number */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={`${Math.floor(displayTime / 60)}`}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontSize: displayTime >= 3600 ? 46 : 72,
                  fontWeight: 700,
                  color: TEXT,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  userSelect: 'none',
                }}
              >
                {formatTime(displayTime)}
              </motion.span>
            </AnimatePresence>

            {/* Preset label for fixed idle */}
            {phase === 'idle' && mode === 'fixed' && (
              <span style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                {preset.split('/')[0]}min focus · {preset.split('/')[1]}min break
              </span>
            )}

            {/* Elapsed for flexible work */}
            {phase === 'work' && mode === 'flexible' && (
              <span style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                elapsed
              </span>
            )}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          {/* Main action button */}
          {phase === 'idle' ? (
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 8px 30px rgba(124,92,252,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                borderRadius: 50,
                border: 'none',
                background: ACCENT,
                color: 'white',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(124,92,252,0.35)',
              }}
            >
              <Play size={16} fill="white" />
              Start Focus
            </motion.button>
          ) : phase === 'break' ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStop}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 50,
                border: `1px solid rgba(16,185,129,0.3)`,
                background: 'rgba(16,185,129,0.1)',
                color: '#34D399',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <SkipForward size={15} />
              Skip Break
            </motion.button>
          ) : (
            <>
              {/* Pause / Resume */}
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                onClick={paused ? handleResume : handlePause}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  border: `1px solid ${BORDER}`,
                  background: SURFACE2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: TEXT,
                }}
              >
                {paused ? <Play size={20} fill={TEXT} /> : <Pause size={20} />}
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleEndSession}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '12px 22px',
                  borderRadius: 50,
                  border: `1px solid rgba(124,92,252,0.3)`,
                  background: 'rgba(124,92,252,0.1)',
                  color: '#A78BFA',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Flag size={14} />
                End Session
              </motion.button>
            </>
          )}
        </div>

        {/* Preset selector (fixed idle) */}
        <AnimatePresence initial={false}>
          {mode === 'fixed' && phase === 'idle' && (
            <motion.div
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              style={{ display: 'flex', gap: 8 }}
            >
              {(['25/5', '40/10'] as Preset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePresetSwitch(p)}
                  style={{
                    padding: '7px 16px',
                    borderRadius: 8,
                    border: `1px solid ${preset === p ? 'rgba(124,92,252,0.4)' : BORDER}`,
                    background: preset === p ? 'rgba(124,92,252,0.1)' : 'transparent',
                    color: preset === p ? '#A78BFA' : MUTED,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {p} <span style={{ opacity: 0.6 }}>min</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Session counter */}
        {completedSessions > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              marginTop: 28,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {Array.from({ length: Math.min(completedSessions, 8) }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05, type: 'spring' }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i % 4 === 3 ? ACCENT : 'rgba(124,92,252,0.35)',
                  boxShadow: i % 4 === 3 ? `0 0 6px ${ACCENT}` : 'none',
                }}
              />
            ))}
            <span style={{ fontSize: 11, color: MUTED, marginLeft: 4 }}>
              {completedSessions} session{completedSessions !== 1 ? 's' : ''} today
            </span>
          </motion.div>
        )}

        {/* Floating action buttons */}
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            right: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            zIndex: 30,
          }}
        >
          {/* Music toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              if (musicOpen) {
                handleCloseMusicPanel();
                return;
              }

              setMusicOpen(true);
            }}
            title="Focus Music"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: musicOpen
                ? `1px solid rgba(124,92,252,0.4)`
                : `1px solid ${BORDER}`,
              background: musicOpen ? 'rgba(124,92,252,0.15)' : SURFACE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: musicOpen ? ACCENT : MUTED,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              position: 'relative',
            }}
          >
            <Music2 size={17} />
            {activeSound && (
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid var(--background)',
                }}
              />
            )}
          </motion.button>

          {/* Deep work toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setDeepWork(true)}
            title="Deep Work Mode"
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: `1px solid ${BORDER}`,
              background: SURFACE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: MUTED,
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <Maximize2 size={17} />
          </motion.button>
        </div>

        {/* Keyboard shortcut hint */}
        <div
          style={{
            position: 'fixed',
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.12)', fontWeight: 500 }}>
            {phase === 'idle'
              ? 'Press Space to start'
              : phase === 'work'
                ? paused
                  ? 'Press Space to resume · E to end'
                  : 'Press Space to pause · E to end'
                : paused
                  ? 'Press Space to resume'
                  : 'Press Space to pause'}
          </p>
        </div>
      </div>

      {/* Music Panel */}
      <AnimatePresence>
        {musicOpen && (
          <MusicPanel
            onClose={handleCloseMusicPanel}
            activeSound={activeSound}
            setActiveSound={handleSetActiveSound}
            volume={musicVolume}
            setVolume={setMusicVolume}
            autoPlay={autoPlay}
            setAutoPlay={setAutoPlay}
          />
        )}
      </AnimatePresence>

      {/* Break Modal */}
      <AnimatePresence>
        {showBreakModal && (
          <BreakModal
            workedSeconds={workedSeconds}
            breakSeconds={breakDur}
            onStartBreak={handleStartBreak}
            onSkip={handleSkipBreak}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pendingMode && (
          <ModeSwitchConfirmModal
            targetMode={pendingMode}
            workedSeconds={workedSeconds}
            onConfirm={() => completeModeSwitch(pendingMode)}
            onCancel={() => setPendingMode(null)}
          />
        )}
      </AnimatePresence>

      {/* Deep Work Overlay */}
      <AnimatePresence>
        {deepWork && (
          <DeepWorkOverlay
            time={displayTime}
            phase={phase}
            progress={progress}
            color={ringColor}
            label={sessionLabel}
            onExit={() => setDeepWork(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

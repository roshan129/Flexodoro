"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  Bell,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  ChevronRight,
  Check,
  Clock,
  Zap,
  RefreshCw,
  Play,
} from 'lucide-react';

type SoundOption = {
  id: string;
  label: string;
  description: string;
  emoji: string;
};

const SOUND_OPTIONS: SoundOption[] = [
  { id: 'gentle-bell', label: 'Gentle Bell', description: 'Soft, calming bell tone', emoji: '🔔' },
  { id: 'chime', label: 'Crystal Chime', description: 'Clear resonant chime', emoji: '✨' },
  { id: 'ding', label: 'Simple Ding', description: 'Clean notification tone', emoji: '🎵' },
  { id: 'digital', label: 'Digital Beep', description: 'Classic digital alert', emoji: '📳' },
  { id: 'bowl', label: 'Singing Bowl', description: 'Meditative singing bowl', emoji: '🪘' },
  { id: 'none', label: 'Silent', description: 'No sound notification', emoji: '🔕' },
];

type Section = 'timer' | 'notifications' | 'appearance';

function SectionTab({
  id,
  label,
  icon: Icon,
  active,
  onClick,
}: {
  id: Section;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 14px',
        borderRadius: 10,
        background: active ? 'rgba(124, 92, 252, 0.12)' : 'transparent',
        border: active ? '1px solid rgba(124, 92, 252, 0.25)' : '1px solid transparent',
        color: active ? '#A78BFA' : '#888899',
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
        textAlign: 'left',
      }}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#E8E8F0' }}>{label}</div>
        {description && (
          <div style={{ fontSize: 12, color: '#666677', marginTop: 2 }}>{description}</div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 40,
        height: 22,
        borderRadius: 11,
        background: checked ? '#7C5CFC' : 'rgba(255,255,255,0.1)',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          position: 'absolute',
          top: 3,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: 'white',
        }}
      />
    </button>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: '#888899',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        −
      </button>
      <span
        style={{
          minWidth: 52,
          textAlign: 'center',
          fontSize: 14,
          fontWeight: 600,
          color: '#E8E8F0',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
        {unit && (
          <span style={{ fontSize: 11, color: '#666677', fontWeight: 400, marginLeft: 2 }}>
            {unit}
          </span>
        )}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)',
          color: '#888899',
          fontSize: 16,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        +
      </button>
    </div>
  );
}

function VolumeSlider({
  value,
  onChange,
  muted,
  onMute,
}: {
  value: number;
  onChange: (v: number) => void;
  muted: boolean;
  onMute: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <button
        onClick={() => onMute(!muted)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: muted ? '#666677' : '#A78BFA',
          padding: 0,
          display: 'flex',
        }}
      >
        {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={muted ? 0 : value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 100,
          accentColor: '#7C5CFC',
          cursor: 'pointer',
        }}
      />
      <span style={{ fontSize: 12, color: '#666677', minWidth: 28, textAlign: 'right' }}>
        {muted ? 0 : value}%
      </span>
    </div>
  );
}

// ─── Timer Settings ───────────────────────────────────────────────────────────

function TimerSettings() {
  const [workDuration, setWorkDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [longBreakInterval, setLongBreakInterval] = useState(4);
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);
  const [autoStartSessions, setAutoStartSessions] = useState(false);
  const [saved, setSaved] = useState(false);

  const presets = [
    { label: 'Classic', work: 25, short: 5, long: 15 },
    { label: 'Deep Work', work: 40, short: 10, long: 20 },
    { label: 'Power Hour', work: 50, short: 10, long: 30 },
    { label: 'Sprint', work: 15, short: 3, long: 10 },
  ];

  function applyPreset(p: (typeof presets)[0]) {
    setWorkDuration(p.work);
    setShortBreak(p.short);
    setLongBreak(p.long);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      {/* Presets */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Quick Presets
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                background:
                  workDuration === p.work && shortBreak === p.short
                    ? 'rgba(124, 92, 252, 0.15)'
                    : 'rgba(255,255,255,0.04)',
                color:
                  workDuration === p.work && shortBreak === p.short ? '#A78BFA' : '#888899',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {p.label}
              <span style={{ fontSize: 10, marginLeft: 6, opacity: 0.6 }}>
                {p.work}/{p.short}m
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SettingRow label="Work Duration" description="Length of each focus session">
          <NumberStepper value={workDuration} onChange={setWorkDuration} min={5} max={90} unit="min" />
        </SettingRow>
        <SettingRow label="Short Break" description="Break after each session">
          <NumberStepper value={shortBreak} onChange={setShortBreak} min={1} max={30} unit="min" />
        </SettingRow>
        <SettingRow label="Long Break" description="Extended break after several sessions">
          <NumberStepper value={longBreak} onChange={setLongBreak} min={5} max={60} unit="min" />
        </SettingRow>
        <SettingRow
          label="Long Break Interval"
          description="Number of sessions before a long break"
        >
          <NumberStepper
            value={longBreakInterval}
            onChange={setLongBreakInterval}
            min={2}
            max={8}
            unit="sessions"
          />
        </SettingRow>
        <SettingRow label="Auto-start Breaks" description="Automatically begin break when session ends">
          <Toggle checked={autoStartBreaks} onChange={setAutoStartBreaks} />
        </SettingRow>
        <SettingRow
          label="Auto-start Sessions"
          description="Automatically begin next session after break"
        >
          <Toggle checked={autoStartSessions} onChange={setAutoStartSessions} />
        </SettingRow>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{
            padding: '10px 24px',
            borderRadius: 10,
            background: saved ? 'rgba(52, 211, 153, 0.15)' : 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
            border: saved ? '1px solid rgba(52, 211, 153, 0.3)' : 'none',
            color: saved ? '#34D399' : 'white',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
        >
          {saved ? <Check size={14} /> : <RefreshCw size={14} />}
          {saved ? 'Saved!' : 'Save Timer Settings'}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Notification Settings ────────────────────────────────────────────────────

function NotificationSettings() {
  const [browserNotifs, setBrowserNotifs] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedSound, setSelectedSound] = useState('gentle-bell');
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>('default');

  async function requestNotifPermission() {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === 'granted') setBrowserNotifs(true);
  }

  function playPreview(soundId: string) {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const freqs: Record<string, number[]> = {
      'gentle-bell': [523, 659, 784],
      chime: [880, 1047, 1175],
      ding: [1047, 1047],
      digital: [800, 1000, 800],
      bowl: [220, 330, 440],
      none: [],
    };
    const notes = freqs[soundId] || [523];
    if (!notes.length) return;
    const vol = muted ? 0 : volume / 100;
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.frequency.value = freq;
      o.type = soundId === 'digital' ? 'square' : 'sine';
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      g.gain.linearRampToValueAtTime(vol * 0.4, ctx.currentTime + i * 0.18 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.6);
      o.start(ctx.currentTime + i * 0.18);
      o.stop(ctx.currentTime + i * 0.18 + 0.7);
    });
    osc.disconnect();
  }

  return (
    <div>
      {/* Browser Notifications */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Browser Notifications
        </div>
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: '#E8E8F0', fontWeight: 500 }}>
              Timer completion alerts
            </div>
            <div style={{ fontSize: 12, color: '#666677', marginTop: 2 }}>
              {notifPermission === 'denied'
                ? 'Permission denied — enable in browser settings'
                : notifPermission === 'granted'
                ? 'Permission granted'
                : 'Click to grant permission'}
            </div>
          </div>
          {notifPermission === 'granted' ? (
            <Toggle checked={browserNotifs} onChange={setBrowserNotifs} />
          ) : (
            <button
              onClick={requestNotifPermission}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                background: 'rgba(124, 92, 252, 0.15)',
                border: '1px solid rgba(124, 92, 252, 0.3)',
                color: '#A78BFA',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Enable
            </button>
          )}
        </div>
      </div>

      {/* Sound */}
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Timer Sound
        </div>
      </div>

      <SettingRow label="Sound Notifications" description="Play a sound when timer completes">
        <Toggle checked={soundEnabled} onChange={setSoundEnabled} />
      </SettingRow>
      <SettingRow label="Volume" description="Notification sound volume">
        <VolumeSlider value={volume} onChange={setVolume} muted={muted} onMute={setMuted} />
      </SettingRow>

      {/* Sound picker */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Notification Sound
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {SOUND_OPTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSound(s.id);
                if (s.id !== 'none' && soundEnabled) playPreview(s.id);
              }}
              style={{
                padding: '12px 14px',
                borderRadius: 10,
                border:
                  selectedSound === s.id
                    ? '1px solid rgba(124, 92, 252, 0.4)'
                    : '1px solid rgba(255,255,255,0.07)',
                background:
                  selectedSound === s.id
                    ? 'rgba(124, 92, 252, 0.1)'
                    : 'rgba(255,255,255,0.03)',
                color: selectedSound === s.id ? '#A78BFA' : '#888899',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 18 }}>{s.emoji}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {selectedSound === s.id && <Check size={12} color="#A78BFA" />}
                  {s.id !== 'none' && (
                    <Play size={11} color={selectedSound === s.id ? '#A78BFA' : '#555566'} />
                  )}
                </div>
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: selectedSound === s.id ? '#A78BFA' : '#C0C0D0' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 11, color: '#555566', marginTop: 2 }}>{s.description}</div>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#555566', marginTop: 10 }}>
          Click a sound to preview it.
        </div>
      </div>
    </div>
  );
}

// ─── Appearance Settings ──────────────────────────────────────────────────────

function AppearanceSettings() {
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>('dark');
  const [compactMode, setCompactMode] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [ringAnimation, setRingAnimation] = useState(true);
  const [accentColor, setAccentColor] = useState('#7C5CFC');

  const accents = [
    '#7C5CFC',
    '#EC4899',
    '#06B6D4',
    '#10B981',
    '#F59E0B',
    '#EF4444',
  ];

  return (
    <div>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Theme
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          {(['dark', 'light', 'system'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 10,
                border:
                  theme === t
                    ? '1px solid rgba(124, 92, 252, 0.4)'
                    : '1px solid rgba(255,255,255,0.07)',
                background:
                  theme === t ? 'rgba(124, 92, 252, 0.12)' : 'rgba(255,255,255,0.03)',
                color: theme === t ? '#A78BFA' : '#888899',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.15s',
              }}
            >
              {t === 'dark' ? (
                <Moon size={16} />
              ) : t === 'light' ? (
                <Sun size={16} />
              ) : (
                <div style={{ fontSize: 15 }}>⚙️</div>
              )}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#555566' }}>
          Light mode is coming soon — currently only dark theme is fully supported.
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <SettingRow label="Compact Mode" description="Reduce spacing and padding in the app">
          <Toggle checked={compactMode} onChange={setCompactMode} />
        </SettingRow>
        <SettingRow label="Show Seconds" description="Display seconds in the timer">
          <Toggle checked={showSeconds} onChange={setShowSeconds} />
        </SettingRow>
        <SettingRow
          label="Progress Ring Animation"
          description="Animate the timer progress ring"
        >
          <Toggle checked={ringAnimation} onChange={setRingAnimation} />
        </SettingRow>
      </div>

      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: '#666677', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
          Accent Color
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {accents.map((c) => (
            <button
              key={c}
              onClick={() => setAccentColor(c)}
              style={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: c,
                border:
                  accentColor === c
                    ? `3px solid white`
                    : '3px solid transparent',
                cursor: 'pointer',
                outline: accentColor === c ? `2px solid ${c}` : 'none',
                outlineOffset: 2,
                transition: 'all 0.15s',
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: 11, color: '#555566', marginTop: 8 }}>
          Accent color theming coming soon.
        </div>
      </div>
    </div>
  );
}

// ─── Main Settings Page ───────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('timer');

  const sections: { id: Section; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'timer', label: 'Timer', icon: Clock, description: 'Session lengths and automation' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Sounds and browser alerts' },
    { id: 'appearance', label: 'Appearance', icon: Moon, description: 'Theme and visual preferences' },
  ];

  return (
    <div
      className="flex-1 min-h-full"
      style={{ background: '#07070F', padding: '40px 24px' }}
    >
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'rgba(124, 92, 252, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={15} color="#A78BFA" />
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: '#F0F0FA',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Settings
            </h1>
          </div>
          <p style={{ fontSize: 13, color: '#666677', margin: 0 }}>
            Customize Flexodoro to match your focus style.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20 }}>
          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {sections.map((s) => (
              <SectionTab
                key={s.id}
                id={s.id}
                label={s.label}
                icon={s.icon}
                active={activeSection === s.id}
                onClick={() => setActiveSection(s.id)}
              />
            ))}
          </div>

          {/* Content panel */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
              overflow: 'hidden',
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#E8E8F0' }}>
                  {sections.find((s) => s.id === activeSection)?.label} Settings
                </div>
                <div style={{ fontSize: 12, color: '#666677', marginTop: 2 }}>
                  {sections.find((s) => s.id === activeSection)?.description}
                </div>
              </div>
              <ChevronRight size={14} color="#444455" />
            </div>

            {activeSection === 'timer' && <TimerSettings />}
            {activeSection === 'notifications' && <NotificationSettings />}
            {activeSection === 'appearance' && <AppearanceSettings />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

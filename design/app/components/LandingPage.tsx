import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Zap,
  ArrowRight,
  Music,
  BarChart2,
  Moon,
  Clock,
  ChevronRight,
  CheckCircle2,
  Waves,
  Coffee,
  Wind,
} from 'lucide-react';

const BG = '#07070F';
const SURFACE = '#0F0F1A';
const BORDER = 'rgba(255,255,255,0.07)';
const ACCENT = '#7C5CFC';
const TEXT = '#E8E8F0';
const MUTED = '#66667A';

function TimerPreview() {
  const RADIUS = 54;
  const CIRC = 2 * Math.PI * RADIUS;
  const progress = 0.62;
  const offset = CIRC * (1 - progress);

  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        minWidth: 260,
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Mode pills */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            background: 'rgba(124,92,252,0.15)',
            border: `1px solid rgba(124,92,252,0.3)`,
            fontSize: 11,
            color: '#A78BFA',
            fontWeight: 600,
          }}
        >
          FIXED
        </div>
        <div
          style={{
            padding: '4px 12px',
            borderRadius: 20,
            background: 'transparent',
            border: `1px solid ${BORDER}`,
            fontSize: 11,
            color: MUTED,
            fontWeight: 500,
          }}
        >
          FLEXIBLE
        </div>
      </div>

      {/* Timer ring */}
      <div style={{ position: 'relative', width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="5"
          />
          <motion.circle
            cx="70"
            cy="70"
            r={RADIUS}
            fill="none"
            stroke={ACCENT}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ filter: 'drop-shadow(0 0 8px rgba(124,92,252,0.6))' }}
            initial={{ strokeDashoffset: CIRC }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
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
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 30,
              fontWeight: 600,
              color: TEXT,
              letterSpacing: '-0.02em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            15:33
          </span>
        </div>
      </div>

      {/* Session label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: ACCENT,
            boxShadow: `0 0 6px ${ACCENT}`,
          }}
        />
        <span style={{ fontSize: 12, color: MUTED, fontWeight: 500 }}>Deep Work</span>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: ACCENT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 16px rgba(124,92,252,0.4)`,
          }}
        >
          <div style={{ width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '10px solid white', marginLeft: 2 }} />
        </div>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: `1px solid ${BORDER}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 10, height: 10, border: `2px solid ${MUTED}`, borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: '28px 28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: accent ? `${accent}20` : 'rgba(124,92,252,0.1)',
          border: `1px solid ${accent ? `${accent}30` : 'rgba(124,92,252,0.2)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent || ACCENT,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 6 }}>{title}</p>
        <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{description}</p>
      </div>
    </motion.div>
  );
}

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div
      style={{
        background: SURFACE,
        border: `1px solid ${BORDER}`,
        borderRadius: 16,
        padding: 28,
      }}
    >
      <p style={{ fontSize: 14, color: '#B0B0C0', lineHeight: 1.7, marginBottom: 20 }}>
        "{quote}"
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${ACCENT}, #A78BFA)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: 'white',
          }}
        >
          {name[0]}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{name}</p>
          <p style={{ fontSize: 11, color: MUTED }}>{role}</p>
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  const steps = [
    {
      num: '01',
      title: 'Start your session',
      desc: 'Hit start and enter your natural flow state. No rigid 25-minute blocks forcing you out of focus.',
    },
    {
      num: '02',
      title: 'Work freely',
      desc: 'Flexodoro tracks your focus time invisibly. Work for 15 minutes or 2 hours — your call.',
    },
    {
      num: '03',
      title: 'End when you\'re ready',
      desc: 'Click "End Session" when you feel the natural stopping point. Flexodoro calculates your ideal break.',
    },
  ];

  return (
    <div
      style={{
        background: BG,
        fontFamily: "'Inter', sans-serif",
        color: TEXT,
        minHeight: '100vh',
      }}
    >
      {/* ─── NAVBAR ─── */}
      <header
        style={{
          borderBottom: `1px solid ${BORDER}`,
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(7,7,15,0.9)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={15} color="white" fill="white" />
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 17,
                color: '#F0F0FA',
                letterSpacing: '-0.02em',
              }}
            >
              Flexodoro
            </span>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {['Features', 'How it Works', 'Stats'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                style={{
                  fontSize: 13,
                  color: MUTED,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) => ((e.target as HTMLElement).style.color = TEXT)}
                onMouseLeave={(e) => ((e.target as HTMLElement).style.color = MUTED)}
              >
                {item}
              </a>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 18px',
              borderRadius: 10,
              background: ACCENT,
              border: 'none',
              color: 'white',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(124,92,252,0.3)',
            }}
          >
            Open App
            <ArrowRight size={13} />
          </motion.button>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '100px 24px 80px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Glow orb */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 400,
            background: 'radial-gradient(ellipse at center, rgba(124,92,252,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 14px',
            borderRadius: 20,
            border: `1px solid rgba(124,92,252,0.3)`,
            background: 'rgba(124,92,252,0.08)',
            fontSize: 12,
            color: '#A78BFA',
            fontWeight: 500,
            marginBottom: 28,
          }}
        >
          <Zap size={11} fill="#A78BFA" />
          Flow-based Pomodoro Timer
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 700,
            color: '#F0F0FA',
            letterSpacing: '-0.04em',
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 700,
          }}
        >
          Work with your flow,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            not against it.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontSize: 17,
            color: '#888899',
            lineHeight: 1.7,
            maxWidth: 500,
            marginBottom: 40,
          }}
        >
          The only focus timer that adapts to your natural work rhythm. Stop forcing
          yourself into rigid 25-minute blocks.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 8px 32px rgba(124,92,252,0.45)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/app')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 28px',
              borderRadius: 12,
              background: ACCENT,
              border: 'none',
              color: 'white',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(124,92,252,0.35)',
            }}
          >
            Start Focus Session
            <ArrowRight size={15} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 24px',
              borderRadius: 12,
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              color: MUTED,
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            How it works
            <ChevronRight size={15} />
          </motion.button>
        </motion.div>

        {/* App preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{ marginTop: 72 }}
        >
          <TimerPreview />
        </motion.div>
      </section>

      {/* ─── WHAT IS FLEXODORO ─── */}
      <section
        id="features"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '80px 24px',
          borderTop: `1px solid ${BORDER}`,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12 }}>
            WHAT IS FLEXODORO
          </p>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              color: '#F0F0FA',
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            Built for how humans actually work
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Traditional Pomodoro forces you to stop mid-flow. Flexodoro respects your
            natural focus cycles.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          <FeatureCard
            icon={<Clock size={20} />}
            title="Fixed Pomodoro Mode"
            description="Classic 25/5 or 40/10 presets for structured focus sessions with automatic break timers."
          />
          <FeatureCard
            icon={<Zap size={20} />}
            title="Flexible Flow Mode"
            description="Work freely for as long as you need. Flexodoro calculates the perfect break based on your work duration."
            accent="#A78BFA"
          />
          <FeatureCard
            icon={<Music size={20} />}
            title="Focus Music"
            description="Rain, white noise, café ambience, and more. Auto-plays when your session starts."
            accent="#10B981"
          />
          <FeatureCard
            icon={<Moon size={20} />}
            title="Deep Work Mode"
            description="Fullscreen, distraction-free interface. Just you and the timer — nothing else."
            accent="#F59E0B"
          />
          <FeatureCard
            icon={<BarChart2 size={20} />}
            title="Focus Analytics"
            description="Track daily focus time, streaks, and session trends. Understand when you work best."
            accent="#EC4899"
          />
          <FeatureCard
            icon={<CheckCircle2 size={20} />}
            title="Smart Break Calculator"
            description="1 minute of break for every 5 minutes worked. Scientifically calibrated recovery time."
            accent="#06B6D4"
          />
        </div>
      </section>

      {/* ─── HOW FLEXIBLE MODE WORKS ─── */}
      <section
        id="how-it-works"
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12 }}>
              FLEXIBLE MODE
            </p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(28px, 4vw, 42px)',
                fontWeight: 700,
                color: '#F0F0FA',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
              }}
            >
              Three steps to flow state
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 24,
              position: 'relative',
            }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{
                  background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 16,
                  padding: '32px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 24,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 48,
                    fontWeight: 800,
                    color: 'rgba(255,255,255,0.03)',
                    lineHeight: 1,
                  }}
                >
                  {step.num}
                </div>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: 'rgba(124,92,252,0.12)',
                    border: '1px solid rgba(124,92,252,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#A78BFA',
                    marginBottom: 20,
                  }}
                >
                  {i + 1}
                </div>
                <h3
                  style={{
                    fontSize: 17,
                    fontWeight: 600,
                    color: TEXT,
                    marginBottom: 10,
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.65 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Break Calc Visual */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{
              marginTop: 32,
              background: 'rgba(124,92,252,0.06)',
              border: '1px solid rgba(124,92,252,0.2)',
              borderRadius: 16,
              padding: '28px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              <p style={{ fontSize: 12, color: '#A78BFA', fontWeight: 600, letterSpacing: '0.06em', marginBottom: 8 }}>
                SMART BREAK FORMULA
              </p>
              <p style={{ fontSize: 15, fontWeight: 600, color: TEXT, marginBottom: 4 }}>
                1 minute of break per 5 minutes worked
              </p>
              <p style={{ fontSize: 13, color: MUTED }}>
                Automatically adjusts to your actual session length
              </p>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { work: '25 min', break: '5 min' },
                { work: '50 min', break: '10 min' },
                { work: '75 min', break: '15 min' },
              ].map(({ work, break: brk }) => (
                <div
                  key={work}
                  style={{
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Work</p>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: TEXT,
                    }}
                  >
                    {work}
                  </p>
                  <div
                    style={{
                      width: 1,
                      height: 12,
                      background: BORDER,
                      margin: '6px auto',
                    }}
                  />
                  <p style={{ fontSize: 11, color: MUTED, marginBottom: 4 }}>Break</p>
                  <p
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#10B981',
                    }}
                  >
                    {brk}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOCUS SOUNDS PREVIEW ─── */}
      <section
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 48,
              alignItems: 'center',
            }}
          >
            <div>
              <p style={{ fontSize: 12, color: ACCENT, fontWeight: 600, letterSpacing: '0.08em', marginBottom: 12 }}>
                FOCUS MUSIC
              </p>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(26px, 3.5vw, 40px)',
                  fontWeight: 700,
                  color: '#F0F0FA',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.2,
                  marginBottom: 16,
                }}
              >
                Your soundtrack
                <br />
                for deep focus
              </h2>
              <p style={{ fontSize: 14, color: MUTED, lineHeight: 1.7, marginBottom: 24, maxWidth: 380 }}>
                Carefully selected ambient sounds designed to enhance concentration
                without distraction. Auto-plays when your session begins.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Fades in gently when your session starts', 'Independent volume control', 'Loops seamlessly'].map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={14} color="#10B981" />
                    <span style={{ fontSize: 13, color: MUTED }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sound cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {[
                { icon: <Waves size={20} />, name: 'Rain', desc: 'Soft rainfall', color: '#06B6D4' },
                { icon: <Wind size={20} />, name: 'White Noise', desc: 'Pure white noise', color: '#8B5CF6' },
                { icon: <Coffee size={20} />, name: 'Café', desc: 'Coffee shop hum', color: '#F59E0B' },
                { icon: <Music size={20} />, name: 'Ambient', desc: 'Lo-fi ambient', color: '#10B981' },
              ].map((sound, i) => (
                <motion.div
                  key={sound.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                  style={{
                    background: SURFACE,
                    border: `1px solid ${BORDER}`,
                    borderRadius: 14,
                    padding: '20px 20px',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: `${sound.color}18`,
                      border: `1px solid ${sound.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: sound.color,
                      marginBottom: 12,
                    }}
                  >
                    {sound.icon}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: TEXT, marginBottom: 3 }}>{sound.name}</p>
                  <p style={{ fontSize: 11, color: MUTED }}>{sound.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '80px 24px',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: 'clamp(24px, 3.5vw, 38px)',
                fontWeight: 700,
                color: '#F0F0FA',
                letterSpacing: '-0.03em',
                marginBottom: 12,
              }}
            >
              Loved by deep workers
            </h2>
            <p style={{ fontSize: 14, color: MUTED }}>
              Thousands of developers, writers, and creators use Flexodoro daily
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            <TestimonialCard
              quote="I finally stopped dreading focus sessions. Flexible Mode means I work until I'm done, not until a timer rings."
              name="Alex Chen"
              role="Software Engineer"
            />
            <TestimonialCard
              quote="The focus music feature alone is worth it. I enabled Rain + auto-play and I've never been more productive."
              name="Sarah Kim"
              role="UX Designer"
            />
            <TestimonialCard
              quote="Deep Work Mode changed how I write. No distractions, just the clock and my words. My output tripled."
              name="Marcus Lee"
              role="Technical Writer"
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '100px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center bottom, rgba(124,92,252,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: '#F0F0FA',
              letterSpacing: '-0.04em',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Ready to find
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #7C5CFC, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              your flow?
            </span>
          </h2>
          <p style={{ fontSize: 15, color: MUTED, marginBottom: 40 }}>
            Start your first session for free. No account needed.
          </p>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 12px 48px rgba(124,92,252,0.5)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/app')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              padding: '16px 36px',
              borderRadius: 14,
              background: ACCENT,
              border: 'none',
              color: 'white',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 32px rgba(124,92,252,0.4)',
            }}
          >
            Start Focus Session
            <ArrowRight size={16} />
          </motion.button>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        style={{
          borderTop: `1px solid ${BORDER}`,
          padding: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: 12, color: MUTED }}>
          © 2026 Flexodoro · Built for flow state · No tracking, no ads
        </p>
      </footer>
    </div>
  );
}

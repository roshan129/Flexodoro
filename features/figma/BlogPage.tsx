"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Tag,
  BookOpen,
  Brain,
  Zap,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';

// ─── Data ─────────────────────────────────────────────────────────────────────

type BlogPost = {
  id: string;
  title: string;
  subtitle: string;
  category: 'adhd' | 'focus' | 'productivity' | 'science';
  readTime: number;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  emoji: string;
};

const POSTS: BlogPost[] = [
  {
    id: 'adhd-pomodoro',
    title: 'Why Pomodoro Clicks for ADHD Brains',
    subtitle: 'How time-boxing creates the urgency your brain craves',
    category: 'adhd',
    readTime: 5,
    date: 'May 20, 2026',
    tags: ['ADHD', 'Pomodoro', 'Time Blindness'],
    emoji: '🧠',
    excerpt:
      'ADHD brains struggle with open-ended time. The Pomodoro Technique creates artificial urgency that activates the dopamine system, making focus sustainable.',
    content: `## The ADHD Brain and Time

People with ADHD often describe time as binary: **now** and **not now**. Anything that doesn't feel immediately urgent gets indefinitely postponed — a phenomenon researchers call *time blindness*.

The classic advice to "just sit down and do it for an hour" backfires spectacularly because an hour feels like forever. The brain can't feel the pressure of something 60 minutes away.

## Why 25 Minutes Works

The Pomodoro Technique creates a *contained urgency*. When you set a 25-minute timer, your brain shifts from open-ended anxiety to a finite, manageable sprint. Several mechanisms are at play:

**1. Artificial deadline pressure**
The ticking clock triggers the same neurological urgency as a real deadline. Your prefrontal cortex (executive function) gets a boost because the task is now *time-bounded*.

**2. Dopamine micro-rewards**
Each completed Pomodoro fires a small dopamine hit — the "I did it" moment. For ADHD brains that are chronically under-rewarded by routine tasks, this external reward loop is genuinely helpful.

**3. Permission to stop**
Knowing the break is coming reduces the subconscious resistance to starting. You're not committing to "doing homework" — you're committing to 25 minutes. That's a very different cognitive load.

## Flexodoro's Take: Flexible Mode

Standard Pomodoro doesn't account for flow states. When you're *in it* — when the focus clicks — being forced to stop can shatter hours of buildup.

Flexible Mode lets you work until you feel natural stopping. The break then scales proportionally. This respects both the ADHD need for structure *and* the occasional hyperfocus gift.

## Practical Tips

- **Start small**: If 25 minutes feels daunting, try 10. The technique works at any interval.
- **Body doubling**: Use a focus timer alongside a video call or co-working space. ADHD brains often focus better with a social "witness."
- **Visible timer**: Keep the timer on screen. Out-of-sight means out-of-mind for ADHD.
- **Reward your breaks**: Use break time for something genuinely enjoyable — not email.

The Pomodoro Technique isn't magic, but for ADHD brains, its built-in urgency and reward structure make it one of the most evidence-aligned productivity methods available.`,
  },
  {
    id: 'deep-work-science',
    title: 'The Neuroscience of Deep Work',
    subtitle: 'What happens in your brain during deep focus — and how to get there faster',
    category: 'science',
    readTime: 7,
    date: 'May 15, 2026',
    tags: ['Neuroscience', 'Deep Work', 'Flow State'],
    emoji: '🔬',
    excerpt:
      "Deep focus isn't mystical — it's a specific brain state you can learn to enter reliably. Here's what the research says.",
    content: `## What Is Deep Work, Neurologically?

Cal Newport popularized the term *deep work*, but the underlying neurological state has been studied for decades. When you enter genuine deep focus, several measurable changes occur in your brain:

**Prefrontal cortex engagement**: Your executive control network ramps up, allowing you to hold complex information in working memory and suppress distractions.

**Default Mode Network suppression**: The DMN — the part of your brain that wanders, daydreams, and second-guesses — quiets down. This is the neural signature of being "in the zone."

**Gamma wave activity**: EEG studies show bursts of gamma frequency brain waves (30–100 Hz) during complex problem-solving and creative insight.

## The Ramp-Up Period

Here's the critical insight most productivity advice ignores: **deep focus is not a switch you flip**.

Research by neuroscientist Andrew Huberman and others suggests it takes **10–20 minutes of sustained, low-distraction focus** before your brain fully commits to a task. This is why interruptions are so costly — you're not just losing the time you were interrupted, you're losing the ramp-up time required to return.

## Dopamine and Focus

Dopamine is often called the "pleasure chemical," but its primary function is *motivation and anticipation*. Before deep work sessions:

- **Cold exposure** (even brief) spikes dopamine 2.5×
- **Caffeine** blocks adenosine receptors, reducing the subjective effort of focusing
- **Setting clear intent** ("I will write 500 words about X") activates goal-directed dopamine pathways

## Building the Habit

Consistent deep work isn't about willpower — it's about environmental design. Your workspace, your rituals, and your timer all become *cues* that trigger the focus state. The more consistently you use them, the faster your brain enters deep work.

This is why tools like Flexodoro matter: they're not just timers — they're consistency anchors for your focus habit.`,
  },
  {
    id: 'adhd-executive-function',
    title: 'Executive Function & ADHD: A Practical Primer',
    subtitle: 'Understanding why starting tasks feels impossible — and what actually helps',
    category: 'adhd',
    readTime: 6,
    date: 'May 10, 2026',
    tags: ['ADHD', 'Executive Function', 'Task Initiation'],
    emoji: '⚡',
    excerpt:
      "Task initiation is one of the hardest challenges for ADHD. It's not laziness — it's a neurological barrier that requires specific strategies.",
    content: `## What Is Executive Function?

Executive function is an umbrella term for the cognitive processes that control goal-directed behavior: planning, starting tasks, switching between tasks, managing emotions, and working memory.

For ADHD brains, executive function is inconsistent — not absent, but unreliable. This creates a baffling experience: you can hyperfocus on a video game for 6 hours but can't start a 10-minute email.

## The Initiation Problem

Task initiation — the ability to begin a task without excessive delay — is consistently one of the most impaired executive functions in ADHD.

The barrier isn't intelligence or desire. It's that the brain's *go signal* — typically triggered by interest, urgency, challenge, or novelty — isn't firing reliably for tasks that feel routine or low-stakes.

**What doesn't trigger the ADHD go signal:**
- "I should do this"
- "This is important"
- "I'll feel better when it's done"

**What does trigger it:**
- A real deadline (urgency)
- A challenge or competition element
- Genuine interest or novelty
- Another person's presence (body doubling)

## Timer-Based Strategies

A running timer introduces *artificial urgency*, which mimics the neurological state of a deadline. This is why the Pomodoro Technique has such strong anecdotal support in the ADHD community.

**Two-minute rule**: Commit to working on a task for just two minutes. The bar to starting is extremely low. Once started, momentum often carries you further.

**Transition anchors**: Use a consistent pre-work ritual (same music, same drink, starting the timer) to create a Pavlovian cue for focus.

## Working With ADHD, Not Against It

ADHD brains have genuine advantages: creative problem-solving, hyperfocus on topics of interest, high energy, and pattern recognition. The goal isn't to become a neurotypical person — it's to design systems that route around the weak spots while leaning into the strengths.

Flexodoro's flexible mode is designed with exactly this in mind: when you hit a flow state, don't interrupt it. Work until natural stopping feels right, then take a break proportional to what you put in.`,
  },
  {
    id: 'break-science',
    title: 'The Science of Taking Better Breaks',
    subtitle: "Not all rest is equal. Here's what your brain actually needs between focus sessions.",
    category: 'science',
    readTime: 4,
    date: 'May 5, 2026',
    tags: ['Breaks', 'Rest', 'Recovery'],
    emoji: '☕',
    excerpt:
      'Research shows that the quality of your break matters as much as the break itself. The wrong kind of rest leaves you more depleted.',
    content: `## Why Breaks Are Non-Negotiable

Sustained focus depletes adenosine clearance capacity and creates fatigue in the prefrontal cortex. Breaks aren't laziness — they're a biological requirement for maintaining cognitive performance.

The question isn't whether to take breaks; it's what to do during them.

## What Actually Restores Focus

**1. Non-sleep deep rest (NSDR)**
A 10–20 minute NSDR protocol (a body-scan relaxation or yoga nidra) has been shown to restore dopamine levels to baseline after cognitive depletion. Even a 5-minute version has measurable effects.

**2. Nature exposure**
Attention Restoration Theory (ART) proposes that natural environments restore directed attention because they engage *involuntary* attention — you notice interesting things without effort. Even looking at nature images helps, though walking outside is best.

**3. Physical movement**
Light walking — especially outdoors — increases BDNF (brain-derived neurotrophic factor), which supports synaptic plasticity and cognitive function. A 5-minute walk beats sitting on your phone.

**4. Social connection**
Brief, positive social interactions release oxytocin and reduce cortisol. A quick conversation during a break can improve mood and subsequent focus.

## What Depletes Focus Further

- **Doom-scrolling**: Social media activates dopamine in a scattered, unsatisfying way that fragments attention rather than restoring it.
- **Email and Slack**: Work-adjacent activities don't let the prefrontal cortex rest — they just switch the task.
- **High-stimulation content**: Action-heavy videos or aggressive music maintain a high cognitive arousal state that prevents recovery.

## Flexodoro's Approach

The app's break calculator is built on this research: longer focus sessions earn proportionally longer breaks, giving your brain adequate recovery before the next sprint. The Focus Music panel continues during breaks for ambient support.

A good break isn't just time off — it's *active recovery*. Treat it that way.`,
  },
  {
    id: 'flow-state-guide',
    title: 'How to Enter Flow State More Reliably',
    subtitle: "Mihaly Csikszentmihalyi's research, translated into a practical checklist",
    category: 'focus',
    readTime: 5,
    date: 'April 28, 2026',
    tags: ['Flow State', 'Focus', 'Productivity'],
    emoji: '🌊',
    excerpt:
      "Flow isn't accidental. The conditions that produce it are predictable and reproducible — once you know what they are.",
    content: `## What Is Flow?

Psychologist Mihaly Csikszentmihalyi described flow as "optimal experience" — a state of complete absorption where time distorts, self-consciousness vanishes, and performance peaks.

It's not rare or mystical. Most people have experienced it. The question is how to get there on demand.

## The Flow Conditions

Csikszentmihalyi's research identified a consistent set of conditions that produce flow:

**1. Clear goals**
Ambiguity is the enemy of flow. Your brain can't enter deep focus on "work on the project." It can enter flow on "write the introduction section of the proposal."

**2. Immediate feedback**
You need to know whether what you're doing is working. Code that compiles or doesn't, words that feel right or clunky, a design that clicks or misses. Without feedback, your attention drifts to evaluation.

**3. Challenge-skill balance**
The task needs to be challenging enough to require your full attention, but not so difficult that anxiety takes over. This sweet spot varies by person and day.

**4. Uninterrupted time**
Flow has a ramp-up period. Studies suggest it takes 10–23 minutes to enter deep focus. A single interruption resets the clock. This makes the Pomodoro structure particularly valuable — it creates protected time.

## Pre-Flow Ritual

Building a consistent pre-work ritual trains your brain to associate specific cues with focus. Over time, the ritual itself triggers the state:

1. Clear your workspace
2. Set a specific, single task goal
3. Start your timer
4. Begin with the hardest part first (cold start)

## When Flow Won't Come

Some days, flow is elusive. Possible causes: poor sleep, high stress hormones, dehydration, or a task that isn't well-defined. On these days, aim for functional focus rather than peak flow — consistent, reliable work output without the peak state.

Flexodoro's Flexible Mode is designed for both: it doesn't penalize you for stopping when flow breaks, and it doesn't force you to stop when it's going well.`,
  },
  {
    id: 'adhd-hyperfocus',
    title: "Hyperfocus: ADHD's Hidden Superpower (and Its Traps)",
    subtitle: 'Understanding hyperfocus — and how to harness it without burning out',
    category: 'adhd',
    readTime: 5,
    date: 'April 20, 2026',
    tags: ['ADHD', 'Hyperfocus', 'Energy Management'],
    emoji: '🎯',
    excerpt:
      "Hyperfocus feels like a superpower — until it makes you miss dinner, deadlines, and sleep. Here's how to work with it intentionally.",
    content: `## What Is Hyperfocus?

Hyperfocus is the paradox at the heart of ADHD: the same brain that can't start a routine task can lock onto an interesting one for 6, 8, or 10 hours straight — losing track of time, hunger, and basic needs.

It's not the opposite of ADHD. It's the same underlying mechanism: ADHD brains regulate attention through interest and novelty rather than intention. When interest is high, the attention lock is total.

## The Neuroscience

Hyperfocus is associated with dopamine flooding in the prefrontal cortex. When a task is highly engaging, the brain enters a state similar to flow — but more intense and less controllable. The Default Mode Network shuts off almost completely, which explains why external signals (phone buzzing, someone calling your name) fail to penetrate.

## The Benefits

When directed at the right target, hyperfocus is extraordinary:

- **Deep problem solving**: Long uninterrupted thinking sessions can crack problems that scattered attention never would.
- **Creative output**: Writers, programmers, and artists with ADHD often do their best work during hyperfocus.
- **Skill acquisition**: Rapid skill-building happens naturally when hyperfocus locks onto a new interest.

## The Traps

**Lost time**: Hours vanish. Deadlines pass. Other important tasks get completely forgotten.

**Task switching failure**: Ending a hyperfocus session requires external intervention — alarm, another person, environmental change.

**Post-hyperfocus crash**: The dopamine depletion after a long hyperfocus session causes fatigue, irritability, and difficulty focusing on anything else.

## Working With Hyperfocus

**Schedule it**: If you know a topic triggers hyperfocus, block it into your calendar at an appropriate time — when you can afford the time debt.

**Use timers**: External timers (like Flexodoro) create the interruption your brain won't generate on its own.

**Pre-commit to stopping conditions**: "I will stop when the timer ends" is more effective than "I'll stop when I feel ready."

**Buffer after sessions**: Expect to need 30–60 minutes of low-demand activity after a long hyperfocus session. Don't schedule important meetings immediately after.

Hyperfocus is a feature, not a bug — but it needs guardrails to work in your favor rather than against you.`,
  },
  {
    id: 'sleep-and-focus',
    title: 'Sleep Is Your Focus Supercharger',
    subtitle: 'The research on sleep and cognitive performance is unambiguous — and underrated',
    category: 'science',
    readTime: 4,
    date: 'April 14, 2026',
    tags: ['Sleep', 'Cognitive Performance', 'Recovery'],
    emoji: '🌙',
    excerpt:
      "No productivity technique compensates for sleep deprivation. Here's the science, and what to do about it.",
    content: `## Sleep and the Brain

During sleep, your brain does maintenance work it can't do while awake: clearing metabolic waste via the glymphatic system, consolidating memories from short-term to long-term storage, restoring neurotransmitter levels, and rebalancing the prefrontal cortex's emotional regulation circuitry.

These are not optional processes. They are the biological foundation of cognitive function.

## What Sleep Deprivation Does to Focus

Losing even 1–2 hours of sleep has measurable effects on:

- **Sustained attention**: You miss more, react slower, and make more errors
- **Working memory**: You can hold fewer items in mind simultaneously
- **Inhibitory control**: Suppressing distraction becomes harder
- **Emotional regulation**: Frustration tolerance drops; task-switching anxiety increases

Research by Matthew Walker's lab at UC Berkeley shows that 17–19 hours awake produces cognitive impairment equivalent to a blood alcohol level of 0.05%. You wouldn't choose to work drunk.

## Sleep and ADHD

ADHD and sleep problems are highly comorbid. ADHD brains frequently have a *delayed circadian phase* — the biological clock runs later, making early rising feel unnatural and sleep onset difficult. This isn't a character flaw; it's neurobiology.

Additionally, ADHD medications (stimulants) can interfere with sleep onset if taken too late in the day.

## Practical Optimizations

**Consistent wake time**: More powerful than consistent bedtime. Anchoring your wake time regulates the circadian clock.

**Morning light**: 5–10 minutes of outdoor light within 30 minutes of waking sets the circadian timer for the day.

**Caffeine cutoff**: Adenosine builds up during the day (creating sleep pressure). Caffeine blocks adenosine but doesn't eliminate it — it just delays the signal. Cutting caffeine by 2 PM lets adenosine accumulate for better sleep onset.

**Temperature**: Core body temperature needs to drop 1–3°F for sleep onset. A cool bedroom (65–68°F / 18–20°C) accelerates this.

No timer technique, focus music, or productivity app substitutes for a rested brain. Sleep isn't a sacrifice you make for productivity — it is productivity.`,
  },
  {
    id: 'distraction-management',
    title: 'The Attention Economy Is Designed Against You',
    subtitle: 'Why focus feels harder than ever — and what to do about it',
    category: 'focus',
    readTime: 5,
    date: 'April 7, 2026',
    tags: ['Focus', 'Digital Distractions', 'Attention'],
    emoji: '📵',
    excerpt:
      'Social platforms and apps are optimized to extract attention, not to serve you. Protecting focus requires intentional environmental design.',
    content: `## The Attention Economy

Social platforms, news sites, and apps don't sell products — they sell your attention to advertisers. Their incentive is to maximize the time you spend on them, which means their algorithms are explicitly designed to override your focus intentions.

This isn't speculation. Former tech insiders — Tristan Harris, Aza Raskin, James Williams — have documented the deliberate psychological mechanisms used: variable reward schedules (the same mechanism as slot machines), infinite scroll (eliminating natural stopping points), social validation loops (likes and comments), and algorithmically optimized emotional provocation.

You're not weak-willed for finding it hard to resist. You're up against professional behavioral engineers with billions of dollars and decades of research.

## The Neurological Cost

Every time you check a notification, your brain releases a small dopamine hit. Over time, this trains your brain to *crave* interruption — even when you consciously want to focus.

This is why focus feels harder today than it did 10 years ago. It's not aging or moral decline. Your brain has been reconditioned by the technology you use daily.

## Practical Defense

**Friction over willpower**: Don't rely on willpower to avoid distractions — create friction. Phone in another room. Notifications fully off during focus sessions. Website blockers for specific time windows.

**Scheduled communication**: Decide when you check messages. Twice a day is enough for most work. Reactive communication creates an always-on cognitive load that prevents deep focus.

**Monotasking**: Multitasking is a myth. Cognitive switching costs are real and significant. One task at a time, one tab at a time.

**Environment design**: Work in a space you associate with focus. Remove visual cues for other tasks. A clean desk reduces the pull of competing priorities.

**Analog alternatives**: For non-digital tasks, paper and pen have zero notification risk and create a different cognitive mode — slower, more deliberate, more focused.

Protecting your attention isn't antisocial. It's an act of self-determination in an environment designed to take it from you.`,
  },
];

const CATEGORY_CONFIG = {
  adhd: { label: 'ADHD', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.12)' },
  focus: { label: 'Focus', color: '#34D399', bg: 'rgba(52, 211, 153, 0.12)' },
  productivity: { label: 'Productivity', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' },
  science: { label: 'Science', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' },
};

// ─── Components ───────────────────────────────────────────────────────────────

function CategoryBadge({ category }: { category: BlogPost['category'] }) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 8px',
        borderRadius: 20,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.03em',
      }}
    >
      <Tag size={9} />
      {cfg.label}
    </span>
  );
}

function BlogCard({
  post,
  onOpen,
}: {
  post: BlogPost;
  onOpen: (post: BlogPost) => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      onClick={() => onOpen(post)}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: 14,
        padding: 20,
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124, 92, 252, 0.25)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: 'rgba(124, 92, 252, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {post.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <CategoryBadge category={post.category} />
            <span style={{ fontSize: 11, color: '#555566', display: 'flex', alignItems: 'center', gap: 3 }}>
              <Clock size={10} />
              {post.readTime} min read
            </span>
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#E8E8F0',
              fontFamily: "'Space Grotesk', sans-serif",
              lineHeight: 1.35,
              marginBottom: 6,
            }}
          >
            {post.title}
          </div>
          <div style={{ fontSize: 12, color: '#888899', lineHeight: 1.5, marginBottom: 10 }}>
            {post.excerpt}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 11, color: '#444455' }}>{post.date}</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
                color: '#7C5CFC',
                fontWeight: 500,
              }}
            >
              Read article
              <ChevronRight size={12} />
            </div>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ─── Blog Post View ───────────────────────────────────────────────────────────

function renderMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      nodes.push(
        <h2
          key={i}
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#F0F0FA',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.01em',
            marginTop: 32,
            marginBottom: 12,
          }}
        >
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      // standalone bold line
      nodes.push(
        <p
          key={i}
          style={{ fontSize: 13, fontWeight: 700, color: '#C8C8D8', marginBottom: 6, marginTop: 16 }}
        >
          {line.replace(/\*\*/g, '')}
        </p>
      );
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace('- ', ''));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} style={{ marginBottom: 16, paddingLeft: 20 }}>
          {items.map((item, j) => (
            <li
              key={j}
              style={{
                fontSize: 14,
                color: '#AAAABC',
                lineHeight: 1.7,
                marginBottom: 4,
              }}
              dangerouslySetInnerHTML={{
                __html: item.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#D0D0E0">$1</strong>'),
              }}
            />
          ))}
        </ul>
      );
      continue;
    } else if (line.trim() !== '') {
      nodes.push(
        <p
          key={i}
          style={{ fontSize: 14, color: '#AAAABC', lineHeight: 1.8, marginBottom: 16 }}
          dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#D0D0E0">$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>'),
          }}
        />
      );
    }
    i++;
  }

  return nodes;
}

function BlogPostView({ post, onBack }: { post: BlogPost; onBack: () => void }) {
  const cfg = CATEGORY_CONFIG[post.category];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      style={{ maxWidth: 680, margin: '0 auto' }}
    >
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: 13,
          color: '#888899',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 0 24px',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#A78BFA')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#888899')}
      >
        <ArrowLeft size={14} />
        Back to Blog
      </button>

      {/* Hero */}
      <div
        style={{
          padding: '32px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 32,
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>{post.emoji}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <CategoryBadge category={post.category} />
          <span style={{ fontSize: 11, color: '#555566', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={10} />
            {post.readTime} min read
          </span>
          <span style={{ fontSize: 11, color: '#555566' }}>{post.date}</span>
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: '#F0F0FA',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.03em',
            lineHeight: 1.25,
            marginBottom: 10,
          }}
        >
          {post.title}
        </h1>
        <p style={{ fontSize: 15, color: '#888899', lineHeight: 1.6, marginBottom: 20 }}>
          {post.subtitle}
        </p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '3px 10px',
                borderRadius: 20,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 11,
                color: '#666677',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '32px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {renderMarkdown(post.content)}
      </div>

      {/* Footer CTA */}
      <div
        style={{
          marginTop: 24,
          padding: '20px 24px',
          borderRadius: 12,
          background: `linear-gradient(135deg, rgba(124, 92, 252, 0.1), rgba(167, 139, 250, 0.05))`,
          border: '1px solid rgba(124, 92, 252, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Sparkles size={20} color="#A78BFA" />
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#E8E8F0', marginBottom: 2 }}>
            Ready to apply this?
          </div>
          <div style={{ fontSize: 12, color: '#888899' }}>
            Start a focus session in Flexodoro and put these insights into practice.
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </motion.div>
  );
}

// ─── Main Blog Page ───────────────────────────────────────────────────────────

export function BlogPage() {
  const [openPost, setOpenPost] = useState<BlogPost | null>(null);
  const [activeCategory, setActiveCategory] = useState<BlogPost['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  const categoryOrder: Array<BlogPost['category'] | 'all'> = [
    'all',
    'adhd',
    'focus',
    'science',
    'productivity',
  ];

  return (
    <div
      className="flex-1 min-h-full"
      style={{ background: '#07070F', padding: '40px 24px' }}
    >
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <AnimatePresence mode="wait">
          {openPost ? (
            <BlogPostView key="post" post={openPost} onBack={() => setOpenPost(null)} />
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
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
                    <BookOpen size={15} color="#A78BFA" />
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
                    Focus & ADHD Blog
                  </h1>
                </div>
                <p style={{ fontSize: 13, color: '#666677', margin: 0 }}>
                  Science-backed insights on focus, ADHD, and building sustainable productivity habits.
                </p>
              </div>

              {/* Search + Filter */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                  <Search
                    size={13}
                    color="#555566"
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles…"
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 34px',
                      borderRadius: 10,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#E8E8F0',
                      fontSize: 13,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {categoryOrder.map((cat) => {
                    const cfg = cat === 'all' ? null : CATEGORY_CONFIG[cat];
                    return (
                      <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 8,
                          border:
                            activeCategory === cat
                              ? `1px solid ${cfg?.color ?? 'rgba(124,92,252,0.4)'}`
                              : '1px solid rgba(255,255,255,0.07)',
                          background:
                            activeCategory === cat
                              ? cfg?.bg ?? 'rgba(124, 92, 252, 0.12)'
                              : 'rgba(255,255,255,0.03)',
                          color: activeCategory === cat ? cfg?.color ?? '#A78BFA' : '#888899',
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cat === 'all' ? 'All' : CATEGORY_CONFIG[cat].label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stats row */}
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginBottom: 24,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {[
                  { icon: BookOpen, label: 'Articles', value: POSTS.length },
                  { icon: Brain, label: 'ADHD topics', value: POSTS.filter((p) => p.category === 'adhd').length },
                  { icon: Zap, label: 'Focus guides', value: POSTS.filter((p) => p.category === 'focus').length },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={13} color="#666677" />
                    <span style={{ fontSize: 12, color: '#888899' }}>
                      <strong style={{ color: '#E8E8F0', fontVariantNumeric: 'tabular-nums' }}>{value}</strong>{' '}
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Post list */}
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#555566' }}>
                  <BookOpen size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
                  <div style={{ fontSize: 14 }}>No articles found for &quot;{searchQuery}&quot;</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {filtered.map((post, i) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <BlogCard post={post} onOpen={setOpenPost} />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    subtitle: 'What happens in your brain during deep focus — and why getting started is the hardest part',
    category: 'science',
    readTime: 7,
    date: 'May 15, 2026',
    tags: ['Neuroscience', 'Deep Work', 'Flow State'],
    emoji: '🔬',
    excerpt:
      "Deep focus isn't magic. It's a neurological state you can learn to enter more consistently once you understand the friction at the start.",
    content: `## What Is Deep Work, Neurologically?

Deep work feels mysterious when you're inside it.

Hours disappear. Distracting thoughts fade into the background. Difficult problems suddenly feel manageable. You stop forcing focus and start flowing with it.

But deep focus isn't magic. It's a real neurological state - and understanding how it works can help you enter it more consistently.

## Why Focus Feels So Hard at First

One of the biggest misconceptions about productivity is the idea that focus is something you can instantly switch on.

In reality, the first 10–20 minutes of focused work are often the hardest.

Your brain keeps searching for easier dopamine:
- checking messages
- opening new tabs
- switching songs
- refreshing notifications
- doing literally anything except the task in front of you

That resistance is normal.

Deep work starts as friction before it becomes flow.

If you stay with the task long enough without context-switching, your brain gradually settles into a more stable attention state.

This is why interruptions are so expensive. You're not just losing the minute you spent replying to a message - you're losing the mental ramp-up required to fully focus again.

## What Changes in Your Brain During Deep Work?

When you enter genuine deep focus, several measurable changes occur in the brain.

### Your executive control network becomes more active

The prefrontal cortex - responsible for planning, decision-making, and attention control - ramps up activity. This helps you hold complex information in working memory while filtering out distractions.

### Mental noise quiets down

The Default Mode Network (DMN), associated with mind-wandering and self-referential thinking, becomes less active. This is part of why deep work feels mentally quieter than normal distracted thinking.

You stop constantly evaluating whether you should be doing something else.

## Dopamine and Attention

Dopamine is often misunderstood as just a "pleasure chemical." In reality, it's heavily tied to motivation, anticipation, and goal-directed behavior.

Small environmental cues can make focused work feel significantly easier:
- a consistent workspace
- a clear task goal
- a visible timer
- reducing notifications before starting

Even the simple act of defining a target like:

> "I will write 500 words."

gives your brain a concrete objective to organize around.

The clearer the goal, the less energy your brain spends deciding what to do next.

## Why Rituals Matter More Than Motivation

Most people think deep work comes from discipline.

More often, it comes from environment and repetition.

When you consistently use the same setup - same desk, same playlist, same timer, same ritual - your brain starts associating those cues with focused attention.

Over time, entering deep work requires less activation energy.

You're training your brain to recognize:
> "This is the time we focus."

This is why focus tools matter.

A timer isn't just counting minutes. It's creating structure around attention. It's reducing ambiguity. It's helping your brain cross the gap between distraction and immersion.

That's the idea behind Flexodoro's Flexible Mode.

Traditional Pomodoro timers assume productivity is linear: work for 25 minutes, stop, repeat.

But real focus often isn't linear. Sometimes it takes 20 minutes just to settle in. Other times you accidentally enter a two-hour flow state and stopping would completely break momentum.

Flexible Mode adapts to that reality - giving structure when you need it without interrupting deep focus when it finally arrives.`,
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
      'Not all breaks restore attention. The right kind of rest helps your brain recover, while the wrong kind can leave you even more mentally exhausted.',
    content: `## Why Breaks Are Non-Negotiable

Ever notice how some breaks leave you refreshed while others leave you even more mentally exhausted?

You step away from work for 10 minutes, scroll social media for a bit, and somehow come back feeling noisier, foggier, and less motivated than before.

That's because your brain doesn't experience all breaks the same way.

Some activities genuinely restore attention.
Others just replace one form of stimulation with another.

## Why Breaks Matter So Much

Focused work is mentally expensive.

Your brain isn't designed to maintain intense concentration indefinitely. After long periods of focus, attention starts becoming less stable. Decision-making gets slower. Distractions become harder to resist. Mental fatigue quietly builds in the background.

Breaks aren't laziness.
They're part of the focus cycle itself.

The real question isn't:
> "Should I take a break?"

It's:
> "What kind of break actually helps my brain recover?"

## What Actually Restores Focus?

### 1. Deep rest without stimulation

Sometimes the most effective break is also the simplest:
lying down, closing your eyes, and letting your brain slow down for a few minutes.

Practices like guided relaxation, yoga nidra, or NSDR (non-sleep deep rest) can help reduce mental fatigue and restore attention after intense focus.

Even five to ten minutes can make a noticeable difference.

The key is low stimulation.

No notifications.
No scrolling.
No constant input.

Just mental quiet.

## 2. Going outside

Your brain rests differently in nature than it does online.

Natural environments gently hold your attention without demanding effort. Trees moving in the wind, changing light, distant sounds — your brain engages with them passively instead of fighting to concentrate.

That's why even a short walk outside often feels more refreshing than sitting on your phone for the same amount of time.

You don't need a forest.
Even a few minutes outdoors helps.

## 3. Physical movement

One of the worst break habits is staying mentally overloaded while remaining physically still.

A short walk, stretching, or light movement helps reset attention and reduce the feeling of cognitive stagnation that builds during long work sessions.

Movement also creates a psychological reset:
> the work session feels complete, and the next one feels easier to begin.

Even five minutes matters.

## 4. Brief social interaction

Humans regulate stress socially.

A short positive conversation — even a quick check-in with a friend or coworker — can reduce stress and mentally reset your mood before returning to work.

The important part is that it feels restorative, not draining.

## What Makes Breaks Worse?

### Doom-scrolling

Social media often gives your brain fragmented bursts of stimulation without actual recovery.

You consume dozens of unrelated pieces of information in minutes:
videos, arguments, headlines, notifications, memes.

Your attention never fully settles.

So even after "resting," your brain still feels scattered.

### Email and work messages

Checking Slack or email during a break doesn't let your brain disengage from work.

You're still cognitively "on."

The task changed.
The mental load didn't.

### High-stimulation content

Fast-paced videos, loud content, or constant information overload can keep your nervous system activated instead of helping it recover.

Sometimes the best break is the least stimulating one.

## Breaks Should Match the Work

A five-minute break might be enough after answering emails.

It probably isn't enough after 90 minutes of deep concentration.

Longer focus sessions create deeper mental fatigue, which means your brain usually needs more recovery time afterward.

That's the idea behind Flexodoro's break system.

Instead of forcing identical breaks every cycle, Flexible Mode scales recovery based on the intensity and duration of your focus session.

Because good breaks aren't wasted time.
They're what make sustained focus possible in the first place.`,
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
    subtitle: 'The research on sleep and cognitive performance is unambiguous — and massively underrated',
    category: 'science',
    readTime: 4,
    date: 'April 14, 2026',
    tags: ['Sleep', 'Cognitive Performance', 'Recovery'],
    emoji: '🌙',
    excerpt:
      "Most focus problems are sleep problems in disguise. A tired brain becomes worse at attention, decision-making, memory, and resisting distraction.",
    content: `## What Sleep Actually Does for Your Brain

Sleep is not passive downtime.

While you're asleep, your brain is doing active maintenance work:
- consolidating memories
- regulating emotions
- restoring attention systems
- clearing metabolic waste
- resetting neurotransmitter balance

These aren't optional background processes.
They're the biological foundation of cognitive performance.

When sleep quality drops, focus is usually one of the first things to suffer.

## What Sleep Deprivation Does to Focus

Even losing 1–2 hours of sleep has measurable effects on cognitive function.

A sleep-deprived brain struggles with:

### Sustained attention

You miss details more easily.
Reaction time slows down.
Simple mistakes become more common.

### Working memory

Holding multiple ideas in mind becomes harder.

This is why tired people often reread the same sentence repeatedly or lose track of what they were doing halfway through a task.

### Inhibitory control

Filtering distractions takes more effort.

Notifications feel more tempting.
Task-switching becomes harder to resist.
Focus feels fragile.

### Emotional regulation

Sleep deprivation lowers frustration tolerance and increases emotional reactivity.

Small problems feel bigger.
Difficult tasks feel heavier.
Motivation drops faster.

Research has even shown that staying awake for long enough can impair cognitive performance similarly to alcohol intoxication.

You wouldn't intentionally try to work drunk.
Yet many people regularly try to do deep work while severely sleep deprived.

## Sleep and ADHD

Sleep problems are extremely common in people with ADHD.

Many ADHD brains naturally run on a delayed schedule, making early sleep and early waking feel unusually difficult. This isn't laziness or lack of discipline — it's partly biological.

At the same time, poor sleep makes ADHD symptoms significantly worse:
- distractibility increases
- emotional regulation gets harder
- task initiation becomes more difficult
- focus feels less stable

It becomes a feedback loop:
poor sleep worsens attention, and attention difficulties make healthy sleep routines harder to maintain.

## Practical Ways to Improve Sleep Quality

### Keep your wake-up time consistent

A stable wake-up time matters more than most people realize.

Your brain regulates sleep through circadian rhythms, and waking at wildly different times every day confuses that system.

Consistency helps your body predict when to feel alert and when to feel tired.

### Get morning sunlight

Morning light is one of the strongest signals your brain receives for regulating energy and sleep timing.

Even 5–10 minutes of outdoor light shortly after waking can help stabilize your circadian rhythm and improve nighttime sleep quality.

### Cut caffeine earlier than you think

Caffeine doesn't remove tiredness.
It temporarily blocks your brain's ability to feel it.

That means late-day caffeine can delay sleep pressure even when you feel exhausted.

For many people, stopping caffeine by early afternoon noticeably improves sleep onset.

### Keep your sleeping environment cool

Your body temperature naturally drops before sleep.

A cooler room helps that process happen more efficiently, making it easier to fall asleep and stay asleep.

## Sleep Is a Productivity Tool

No timer technique, focus playlist, or productivity app can fully compensate for a chronically exhausted brain.

Sleep isn't time stolen from productivity.

Sleep is what makes sustained focus, emotional stability, learning, and deep work possible in the first place.

A rested brain doesn't just work harder.
It works better.`,
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
    } else if (line.startsWith('### ')) {
      nodes.push(
        <h3
          key={i}
          style={{
            fontSize: 15,
            fontWeight: 700,
            color: '#E8E8F0',
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.01em',
            marginTop: 24,
            marginBottom: 10,
          }}
        >
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('> ')) {
      nodes.push(
        <blockquote
          key={i}
          style={{
            margin: '8px 0 16px',
            padding: '10px 14px',
            borderLeft: '3px solid rgba(124, 92, 252, 0.5)',
            background: 'rgba(124, 92, 252, 0.08)',
            borderRadius: 8,
            color: '#C8C8D8',
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {line.replace(/^>\s*/, '')}
        </blockquote>
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openPostId = searchParams.get('post');
  const openPost = POSTS.find((post) => post.id === openPostId) ?? null;
  const [activeCategory, setActiveCategory] = useState<BlogPost['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [openPostId]);

  const openPostInUrl = (post: BlogPost) => {
    router.push(`${pathname}?post=${post.id}`, { scroll: false });
  };

  const closePostInUrl = () => {
    router.replace(pathname, { scroll: false });
  };

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
            <BlogPostView key="post" post={openPost} onBack={closePostInUrl} />
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
                      <BlogCard post={post} onOpen={openPostInUrl} />
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

import Link from "next/link";

const features = [
  {
    title: "Classic Pomodoro presets",
    description:
      "Choose a familiar 25-minute focus session with a 5-minute break, or use the longer 40/10 preset for deeper work.",
  },
  {
    title: "Flexible focus sessions",
    description:
      "Start without committing to an end time. Stop at a natural pause and let Flexodoro suggest a break based on the time you actually worked.",
  },
  {
    title: "Distraction-free tools",
    description:
      "Use deep-work mode, keyboard shortcuts, and optional rain, white-noise, or binaural audio without leaving the timer.",
  },
  {
    title: "Private, useful statistics",
    description:
      "Review completed sessions and weekly focus patterns for this device without creating an account before you can begin.",
  },
];

const steps = [
  {
    number: "01",
    title: "Pick a focus style",
    description:
      "Use Fixed Mode when a clear finish line helps, or Flexible Mode when an arbitrary alarm would interrupt useful momentum.",
  },
  {
    number: "02",
    title: "Work on one thing",
    description:
      "Start the timer, name the task in your own notes, and give it your full attention until the session ends or you reach a natural stopping point.",
  },
  {
    number: "03",
    title: "Take a real break",
    description:
      "Step away for the suggested break, then return for another round. Completed sessions are added to your statistics automatically.",
  },
];

const faqs = [
  {
    question: "Is Flexodoro free to use?",
    answer:
      "Yes. You can open the timer and start a fixed or flexible focus session without creating an account.",
  },
  {
    question: "What is the difference between Fixed and Flexible Mode?",
    answer:
      "Fixed Mode counts down a chosen focus interval such as 25 or 40 minutes. Flexible Mode counts your focused time until you decide to finish, then calculates a proportional break suggestion.",
  },
  {
    question: "Which Pomodoro length should I choose?",
    answer:
      "The 25/5 preset is a practical starting point for routine tasks. Try 40/10 for work that needs more setup or concentration. Flexible Mode is useful when your session length is unpredictable.",
  },
  {
    question: "Does the timer keep accurate time in a background tab?",
    answer:
      "Yes. Flexodoro anchors sessions to timestamps, so the displayed time catches up correctly when the tab is hidden, the browser is throttled, or you return later.",
  },
];

export function LandingSection() {
  return (
    <div className="app-shell space-y-6 pb-16">
      <section
        aria-labelledby="homepage-heading"
        className="surface-card animate-rise overflow-hidden p-6 sm:p-8"
      >
        <div className="brand-grid rounded-xl border border-border p-6 sm:p-10">
          <p className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-center text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            <span aria-hidden="true">⚡</span>
            <span>Free online focus timer</span>
          </p>
          <h1
            id="homepage-heading"
            className="brand-display mx-auto mt-4 max-w-3xl text-center text-4xl font-bold text-foreground sm:text-5xl"
          >
            A Pomodoro timer that works with your focus
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-7 text-muted sm:text-base">
            Flexodoro combines a classic online Pomodoro timer with a flexible mode for
            sessions that do not fit neatly into 25 minutes. Start immediately, stay in
            flow, and take a break that reflects how long you actually worked.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="#timer"
              className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold transition"
            >
              Start a focus session
            </a>
            <a
              href="#how-it-works"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:bg-white/5"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading" className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          Focus your way
        </p>
        <h2 id="features-heading" className="brand-display mt-2 text-3xl font-bold sm:text-4xl">
          One timer for short tasks and deep work
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
          Traditional Pomodoro timers are useful when a deadline helps you begin, but the
          alarm can arrive just as difficult work starts moving. Flexodoro gives you both
          options: predictable countdowns when you need structure and an open-ended session
          when protecting momentum matters more.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-border bg-surface-2/35 p-5">
              <h3 className="text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        className="surface-card p-6 sm:p-8"
      >
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          How Flexodoro works
        </p>
        <h2 id="how-it-works-heading" className="brand-display mt-2 text-3xl font-bold sm:text-4xl">
          Focus, finish, recover
        </h2>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.number} className="rounded-xl border border-border p-5">
              <p className="brand-display text-3xl font-bold text-primary/60">{step.number}</p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="learn-heading" className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          Build a sustainable routine
        </p>
        <h2 id="learn-heading" className="brand-display mt-2 text-3xl font-bold sm:text-4xl">
          Learn what helps attention last
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted sm:text-base">
          A timer is only one part of a focus system. Explore practical guides on attention,
          rest, and adapting structured work sessions to different brains and different
          kinds of work.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/blog/adhd-pomodoro"
            className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
          >
            Pomodoro and ADHD
          </Link>
          <Link
            href="/app/blog/deep-work-science"
            className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
          >
            The science of deep work
          </Link>
          <Link
            href="/app/blog/break-science"
            className="rounded-lg border border-border px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
          >
            How to take better breaks
          </Link>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="surface-card p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">
          Frequently asked questions
        </p>
        <h2 id="faq-heading" className="brand-display mt-2 text-3xl font-bold sm:text-4xl">
          Flexodoro basics
        </h2>
        <div className="mt-6 divide-y divide-border">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-4 first:pt-0 last:pb-0">
              <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-foreground marker:hidden">
                {faq.question}
              </summary>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

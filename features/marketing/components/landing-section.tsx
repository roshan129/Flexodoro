export function LandingSection() {
  const steps = [
    {
      num: "01",
      title: "Start your session",
      desc: "Hit start and enter your natural flow. No rigid timer interruptions.",
    },
    {
      num: "02",
      title: "Work freely",
      desc: "Focus as long as needed and end when your mind reaches a natural pause.",
    },
    {
      num: "03",
      title: "Take a smart break",
      desc: "Flexodoro suggests a break based on your real session duration.",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="surface-card animate-rise overflow-hidden p-6 sm:p-8">
        <div className="brand-grid rounded-xl border border-border p-6 sm:p-8">
          <p className="mx-auto flex w-fit items-center justify-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-4 py-1.5 text-center text-xs font-semibold tracking-[0.12em] text-primary uppercase">
            <span>⚡</span>
            <span>Flow-based Pomodoro timer</span>
          </p>
          <h2 className="brand-display mx-auto mt-4 max-w-3xl text-center text-4xl font-bold text-foreground sm:text-5xl">
            Work with your flow, not against it.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted sm:text-base">
            Flexible focus timer with deep-work mode, ambient sounds, and insights that show
            when you focus best.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href="/app"
              className="btn-primary rounded-md px-5 py-2.5 text-sm font-semibold transition"
            >
              Start Focus Session
            </a>
            <a
              href="#how-it-works"
              className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-muted transition hover:bg-white/5"
            >
              How it works
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Flexible Sessions</p>
              <p className="mt-1 text-xs text-muted">End when your flow ends, not when a bell rings.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Focus Music</p>
              <p className="mt-1 text-xs text-muted">Rain, ambient, and pulse tracks with volume control.</p>
            </div>
            <div className="rounded-lg border border-border bg-surface p-4">
              <p className="text-sm font-semibold">Insight Dashboard</p>
              <p className="mt-1 text-xs text-muted">Daily totals, trends, and best focus windows.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="surface-card animate-rise p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">What Is Flexodoro</p>
        <h3 className="brand-display mt-2 text-3xl font-bold sm:text-4xl">
          Built for how humans actually work
        </h3>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Fixed Pomodoro mode (25/5, 40/10)",
            "Flexible flow mode with manual session end",
            "Smart break calculator",
            "Fullscreen deep-work mode",
            "Minimal interface for distraction-free focus",
            "Live analytics dashboard",
          ].map((feature) => (
            <div key={feature} className="rounded-lg border border-border p-4 text-sm text-muted">
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="surface-card animate-rise p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-primary uppercase">Flexible Mode</p>
        <h3 className="brand-display mt-2 text-3xl font-bold sm:text-4xl">Three steps to flow state</h3>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.num} className="rounded-lg border border-border p-5">
              <p className="brand-display text-3xl font-bold text-primary/60">{step.num}</p>
              <h4 className="mt-3 text-lg font-semibold">{step.title}</h4>
              <p className="mt-2 text-sm text-muted">{step.desc}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

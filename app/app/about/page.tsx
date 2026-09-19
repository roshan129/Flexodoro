import type { Metadata } from "next";
import { AtSign, Coffee, Heart, Mail, Sparkles } from "lucide-react";

const supportEmail = "roswag369@gmail.com";
const xProfileUrl = "https://x.com/roswag369";

export const metadata: Metadata = {
  title: "About Me",
  description:
    "Meet Roshan, the creator of Flexodoro, learn why the focus timer exists, and find support contact details.",
  alternates: {
    canonical: "/app/about",
  },
};

export default function AboutPage() {
  return (
    <div className="app-shell flex-1 py-10 sm:py-14">
      <section className="surface-card animate-rise overflow-hidden">
        <div className="brand-grid border-b border-border px-6 py-10 text-center sm:px-10 sm:py-14">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Sparkles aria-hidden="true" size={22} />
          </div>
          <p className="mt-5 text-xs font-semibold tracking-[0.15em] text-primary uppercase">
            About me
          </p>
          <h1 className="brand-display mx-auto mt-2 max-w-2xl text-4xl font-bold text-foreground sm:text-5xl">
            Hi, I&apos;m Roshan.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted sm:text-base">
            I&apos;m the creator of Flexodoro, which I built to make focused work feel more
            natural. Some days a classic Pomodoro is exactly the structure we need; on
            others, protecting a good flow matters more than stopping when a timer rings.
          </p>
        </div>

        <div className="grid gap-5 p-6 sm:p-10 lg:grid-cols-2">
          <article className="rounded-2xl border border-border bg-surface-2/30 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Heart aria-hidden="true" size={19} />
            </div>
            <h2 className="brand-display mt-5 text-2xl font-bold text-foreground">
              Why Flexodoro exists
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Flexodoro brings fixed sessions, flexible focus, thoughtful breaks, calming
              sounds, and simple statistics into one distraction-free space. The goal is
              straightforward: help you begin, stay present, and build a rhythm that lasts.
            </p>
          </article>

          <article className="rounded-2xl border border-border bg-surface-2/30 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Mail aria-hidden="true" size={19} />
            </div>
            <h2 className="brand-display mt-5 text-2xl font-bold text-foreground">
              Support and feedback
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Found a bug, have a feature idea, or need a little help? Send me an email and
              I&apos;ll get back to you as soon as I can.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-lg border border-primary/35 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/15"
              >
                <Mail aria-hidden="true" size={16} />
                {supportEmail}
              </a>
              <a
                href={xProfileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:bg-primary/5"
                aria-label="Follow Roshan on X (opens in a new tab)"
              >
                <AtSign aria-hidden="true" size={16} />
                @roswag369 on X
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="surface-card mt-6 overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-500">
              <Coffee aria-hidden="true" size={21} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-amber-500 uppercase">
                Coming soon
              </p>
              <h2 className="brand-display mt-1 text-2xl font-bold text-foreground">
                Buy me a coffee
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
                A simple way to support Flexodoro&apos;s development will be available here
                soon. Until then, using the app and sharing feedback already means a lot.
              </p>
            </div>
          </div>
          <button
            type="button"
            disabled
            className="shrink-0 cursor-not-allowed rounded-lg border border-border bg-surface-2 px-5 py-2.5 text-sm font-semibold text-muted opacity-70"
          >
            Coming soon
          </button>
        </div>
      </section>
    </div>
  );
}

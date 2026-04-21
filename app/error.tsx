"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled app error", error);
  }, [error]);

  return (
    <main className="app-shell flex min-h-screen items-center justify-center py-10">
      <section className="surface-card w-full max-w-xl p-8 text-center">
        <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Something went wrong</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">500 - Unexpected error</h1>
        <p className="mt-3 text-sm text-muted">
          We hit an unexpected issue while loading this screen. Try again in a moment.
        </p>

        <button
          type="button"
          onClick={() => reset()}
          className="btn-primary mt-6 rounded-md px-4 py-2 text-sm font-medium transition"
        >
          Try Again
        </button>
      </section>
    </main>
  );
}

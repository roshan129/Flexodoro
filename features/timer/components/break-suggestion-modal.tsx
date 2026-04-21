"use client";

import { formatSeconds } from "@/lib/time";

interface BreakSuggestionModalProps {
  open: boolean;
  workDurationSeconds: number;
  suggestedBreakSeconds: number;
  onStartBreak: () => void;
  onSkip: () => void;
}

export function BreakSuggestionModal({
  open,
  workDurationSeconds,
  suggestedBreakSeconds,
  onStartBreak,
  onSkip,
}: BreakSuggestionModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4">
      <div className="surface-card w-full max-w-md p-6">
        <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Break Suggestion</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Session Complete</h2>

        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <dt className="text-muted">Work Time</dt>
            <dd className="font-semibold tabular-nums">{formatSeconds(workDurationSeconds)}</dd>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <dt className="text-muted">Recommended Break</dt>
            <dd className="font-semibold tabular-nums">{formatSeconds(suggestedBreakSeconds)}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onStartBreak}
            className="btn-primary rounded-md px-4 py-2 text-sm font-medium transition"
          >
            Start Break
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { BreakSuggestionModal } from "@/features/timer/components/break-suggestion-modal";
import { MusicPanel } from "@/features/music/components/music-panel";
import { useFocusAudioEngine } from "@/features/music/hooks/use-focus-audio-engine";
import { formatSeconds } from "@/lib/time";
import { calculateDynamicBreakSeconds } from "@/lib/break";
import { saveSession } from "@/lib/session";
import { useAppStore } from "@/store/use-app-store";
import { useTimerEngine } from "@/features/timer/hooks/use-timer-engine";

export function TimerPanel() {
  useTimerEngine();
  useFocusAudioEngine();

  const mode = useAppStore((state) => state.mode);
  const phase = useAppStore((state) => state.phase);
  const status = useAppStore((state) => state.status);
  const workDurationMinutes = useAppStore((state) => state.workDurationMinutes);
  const breakDurationMinutes = useAppStore((state) => state.breakDurationMinutes);
  const flexibleBreakRatio = useAppStore((state) => state.flexibleBreakRatio);
  const remainingSeconds = useAppStore((state) => state.remainingSeconds);
  const currentWorkStartedAtMs = useAppStore((state) => state.currentWorkStartedAtMs);
  const showBreakSuggestionModal = useAppStore(
    (state) => state.showBreakSuggestionModal,
  );
  const lastWorkDurationSeconds = useAppStore(
    (state) => state.lastWorkDurationSeconds,
  );
  const suggestedBreakSeconds = useAppStore(
    (state) => state.suggestedBreakSeconds,
  );
  const isMinimalUi = useAppStore((state) => state.isMinimalUi);
  const isFullscreenMode = useAppStore((state) => state.isFullscreenMode);

  const setPreset = useAppStore((state) => state.setPreset);
  const setMode = useAppStore((state) => state.setMode);
  const start = useAppStore((state) => state.start);
  const pause = useAppStore((state) => state.pause);
  const reset = useAppStore((state) => state.reset);
  const prepareBreakSuggestion = useAppStore(
    (state) => state.prepareBreakSuggestion,
  );
  const startBreakFromSuggestion = useAppStore(
    (state) => state.startBreakFromSuggestion,
  );
  const skipBreak = useAppStore((state) => state.skipBreak);
  const setMinimalUi = useAppStore((state) => state.setMinimalUi);
  const setFullscreenMode = useAppStore((state) => state.setFullscreenMode);

  useEffect(() => {
    const onChange = () => {
      setFullscreenMode(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
    };
  }, [setFullscreenMode]);

  const handleToggleFullscreen = async () => {
    if (typeof document === "undefined") {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setFullscreenMode(false);
      return;
    }

    await document.documentElement.requestFullscreen();
    setFullscreenMode(true);
  };

  const phaseDurationSeconds =
    phase === "work" ? workDurationMinutes * 60 : breakDurationMinutes * 60;

  const isStartDisabled = status === "running" || remainingSeconds <= 0;
  const isPauseDisabled = status !== "running";
  const isResetDisabled = status === "idle" && remainingSeconds === phaseDurationSeconds;
  const hasWorkProgress =
    currentWorkStartedAtMs !== null || remainingSeconds < workDurationMinutes * 60;
  const isEndSessionDisabled = phase !== "work" || !hasWorkProgress;

  const handleEndSession = () => {
    if (isEndSessionDisabled) {
      return;
    }

    const now = Date.now();
    const endedAt = new Date(now);
    const workedDurationSeconds =
      currentWorkStartedAtMs !== null
        ? Math.max(1, Math.round((now - currentWorkStartedAtMs) / 1000))
        : Math.max(1, workDurationMinutes * 60 - remainingSeconds);
    const suggestedBreak = calculateDynamicBreakSeconds(
      workedDurationSeconds,
      flexibleBreakRatio,
    );
    const startedAt = new Date(now - workedDurationSeconds * 1000);

    prepareBreakSuggestion(workedDurationSeconds, suggestedBreak);

    void saveSession({
      mode: mode === "fixed" ? "FIXED" : "FLEXIBLE",
      type: "WORK",
      durationSec: workedDurationSeconds,
      startedAt: startedAt.toISOString(),
      endedAt: endedAt.toISOString(),
    });
  };

  if (isMinimalUi) {
    return (
      <section className="surface-card animate-rise relative p-6 sm:p-8">
        <button
          type="button"
          onClick={() => setMinimalUi(false)}
          className="absolute right-4 top-4 rounded-md border border-border px-3 py-1 text-xs font-medium"
        >
          Exit Minimal
        </button>

        <div className="flex min-h-[56vh] items-center justify-center">
          <p
            key={remainingSeconds}
            className="animate-pulse-soft text-center text-7xl font-semibold tracking-tight tabular-nums sm:text-8xl md:text-9xl"
          >
            {formatSeconds(remainingSeconds)}
          </p>
        </div>

        <BreakSuggestionModal
          open={showBreakSuggestionModal}
          workDurationSeconds={lastWorkDurationSeconds}
          suggestedBreakSeconds={suggestedBreakSeconds}
          onStartBreak={startBreakFromSuggestion}
          onSkip={skipBreak}
        />
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="surface-card animate-rise p-6 sm:p-8">
        <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Timer Core</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setMode("fixed")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              mode === "fixed"
                ? "btn-primary border-transparent"
                : "border-border hover:bg-white/5"
            }`}
          >
            Fixed
          </button>
          <button
            type="button"
            onClick={() => setMode("flexible")}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              mode === "flexible"
                ? "btn-primary border-transparent"
                : "border-border hover:bg-white/5"
            }`}
          >
            Flexible
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:bg-white/5"
          >
            {isFullscreenMode ? "Exit Fullscreen" : "Fullscreen"}
          </button>
          <button
            type="button"
            onClick={() => setMinimalUi(true)}
            className="rounded-full border border-border px-3 py-1 text-xs font-medium transition hover:bg-white/5"
          >
            Minimal Interface
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs font-medium sm:justify-start">
          <span className="rounded-full border border-border px-3 py-1">Mode: {mode}</span>
          <span className="rounded-full border border-border px-3 py-1">Phase: {phase}</span>
          <span className="rounded-full border border-border px-3 py-1">Status: {status}</span>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">Time Remaining</p>
          <p
            key={remainingSeconds}
            className="animate-pulse-soft mt-2 text-6xl font-semibold tracking-tight tabular-nums sm:text-7xl md:text-8xl"
          >
            {formatSeconds(remainingSeconds)}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-primary min-w-24 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-45"
            onClick={start}
            disabled={isStartDisabled}
          >
            Start
          </button>
          <button
            type="button"
            className="min-w-24 rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={pause}
            disabled={isPauseDisabled}
          >
            Pause
          </button>
          <button
            type="button"
            className="min-w-24 rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={reset}
            disabled={isResetDisabled}
          >
            Reset
          </button>
          <button
            type="button"
            className="min-w-24 rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={handleEndSession}
            disabled={isEndSessionDisabled}
          >
            End Session
          </button>
        </div>

        <div className="mt-8 border-t border-border pt-6">
          <p className="text-sm font-medium">Fixed Pomodoro Presets</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-white/5"
              onClick={() => setPreset(25, 5)}
            >
              25 / 5
            </button>
            <button
              type="button"
              className="rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-white/5"
              onClick={() => setPreset(40, 10)}
            >
              40 / 10
            </button>
          </div>
        </div>

        <BreakSuggestionModal
          open={showBreakSuggestionModal}
          workDurationSeconds={lastWorkDurationSeconds}
          suggestedBreakSeconds={suggestedBreakSeconds}
          onStartBreak={startBreakFromSuggestion}
          onSkip={skipBreak}
        />
      </section>

      <MusicPanel />
    </div>
  );
}

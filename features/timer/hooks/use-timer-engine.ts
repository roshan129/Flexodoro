"use client";

import { useEffect, useRef } from "react";
import { calculateDynamicBreakSeconds } from "@/lib/break";
import { saveSession } from "@/lib/session";
import { useAppStore } from "@/store/use-app-store";

function playTransitionBeep() {
  if (typeof window === "undefined") {
    return;
  }

  const audioContext = new window.AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 880;
  gain.gain.value = 0.08;

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.18);

  oscillator.onended = () => {
    audioContext.close().catch(() => {
      // Ignore cleanup errors.
    });
  };
}

export function useTimerEngine() {
  const status = useAppStore((state) => state.status);
  const flexibleBreakRatio = useAppStore((state) => state.flexibleBreakRatio);
  const setRemainingSeconds = useAppStore((state) => state.setRemainingSeconds);
  const completeCurrentPhase = useAppStore((state) => state.completeCurrentPhase);
  const prepareBreakSuggestion = useAppStore((state) => state.prepareBreakSuggestion);

  const intervalRef = useRef<number | null>(null);
  const targetEndMsRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const clearTicking = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (status !== "running") {
      clearTicking();
      targetEndMsRef.current = null;
      isTransitioningRef.current = false;
      return;
    }

    if (targetEndMsRef.current === null) {
      const currentRemaining = useAppStore.getState().remainingSeconds;
      targetEndMsRef.current = Date.now() + currentRemaining * 1000;
    }

    const tick = () => {
      const targetEndMs = targetEndMsRef.current;
      if (targetEndMs === null) {
        return;
      }

      const diffMs = targetEndMs - Date.now();

      if (diffMs <= 0) {
        if (isTransitioningRef.current) {
          return;
        }

        isTransitioningRef.current = true;
        setRemainingSeconds(0);

        const snapshot = useAppStore.getState();
        const endedAt = new Date();

        if (snapshot.phase === "work") {
          const workedDurationSeconds =
            snapshot.currentWorkStartedAtMs !== null
              ? Math.max(
                  1,
                  Math.round((Date.now() - snapshot.currentWorkStartedAtMs) / 1000),
                )
              : snapshot.workDurationMinutes * 60;

          const startedAt = new Date(endedAt.getTime() - workedDurationSeconds * 1000);

          void saveSession({
            mode: snapshot.mode === "fixed" ? "FIXED" : "FLEXIBLE",
            type: "WORK",
            durationSec: workedDurationSeconds,
            startedAt: startedAt.toISOString(),
            endedAt: endedAt.toISOString(),
          });

          if (snapshot.mode === "fixed") {
            completeCurrentPhase();
            playTransitionBeep();
          } else {
            const suggestedBreakSeconds =
              calculateDynamicBreakSeconds(workedDurationSeconds, flexibleBreakRatio);
            prepareBreakSuggestion(workedDurationSeconds, suggestedBreakSeconds);
          }
        } else {
          completeCurrentPhase();
        }

        const nextState = useAppStore.getState();
        if (nextState.status === "running") {
          targetEndMsRef.current = Date.now() + nextState.remainingSeconds * 1000;
        } else {
          clearTicking();
          targetEndMsRef.current = null;
        }

        isTransitioningRef.current = false;

        return;
      }

      const nextRemaining = Math.ceil(diffMs / 1000);
      if (nextRemaining !== useAppStore.getState().remainingSeconds) {
        setRemainingSeconds(nextRemaining);
      }
    };

    tick();
    intervalRef.current = window.setInterval(tick, 250);

    return () => {
      clearTicking();
    };
  }, [
    status,
    setRemainingSeconds,
    completeCurrentPhase,
    prepareBreakSuggestion,
    flexibleBreakRatio,
  ]);
}

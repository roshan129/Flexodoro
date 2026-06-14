"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAppStore } from "@/store/use-app-store";

type SafariAudioWindow = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

function getAudioContextConstructor() {
  if (typeof window === "undefined") {
    return null;
  }

  const audioWindow = window as SafariAudioWindow;
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

const FADE_OUT_TIME_CONSTANT_SECONDS = 0.18;
const STOP_AFTER_FADE_MS = 650;
const TRACK_VOLUME_CAPS: Partial<Record<"deep-focus" | "soft-rain" | "alpha-pulse", number>> = {
  "deep-focus": 0.25,
  "alpha-pulse": 0.25,
};

function getEffectiveTrackVolume(
  trackId: "deep-focus" | "soft-rain" | "alpha-pulse",
  volume: number,
) {
  return Math.min(volume, TRACK_VOLUME_CAPS[trackId] ?? 1);
}

export function useFocusAudioEngine() {
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const isMusicPlaying = useAppStore((state) => state.isMusicPlaying);
  const musicVolume = useAppStore((state) => state.musicVolume);

  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopCurrentRef = useRef<(() => void) | null>(null);
  const stopAfterFadeRef = useRef<number | null>(null);
  const rainAudioRef = useRef<HTMLAudioElement | null>(null);

  const ensureAudioContext = useCallback(() => {
    if (typeof window === "undefined") {
      return null;
    }

    if (!contextRef.current) {
      const AudioContextConstructor = getAudioContextConstructor();
      if (!AudioContextConstructor) {
        return null;
      }

      contextRef.current = new AudioContextConstructor();
      masterRef.current = contextRef.current.createGain();
      masterRef.current.gain.value = 0;
      masterRef.current.connect(contextRef.current.destination);
    }

    if (contextRef.current.state === "suspended") {
      void contextRef.current.resume().catch(() => {
        // Safari may reject resume calls that are not tied to a user gesture.
      });
    }

    return contextRef.current;
  }, []);

  const clearStopAfterFade = useCallback(() => {
    if (stopAfterFadeRef.current !== null) {
      window.clearTimeout(stopAfterFadeRef.current);
      stopAfterFadeRef.current = null;
    }
  }, []);

  const stopCurrentSource = useCallback(() => {
    if (!stopCurrentRef.current) {
      return;
    }

    const stopCurrent = stopCurrentRef.current;
    stopCurrentRef.current = null;

    try {
      stopCurrent();
    } catch {
      // Oscillator/source nodes can throw if the browser already stopped them.
    }
  }, []);

  const stopRainTrack = useCallback(() => {
    const rainAudio = rainAudioRef.current;
    rainAudioRef.current = null;

    if (!rainAudio) {
      return;
    }

    try {
      rainAudio.pause();
      rainAudio.currentTime = 0;
      rainAudio.src = "";
      rainAudio.load();
    } catch {
      // Audio elements can throw if the browser has already torn them down.
    }
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      ensureAudioContext();
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });
    window.addEventListener("touchend", unlockAudio, { once: true });
    window.addEventListener("keydown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("touchend", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, [ensureAudioContext]);

  useEffect(() => {
    if (!isMusicPlaying) {
      const context = contextRef.current;
      const masterGain = masterRef.current;

      clearStopAfterFade();

      if (context && masterGain) {
        masterGain.gain.cancelScheduledValues(context.currentTime);
        masterGain.gain.setTargetAtTime(
          0,
          context.currentTime,
          FADE_OUT_TIME_CONSTANT_SECONDS,
        );

        stopAfterFadeRef.current = window.setTimeout(() => {
          stopCurrentSource();
        }, STOP_AFTER_FADE_MS);
      }

      return () => {
        clearStopAfterFade();
      };
    }

    if (typeof window === "undefined") {
      return;
    }

    const context = ensureAudioContext();
    const masterGain = masterRef.current;
    if (!context || !masterGain) {
      return;
    }

    if (context.state === "suspended") {
      void context.resume().catch(() => {
        // Keep the UI usable even when the browser blocks audio resume.
      });
    }

    clearStopAfterFade();
    stopCurrentSource();

    let cleanup: (() => void) | null = null;

    if (selectedTrackId === "deep-focus") {
      const oscA = context.createOscillator();
      const oscB = context.createOscillator();
      const lfo = context.createOscillator();
      const lfoGain = context.createGain();
      const toneGain = context.createGain();

      oscA.type = "sine";
      oscB.type = "triangle";
      oscA.frequency.value = 110;
      oscB.frequency.value = 164.81;

      lfo.type = "sine";
      lfo.frequency.value = 0.08;
      lfoGain.gain.value = 8;
      toneGain.gain.value = 0.25;

      lfo.connect(lfoGain);
      lfoGain.connect(oscA.frequency);

      oscA.connect(toneGain);
      oscB.connect(toneGain);
      toneGain.connect(masterGain);

      oscA.start();
      oscB.start();
      lfo.start();

      cleanup = () => {
        oscA.stop();
        oscB.stop();
        lfo.stop();
        oscA.disconnect();
        oscB.disconnect();
        lfo.disconnect();
        lfoGain.disconnect();
        toneGain.disconnect();
      };
    }

    if (selectedTrackId === "soft-rain") {
      const rainAudio = new Audio("/sounds/10-min-rain-sound.mp3");
      rainAudio.preload = "auto";
      rainAudio.loop = true;
      rainAudio.volume = 1;

      const rainSource = context.createMediaElementSource(rainAudio);
      const rainGain = context.createGain();

      rainGain.gain.value = 0.35;
      rainSource.connect(rainGain);
      rainGain.connect(masterGain);

      rainAudioRef.current = rainAudio;

      void rainAudio.play().catch(() => {
        // Playback may be blocked until the next user gesture.
      });

      cleanup = () => {
        rainSource.disconnect();
        rainGain.disconnect();
        stopRainTrack();
      };
    }

    if (selectedTrackId === "alpha-pulse") {
      const carrier = context.createOscillator();
      const pulseGain = context.createGain();
      const pulseLfo = context.createOscillator();
      const pulseDepth = context.createGain();

      carrier.type = "sine";
      carrier.frequency.value = 220;
      pulseGain.gain.value = 0.18;

      pulseLfo.type = "triangle";
      pulseLfo.frequency.value = 8;
      pulseDepth.gain.value = 0.12;

      pulseLfo.connect(pulseDepth);
      pulseDepth.connect(pulseGain.gain);

      carrier.connect(pulseGain);
      pulseGain.connect(masterGain);

      carrier.start();
      pulseLfo.start();

      cleanup = () => {
        carrier.stop();
        pulseLfo.stop();
        carrier.disconnect();
        pulseGain.disconnect();
        pulseLfo.disconnect();
        pulseDepth.disconnect();
      };
    }

    stopCurrentRef.current = () => {
      if (cleanup) {
        cleanup();
      }
    };

    masterGain.gain.cancelScheduledValues(context.currentTime);
    masterGain.gain.setTargetAtTime(
      getEffectiveTrackVolume(selectedTrackId, musicVolume),
      context.currentTime,
      0.08,
    );

    return undefined;
  }, [
    selectedTrackId,
    isMusicPlaying,
    musicVolume,
    ensureAudioContext,
    clearStopAfterFade,
    stopCurrentSource,
    stopRainTrack,
  ]);

  useEffect(() => {
    const context = contextRef.current;
    const masterGain = masterRef.current;

    if (!context || !masterGain) {
      return;
    }

    masterGain.gain.cancelScheduledValues(context.currentTime);
    masterGain.gain.setTargetAtTime(
      isMusicPlaying
        ? getEffectiveTrackVolume(selectedTrackId, musicVolume)
        : 0,
      context.currentTime,
      0.08,
    );
  }, [musicVolume, isMusicPlaying, selectedTrackId]);

  useEffect(() => {
    return () => {
      clearStopAfterFade();
      stopCurrentSource();
      stopRainTrack();
    };
  }, [clearStopAfterFade, stopCurrentSource, stopRainTrack]);
}

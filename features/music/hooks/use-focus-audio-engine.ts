"use client";

import { useEffect, useRef } from "react";
import { useAppStore } from "@/store/use-app-store";

function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const bufferSize = context.sampleRate * 2;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  return buffer;
}

export function useFocusAudioEngine() {
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const isMusicPlaying = useAppStore((state) => state.isMusicPlaying);
  const musicVolume = useAppStore((state) => state.musicVolume);

  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const stopCurrentRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isMusicPlaying) {
      if (masterRef.current) {
        masterRef.current.gain.setTargetAtTime(
          0,
          contextRef.current?.currentTime ?? 0,
          0.04,
        );
      }
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    if (!contextRef.current) {
      contextRef.current = new window.AudioContext();
      masterRef.current = contextRef.current.createGain();
      masterRef.current.gain.value = 0;
      masterRef.current.connect(contextRef.current.destination);
    }

    const context = contextRef.current;
    const masterGain = masterRef.current;
    if (!context || !masterGain) {
      return;
    }

    void context.resume();

    if (stopCurrentRef.current) {
      stopCurrentRef.current();
      stopCurrentRef.current = null;
    }

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
      const noiseSource = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const rainGain = context.createGain();

      noiseSource.buffer = createNoiseBuffer(context);
      noiseSource.loop = true;

      filter.type = "lowpass";
      filter.frequency.value = 1400;
      rainGain.gain.value = 0.35;

      noiseSource.connect(filter);
      filter.connect(rainGain);
      rainGain.connect(masterGain);

      noiseSource.start();

      cleanup = () => {
        noiseSource.stop();
        noiseSource.disconnect();
        filter.disconnect();
        rainGain.disconnect();
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
    masterGain.gain.setTargetAtTime(musicVolume, context.currentTime, 0.08);

    return () => {
      if (stopCurrentRef.current) {
        stopCurrentRef.current();
        stopCurrentRef.current = null;
      }
    };
  }, [selectedTrackId, isMusicPlaying, musicVolume]);

  useEffect(() => {
    const context = contextRef.current;
    const masterGain = masterRef.current;

    if (!context || !masterGain) {
      return;
    }

    masterGain.gain.cancelScheduledValues(context.currentTime);
    masterGain.gain.setTargetAtTime(
      isMusicPlaying ? musicVolume : 0,
      context.currentTime,
      0.08,
    );
  }, [musicVolume, isMusicPlaying]);
}

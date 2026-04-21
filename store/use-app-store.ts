import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerStatus = "idle" | "running" | "paused";
export type TimerMode = "fixed" | "flexible";
export type TimerPhase = "work" | "break";

export type MusicTrackId = "deep-focus" | "soft-rain" | "alpha-pulse";

interface AppState {
  isDarkMode: boolean;
  mode: TimerMode;
  status: TimerStatus;
  phase: TimerPhase;
  workDurationMinutes: number;
  breakDurationMinutes: number;
  flexibleBreakRatio: number;
  remainingSeconds: number;
  transitionCount: number;
  currentWorkStartedAtMs: number | null;
  showBreakSuggestionModal: boolean;
  lastWorkDurationSeconds: number;
  suggestedBreakSeconds: number;
  isMinimalUi: boolean;
  isFullscreenMode: boolean;
  selectedTrackId: MusicTrackId;
  isMusicPlaying: boolean;
  musicVolume: number;
  toggleDarkMode: () => void;
  setMode: (mode: TimerMode) => void;
  setPreset: (workMinutes: number, breakMinutes: number) => void;
  setDurations: (workMinutes: number, breakMinutes: number) => void;
  setFlexibleBreakRatio: (ratio: number) => void;
  setRemainingSeconds: (seconds: number) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  completeCurrentPhase: () => void;
  prepareBreakSuggestion: (workDurationSeconds: number, suggestedBreakSeconds: number) => void;
  startBreakFromSuggestion: () => void;
  skipBreak: () => void;
  setMinimalUi: (value: boolean) => void;
  setFullscreenMode: (value: boolean) => void;
  setSelectedTrackId: (trackId: MusicTrackId) => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicVolume: (volume: number) => void;
}

const defaultWorkMinutes = 25;
const defaultBreakMinutes = 5;
const defaultFlexibleBreakRatio = 0.2;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      isDarkMode: true,
      mode: "fixed",
      status: "idle",
      phase: "work",
      workDurationMinutes: defaultWorkMinutes,
      breakDurationMinutes: defaultBreakMinutes,
      flexibleBreakRatio: defaultFlexibleBreakRatio,
      remainingSeconds: defaultWorkMinutes * 60,
      transitionCount: 0,
      currentWorkStartedAtMs: null,
      showBreakSuggestionModal: false,
      lastWorkDurationSeconds: 0,
      suggestedBreakSeconds: defaultBreakMinutes * 60,
      isMinimalUi: false,
      isFullscreenMode: false,
      selectedTrackId: "deep-focus",
      isMusicPlaying: false,
      musicVolume: 0.5,

      toggleDarkMode: () => {
        set((state) => ({ isDarkMode: !state.isDarkMode }));
      },

      setMode: (mode) => {
        const workDurationMinutes = get().workDurationMinutes;

        set({
          mode,
          phase: "work",
          status: "idle",
          remainingSeconds: workDurationMinutes * 60,
          currentWorkStartedAtMs: null,
          showBreakSuggestionModal: false,
        });
      },

      setPreset: (workMinutes, breakMinutes) => {
        set({
          workDurationMinutes: workMinutes,
          breakDurationMinutes: breakMinutes,
          phase: "work",
          remainingSeconds: workMinutes * 60,
          status: "idle",
          currentWorkStartedAtMs: null,
          showBreakSuggestionModal: false,
        });
      },

      setDurations: (workMinutes, breakMinutes) => {
        set({
          workDurationMinutes: Math.max(1, Math.round(workMinutes)),
          breakDurationMinutes: Math.max(1, Math.round(breakMinutes)),
        });
      },

      setFlexibleBreakRatio: (ratio) => {
        set({
          flexibleBreakRatio: Math.min(0.5, Math.max(0.1, Number(ratio.toFixed(2)))),
        });
      },

      setRemainingSeconds: (seconds) => {
        set({ remainingSeconds: Math.max(0, Math.round(seconds)) });
      },

      start: () => {
        const state = get();
        if (state.remainingSeconds <= 0) {
          return;
        }

        set({
          status: "running",
          isMusicPlaying: true,
          currentWorkStartedAtMs:
            state.phase === "work" && state.currentWorkStartedAtMs === null
              ? Date.now()
              : state.currentWorkStartedAtMs,
        });
      },

      pause: () => {
        set({
          status: "paused",
          isMusicPlaying: false,
        });
      },

      reset: () => {
        const { phase, workDurationMinutes, breakDurationMinutes } = get();
        const resetSeconds =
          phase === "work" ? workDurationMinutes * 60 : breakDurationMinutes * 60;

        set({
          status: "idle",
          isMusicPlaying: false,
          remainingSeconds: resetSeconds,
          currentWorkStartedAtMs: phase === "work" ? null : get().currentWorkStartedAtMs,
          showBreakSuggestionModal: false,
        });
      },

      completeCurrentPhase: () => {
        set((state) => {
          if (state.phase === "work") {
            return {
              phase: "break",
              status: "running",
              remainingSeconds: state.breakDurationMinutes * 60,
              transitionCount: state.transitionCount + 1,
              currentWorkStartedAtMs: null,
            };
          }

          return {
            phase: "work",
            status: "idle",
            remainingSeconds: state.workDurationMinutes * 60,
            transitionCount: state.transitionCount + 1,
          };
        });
      },

      prepareBreakSuggestion: (workDurationSeconds, suggestedBreakSeconds) => {
        set({
          phase: "work",
          status: "idle",
          currentWorkStartedAtMs: null,
          showBreakSuggestionModal: true,
          lastWorkDurationSeconds: Math.max(0, Math.round(workDurationSeconds)),
          suggestedBreakSeconds: Math.max(0, Math.round(suggestedBreakSeconds)),
        });
      },

      startBreakFromSuggestion: () => {
        const { suggestedBreakSeconds, transitionCount } = get();
        set({
          phase: "break",
          status: "running",
          remainingSeconds: suggestedBreakSeconds,
          showBreakSuggestionModal: false,
          transitionCount: transitionCount + 1,
        });
      },

      skipBreak: () => {
        const { workDurationMinutes, transitionCount } = get();
        set({
          phase: "work",
          status: "idle",
          remainingSeconds: workDurationMinutes * 60,
          showBreakSuggestionModal: false,
          transitionCount: transitionCount + 1,
          currentWorkStartedAtMs: null,
        });
      },

      setMinimalUi: (value) => {
        set({ isMinimalUi: value });
      },

      setFullscreenMode: (value) => {
        set({ isFullscreenMode: value });
      },

      setSelectedTrackId: (trackId) => {
        set({ selectedTrackId: trackId });
      },

      setMusicPlaying: (playing) => {
        set({ isMusicPlaying: playing });
      },

      setMusicVolume: (volume) => {
        set({ musicVolume: Math.min(1, Math.max(0, volume)) });
      },
    }),
    {
      name: "flexodoro-store",
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        mode: state.mode,
        workDurationMinutes: state.workDurationMinutes,
        breakDurationMinutes: state.breakDurationMinutes,
        flexibleBreakRatio: state.flexibleBreakRatio,
        selectedTrackId: state.selectedTrackId,
        musicVolume: state.musicVolume,
      }),
    },
  ),
);

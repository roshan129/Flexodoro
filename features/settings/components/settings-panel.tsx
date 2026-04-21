"use client";

import { useAppStore } from "@/store/use-app-store";

export function SettingsPanel() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const mode = useAppStore((state) => state.mode);
  const workDurationMinutes = useAppStore((state) => state.workDurationMinutes);
  const breakDurationMinutes = useAppStore((state) => state.breakDurationMinutes);
  const flexibleBreakRatio = useAppStore((state) => state.flexibleBreakRatio);

  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const setMode = useAppStore((state) => state.setMode);
  const setDurations = useAppStore((state) => state.setDurations);
  const setFlexibleBreakRatio = useAppStore((state) => state.setFlexibleBreakRatio);

  return (
    <section className="surface-card animate-rise p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Settings</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">User Preferences</h3>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="rounded-lg border border-border p-4">
          <span className="text-xs text-muted">Theme</span>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="mt-2 w-full rounded-md border border-border px-3 py-2 text-sm font-medium transition hover:bg-white/5"
          >
            {isDarkMode ? "Dark" : "Light"}
          </button>
        </label>

        <label className="rounded-lg border border-border p-4">
          <span className="text-xs text-muted">Default Mode</span>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as "fixed" | "flexible")}
            className="mt-2 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="fixed">Fixed</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="rounded-lg border border-border p-4">
          <span className="text-xs text-muted">Work Duration (minutes)</span>
          <input
            type="number"
            min={1}
            max={120}
            value={workDurationMinutes}
            onChange={(event) => setDurations(Number(event.target.value), breakDurationMinutes)}
            className="mt-2 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </label>

        <label className="rounded-lg border border-border p-4">
          <span className="text-xs text-muted">Break Duration (minutes)</span>
          <input
            type="number"
            min={1}
            max={60}
            value={breakDurationMinutes}
            onChange={(event) => setDurations(workDurationMinutes, Number(event.target.value))}
            className="mt-2 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="mt-4 block rounded-lg border border-border p-4">
        <span className="text-xs text-muted">Flexible Break Ratio ({Math.round(flexibleBreakRatio * 100)}%)</span>
        <input
          type="range"
          min={0.1}
          max={0.5}
          step={0.01}
          value={flexibleBreakRatio}
          onChange={(event) => setFlexibleBreakRatio(Number(event.target.value))}
          className="mt-3 w-full accent-primary"
        />
      </label>
    </section>
  );
}

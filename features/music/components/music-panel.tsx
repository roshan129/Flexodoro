"use client";

import { FOCUS_TRACKS } from "@/features/music/lib/tracks";
import { useAppStore } from "@/store/use-app-store";

export function MusicPanel() {
  const selectedTrackId = useAppStore((state) => state.selectedTrackId);
  const isMusicPlaying = useAppStore((state) => state.isMusicPlaying);
  const musicVolume = useAppStore((state) => state.musicVolume);
  const setSelectedTrackId = useAppStore((state) => state.setSelectedTrackId);
  const setMusicPlaying = useAppStore((state) => state.setMusicPlaying);
  const setMusicVolume = useAppStore((state) => state.setMusicVolume);

  return (
    <section className="surface-card animate-rise p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.15em] text-muted uppercase">Focus Music</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">Audio Engine</h3>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {FOCUS_TRACKS.map((track) => (
          <button
            key={track.id}
            type="button"
            onClick={() => setSelectedTrackId(track.id)}
            className={`rounded-lg border p-3 text-left transition ${
              selectedTrackId === track.id
                ? "border-transparent btn-primary"
                : "border-border hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <p className="text-sm font-semibold">{track.name}</p>
            <p className="mt-1 text-xs opacity-80">{track.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={() => setMusicPlaying(!isMusicPlaying)}
          className="btn-primary rounded-md px-4 py-2 text-sm font-medium transition"
        >
          {isMusicPlaying ? "Pause" : "Play"}
        </button>

        <label className="flex items-center gap-3 text-sm">
          <span className="text-muted">Volume</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={musicVolume}
            onChange={(event) => setMusicVolume(Number(event.target.value))}
            className="w-40 accent-primary"
          />
        </label>
      </div>
    </section>
  );
}

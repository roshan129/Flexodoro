import type { MusicTrackId } from "@/store/use-app-store";

export interface FocusTrack {
  id: MusicTrackId;
  name: string;
  description: string;
}

export const FOCUS_TRACKS: FocusTrack[] = [
  {
    id: "deep-focus",
    name: "Deep Focus",
    description: "Warm drone with slow movement",
  },
  {
    id: "soft-rain",
    name: "Soft Rain",
    description: "Noise-based ambience",
  },
  {
    id: "alpha-pulse",
    name: "Alpha Pulse",
    description: "Gentle rhythmic pulse",
  },
];

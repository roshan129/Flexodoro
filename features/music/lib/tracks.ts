import type { MusicTrackId } from "@/store/use-app-store";

export interface FocusTrack {
  id: MusicTrackId;
  name: string;
  description: string;
}

export const FOCUS_TRACKS: FocusTrack[] = [
  {
    id: "soft-rain",
    name: "Soft Rain",
    description: "10-minute looping rain recording",
  },
  {
    id: "alpha-pulse",
    name: "White Noise",
    description: "Continuous noise ambience",
  },
  {
    id: "binaural-40hz",
    name: "40Hz Binaural",
    description: "Stereo tone pair for headphones",
  },
];

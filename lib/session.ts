import { getOrCreateDeviceId } from "@/lib/device-id";

interface SaveSessionInput {
  mode: "FIXED" | "FLEXIBLE";
  type: "WORK" | "BREAK";
  durationSec: number;
  startedAt: string;
  endedAt: string;
}

export async function saveSession(input: SaveSessionInput): Promise<void> {
  try {
    const deviceId = getOrCreateDeviceId();
    await fetch("/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...input,
        deviceId,
      }),
    });
  } catch (error) {
    console.error("Failed to persist session", error);
  }
}

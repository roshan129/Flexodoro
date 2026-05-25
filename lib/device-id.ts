"use client";

const DEVICE_ID_KEY = "flexodoro.device.id";

function generateFallbackId(): string {
  return `device_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    return "unknown";
  }

  const existing = window.localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    return existing;
  }

  const nextId =
    typeof window.crypto !== "undefined" && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID()
      : generateFallbackId();

  window.localStorage.setItem(DEVICE_ID_KEY, nextId);
  return nextId;
}

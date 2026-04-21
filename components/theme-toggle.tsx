"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/use-app-store";

export function ThemeToggle() {
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted transition hover:text-foreground"
      aria-label="Toggle color theme"
    >
      <span suppressHydrationWarning>{isDarkMode ? "Light" : "Dark"}</span>
    </button>
  );
}

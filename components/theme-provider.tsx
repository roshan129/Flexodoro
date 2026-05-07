"use client";

import { useEffect, type ReactNode } from "react";
import { useAppStore } from "@/store/use-app-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const isDarkMode = useAppStore((state) => state.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return children;
}

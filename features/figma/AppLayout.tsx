"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, BookOpen, Timer, Zap, Moon, Sun } from "lucide-react";
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const status = useAppStore((state) => state.status);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const isTimerRunning = status === "running";

  const timerActive = pathname === "/";
  const statsActive = pathname === "/app/stats";
  const blogActive = pathname === "/app/blog";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "var(--background)",
        fontFamily: "'Inter', sans-serif",
        color: "var(--foreground)",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--nav-bg)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 group">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #7C5CFC, #A78BFA)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={14} color="white" fill="white" />
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 600,
                fontSize: 16,
                color: "var(--foreground)",
                letterSpacing: "-0.02em",
              }}
            >
              Flexodoro
            </span>
          </button>

          <nav className="flex items-center gap-1">
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: timerActive ? "#A78BFA" : "var(--muted)",
                background: timerActive ? "rgba(124, 92, 252, 0.1)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <Timer size={14} />
              Timer
            </Link>
            <Link
              href="/app/stats"
              onClick={(event) => {
                if (!isTimerRunning) {
                  return;
                }

                const shouldLeave = window.confirm(
                  "A timer session is currently running. Do you want to leave the timer and open Stats?",
                );

                if (!shouldLeave) {
                  event.preventDefault();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: statsActive ? "#A78BFA" : "var(--muted)",
                background: statsActive ? "rgba(124, 92, 252, 0.1)" : "transparent",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s ease",
                textDecoration: "none",
              }}
            >
              <BarChart2 size={14} />
              Stats
            </Link>
            <Link
              href="/app/blog"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: blogActive ? "#A78BFA" : "var(--muted)",
                background: blogActive ? "rgba(124, 92, 252, 0.1)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <BookOpen size={14} />
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              aria-label="Toggle color theme"
              style={{
                position: "relative",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--subtle-fill)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--muted)",
              }}
            >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

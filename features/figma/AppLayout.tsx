"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Timer, Zap, Moon, Sun } from "lucide-react";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/use-app-store";

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showStatsComingSoon, setShowStatsComingSoon] = useState(false);
  const isDarkMode = useAppStore((state) => state.isDarkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);

  const timerActive = pathname === "/app";
  const statsActive = pathname === "/app/stats";

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
            <button
              type="button"
              onClick={() => setShowStatsComingSoon(true)}
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
              }}
            >
              <BarChart2 size={14} />
              Stats
            </button>
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

      <AnimatePresence>
        {showStatsComingSoon ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
              zIndex: 80,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              style={{
                width: "min(420px, 100%)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: 20,
                boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--foreground)",
                  letterSpacing: "-0.02em",
                }}
              >
                Stats Coming Soon
              </h2>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "var(--muted)",
                }}
              >
                We&apos;re polishing insights and progress tracking. This section will be available soon.
              </p>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowStatsComingSoon(false)}
                  style={{
                    background: "rgba(124, 92, 252, 0.12)",
                    border: "1px solid rgba(124, 92, 252, 0.3)",
                    color: "#7C5CFC",
                    borderRadius: 8,
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

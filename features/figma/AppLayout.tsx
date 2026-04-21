"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Timer, Zap, Moon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [deepWorkHint, setDeepWorkHint] = useState(false);

  const timerActive = pathname === "/app";
  const statsActive = pathname === "/app/stats";

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "#07070F",
        fontFamily: "'Inter', sans-serif",
        color: "#E8E8F0",
      }}
    >
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(7,7,15,0.95)",
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
                color: "#F0F0FA",
                letterSpacing: "-0.02em",
              }}
            >
              Flexodoro
            </span>
          </button>

          <nav className="flex items-center gap-1">
            <Link
              href="/app"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: timerActive ? "#A78BFA" : "#888899",
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: statsActive ? "#A78BFA" : "#888899",
                background: statsActive ? "rgba(124, 92, 252, 0.1)" : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <BarChart2 size={14} />
              Stats
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setDeepWorkHint(true)}
              onMouseLeave={() => setDeepWorkHint(false)}
              style={{
                position: "relative",
                width: 32,
                height: 32,
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#888899",
              }}
            >
              <Moon size={14} />
              {deepWorkHint && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    background: "#1A1A2E",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    padding: "4px 8px",
                    fontSize: 11,
                    whiteSpace: "nowrap",
                    color: "#888899",
                  }}
                >
                  Deep Work (in Timer)
                </div>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}

import type { Metadata } from "next";
import { StatsPage } from "@/features/figma/StatsPage";

export const metadata: Metadata = {
  title: "Focus Statistics",
  description: "Review focus sessions and productivity trends saved for this device.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function StatsWorkspacePage() {
  return <StatsPage />;
}

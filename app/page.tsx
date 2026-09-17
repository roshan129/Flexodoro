import type { Metadata } from "next";
import { AppLayout } from "@/features/figma/AppLayout";
import { TimerScreen } from "@/features/figma/TimerScreen";
import { LandingSection } from "@/features/marketing/components/landing-section";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <AppLayout>
      <div id="timer">
        <TimerScreen />
      </div>
      <LandingSection />
    </AppLayout>
  );
}

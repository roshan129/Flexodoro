import type { Metadata } from "next";
import { SettingsPage } from "@/features/figma/SettingsPage";

export const metadata: Metadata = {
  title: "Timer Settings",
  description: "Personalize Flexodoro timer, focus, break, sound, and theme preferences.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SettingsWorkspacePage() {
  return <SettingsPage />;
}

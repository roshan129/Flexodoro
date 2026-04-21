import type { Metadata } from "next";
import "./globals.css";

const appUrl = "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Flexodoro",
    template: "%s | Flexodoro",
  },
  description:
    "Flexible focus timer with adaptive breaks, ambient music, and actionable productivity insights.",
  applicationName: "Flexodoro",
  keywords: [
    "pomodoro",
    "focus timer",
    "deep work",
    "productivity",
    "time tracking",
  ],
  category: "productivity",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    title: "Flexodoro",
    description:
      "Flexible focus timer with adaptive breaks, ambient music, and actionable productivity insights.",
    type: "website",
    url: appUrl,
    siteName: "Flexodoro",
  },
  twitter: {
    card: "summary",
    title: "Flexodoro",
    description:
      "Flexible focus timer with adaptive breaks, ambient music, and actionable productivity insights.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="min-h-full bg-background text-foreground font-sans">
        {children}
      </body>
    </html>
  );
}

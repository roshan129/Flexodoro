import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

function resolveSiteUrl(rawUrl: string): string {
  if (rawUrl.includes("localhost")) {
    return rawUrl;
  }

  const parsed = new URL(rawUrl);
  if (!parsed.hostname.startsWith("www.")) {
    parsed.hostname = `www.${parsed.hostname}`;
  }

  return parsed.toString().replace(/\/$/, "");
}

const appUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
);

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Pomodoro Timer Online – Focus & Deep Work Timer | Flexodoro",
    template: "%s | Flexodoro",
  },
  description:
    "Free online Pomodoro timer for focused work and deep work. Use 25/5 or 40/10 sessions, flexible focus sessions, adaptive breaks, focus sounds, and productivity stats.",
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
    title: "Pomodoro Timer Online – Focus & Deep Work Timer | Flexodoro",
    description:
      "Free online Pomodoro timer for focused work and deep work. Use 25/5 or 40/10 sessions, flexible focus sessions, adaptive breaks, focus sounds, and productivity stats.",
    type: "website",
    url: appUrl,
    siteName: "Flexodoro",
  },
  twitter: {
    card: "summary",
    title: "Pomodoro Timer Online – Focus & Deep Work Timer | Flexodoro",
    description:
      "Free online Pomodoro timer for focused work and deep work. Use 25/5 or 40/10 sessions, flexible focus sessions, adaptive breaks, focus sounds, and productivity stats.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const themeInitScript = `
    try {
      const stored = window.localStorage.getItem("flexodoro-store");
      const parsed = stored ? JSON.parse(stored) : null;
      const isDark = parsed?.state?.isDarkMode ?? true;
      document.documentElement.classList.toggle("dark", Boolean(isDark));
    } catch {
      document.documentElement.classList.add("dark");
    }
  `;

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground font-sans">
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>{children}</ThemeProvider>
        <Script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "1f12117e72744dd78530ab2d46782380"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

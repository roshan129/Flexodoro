import type { Metadata, Viewport } from "next";
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
      </body>
    </html>
  );
}

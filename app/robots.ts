import type { MetadataRoute } from "next";

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

const siteUrl = resolveSiteUrl(
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

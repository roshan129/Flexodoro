import type { MetadataRoute } from "next";
import { BLOG_POST_INDEX, getBlogPostUrl } from "@/features/figma/blog-post-index";

const siteUrl = "https://www.flexodoro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPostUrls: MetadataRoute.Sitemap = BLOG_POST_INDEX.map((post) => ({
    url: `${siteUrl}${getBlogPostUrl(post.slug)}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/landing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/app/stats`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/app/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/app/settings`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...blogPostUrls,
  ];
}

import type { MetadataRoute } from "next";
import { BLOG_POST_INDEX, getBlogPostUrl } from "@/features/figma/blog-post-index";

const siteUrl = "https://www.flexodoro.com";
const homepageLastModified = new Date("2026-09-16T00:00:00.000Z");
const aboutLastModified = new Date("2026-09-19T00:00:00.000Z");
const blogIndexLastModified = new Date(
  Math.max(...BLOG_POST_INDEX.map((post) => new Date(post.date).getTime())),
);

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
      lastModified: homepageLastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/app/blog`,
      lastModified: blogIndexLastModified,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/app/about`,
      lastModified: aboutLastModified,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...blogPostUrls,
  ];
}

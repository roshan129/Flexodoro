import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { BlogPage } from "@/features/figma/BlogPage";
import {
  getBlogPostIndexEntry,
  getBlogPostUrl,
} from "@/features/figma/blog-post-index";

const siteUrl = "https://www.flexodoro.com";

export const metadata: Metadata = {
  title: "Focus & ADHD Blog",
  description:
    "Science-backed insights on focus, ADHD, deep work, breaks, and sustainable productivity habits.",
  alternates: {
    canonical: `${siteUrl}/app/blog`,
  },
};

type BlogWorkspacePageProps = {
  searchParams: Promise<{
    post?: string | string[];
  }>;
};

export default async function BlogWorkspacePage({
  searchParams,
}: BlogWorkspacePageProps) {
  const postParam = (await searchParams).post;
  const legacyPostSlug = Array.isArray(postParam) ? postParam[0] : postParam;

  if (legacyPostSlug && getBlogPostIndexEntry(legacyPostSlug)) {
    permanentRedirect(getBlogPostUrl(legacyPostSlug));
  }

  return <BlogPage />;
}

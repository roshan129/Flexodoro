import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPage } from "@/features/figma/BlogPage";
import {
  BLOG_POST_INDEX,
  getBlogPostIndexEntry,
  getBlogPostUrl,
} from "@/features/figma/blog-post-index";

const siteUrl = "https://www.flexodoro.com";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POST_INDEX.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostIndexEntry(slug);

  if (!post) {
    return {};
  }

  const path = getBlogPostUrl(post.slug);
  const url = `${siteUrl}${path}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "Flexodoro",
      publishedTime: new Date(post.date).toISOString(),
    },
    twitter: {
      card: "summary",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  if (!getBlogPostIndexEntry(slug)) {
    notFound();
  }

  return <BlogPage initialPostId={slug} />;
}

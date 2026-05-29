export type BlogPostIndexEntry = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export const BLOG_POST_INDEX: BlogPostIndexEntry[] = [
  {
    slug: "adhd-pomodoro",
    title: "Why Pomodoro Clicks for ADHD Brains",
    description:
      "How time-boxing creates the urgency your brain craves.",
    date: "May 20, 2026",
  },
  {
    slug: "deep-work-science",
    title: "The Neuroscience of Deep Work",
    description:
      "What happens in your brain during deep focus, and why getting started is the hardest part.",
    date: "May 15, 2026",
  },
  {
    slug: "adhd-executive-function",
    title: "Executive Function & ADHD: A Practical Primer",
    description:
      "Understanding why starting tasks feels impossible, and what actually helps.",
    date: "May 10, 2026",
  },
  {
    slug: "break-science",
    title: "The Science of Taking Better Breaks",
    description:
      "Not all rest is equal. Here's what your brain actually needs between focus sessions.",
    date: "May 5, 2026",
  },
  {
    slug: "flow-state-guide",
    title: "How to Enter Flow State More Reliably",
    description:
      "Mihaly Csikszentmihalyi's research, translated into a practical checklist.",
    date: "April 28, 2026",
  },
  {
    slug: "adhd-hyperfocus",
    title: "Hyperfocus: ADHD's Hidden Superpower (and Its Traps)",
    description:
      "Understanding hyperfocus, and how to harness it without burning out.",
    date: "April 20, 2026",
  },
  {
    slug: "sleep-and-focus",
    title: "Sleep Is Your Focus Supercharger",
    description:
      "The research on sleep and cognitive performance is unambiguous, and massively underrated.",
    date: "April 14, 2026",
  },
  {
    slug: "distraction-management",
    title: "The Attention Economy Is Designed Against You",
    description:
      "Why focus feels harder than ever, and what to do about it.",
    date: "April 7, 2026",
  },
];

export function getBlogPostIndexEntry(slug: string): BlogPostIndexEntry | undefined {
  return BLOG_POST_INDEX.find((post) => post.slug === slug);
}

export function getBlogPostUrl(slug: string): string {
  return `/app/blog/${slug}`;
}

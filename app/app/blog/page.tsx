import { Suspense } from "react";
import { BlogPage } from "@/features/figma/BlogPage";

export default function BlogWorkspacePage() {
  return (
    <Suspense fallback={null}>
      <BlogPage />
    </Suspense>
  );
}

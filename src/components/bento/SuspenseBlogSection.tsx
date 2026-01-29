"use client";

import { use } from "react";
import type { BlogPost } from "@/lib/hatena-blog";
import { BlogSection } from "./BlogSection";

interface SuspenseBlogSectionProps {
  blogPromise: Promise<BlogPost[]>;
  title?: string;
}

export function SuspenseBlogSection({
  blogPromise,
  title = "Tech Blog",
}: SuspenseBlogSectionProps) {
  const posts = use(blogPromise);
  return <BlogSection posts={posts} title={title} />;
}

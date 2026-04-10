"use client";

import { use } from "react";
import type { MastodonPost } from "@/lib/mastodon";
import { MastodonSection } from "./MastodonSection";

interface SuspenseMastodonSectionProps {
  postsPromise: Promise<MastodonPost[]>;
  title?: string;
  layout?: "sidebar" | "carousel";
}

export function SuspenseMastodonSection({
  postsPromise,
  title = "Mastodon",
  layout = "carousel",
}: SuspenseMastodonSectionProps) {
  const posts = use(postsPromise);
  return <MastodonSection posts={posts} title={title} layout={layout} />;
}

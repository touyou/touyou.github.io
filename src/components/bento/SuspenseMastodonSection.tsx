"use client";

import { use } from "react";
import type { MastodonPost } from "@/lib/mastodon";
import { MastodonSection } from "./MastodonSection";

interface SuspenseMastodonSectionProps {
  postsPromise: Promise<MastodonPost[]>;
  title?: string;
}

export function SuspenseMastodonSection({
  postsPromise,
  title = "Mastodon",
}: SuspenseMastodonSectionProps) {
  const posts = use(postsPromise);
  return <MastodonSection posts={posts} title={title} />;
}

"use client";

import { cardBase } from "@/lib/bento-utils";
import type { MastodonPost } from "@/lib/mastodon";

interface MastodonSectionProps {
  posts: MastodonPost[];
  title?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Strip HTML tags from Mastodon content (which comes as HTML)
function stripHtml(html: string): string {
  // Replace structural tags with newlines before stripping
  const withNewlines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p>/gi, "");

  // Strip ALL remaining HTML tags in one pass (comprehensive)
  const stripped = withNewlines.replace(/<[^>]*>/g, "");

  // Decode HTML entities in a single pass to avoid cascading double-unescaping
  const decoded = stripped.replace(
    /&(amp|lt|gt|quot|apos|#39|#x27);/gi,
    (_, entity) => {
      switch (entity.toLowerCase()) {
        case "amp": return "&";
        case "lt": return "<";
        case "gt": return ">";
        case "quot": return '"';
        case "apos":
        case "#39":
        case "#x27": return "'";
        default: return "";
      }
    }
  );

  return decoded.trim();
}

function MastodonCard({ post }: { post: MastodonPost }) {
  const text = stripHtml(post.content);
  const hasImage =
    post.mediaAttachments.length > 0 &&
    post.mediaAttachments[0].type === "image";

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group min-w-[280px] md:min-w-0 snap-start`}
    >
      {hasImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.mediaAttachments[0].previewUrl}
          alt={post.mediaAttachments[0].description ?? ""}
          className="w-full aspect-video object-cover"
        />
      )}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <p className="text-gray-800 text-sm line-clamp-4 flex-1 whitespace-pre-line">
          {text}
        </p>
        <p className="text-gray-400 text-xs">{formatDate(post.createdAt)}</p>
      </div>
    </a>
  );
}

export function MastodonSection({
  posts,
  title = "Mastodon",
}: MastodonSectionProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <a
          href="https://fedibird.com/@touyou"
          target="_blank"
          rel="me noreferrer"
          className="text-gray-600 text-sm font-semibold hover:text-indigo-500 transition-colors"
        >
          {title}
        </a>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:flex flex-col gap-3">
        {posts.map((post) => (
          <MastodonCard key={post.id} post={post} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {posts.map((post) => (
            <MastodonCard key={post.id} post={post} />
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

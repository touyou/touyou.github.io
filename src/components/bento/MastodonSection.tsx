"use client";

import Image from "next/image";
import type { MastodonPost, MastodonCard } from "@/lib/mastodon";

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Strip HTML tags from Mastodon content (which comes as HTML)
function stripHtml(html: string): string {
  // Replace structural tags with newlines before stripping
  const withNewlines = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p>/gi, "");

  // Strip ALL remaining HTML tags in a loop until stable (prevents incomplete
  // multi-character tag patterns like <scr<b>ipt> from surviving one pass)
  let stripped = withNewlines;
  let prev: string;
  do {
    prev = stripped;
    stripped = prev.replace(/<[^>]*>/g, "");
  } while (stripped !== prev);

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

function LinkPreviewCard({ card }: { card: MastodonCard }) {
  const domain = (() => {
    try { return new URL(card.url).hostname; } catch {
      // URL parsing fails for malformed URLs; silently return empty string
      return "";
    }
  })();

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noreferrer"
      className="block mt-3 rounded-xl border border-[#2e3a4e]/20 overflow-hidden hover:border-[#6364ff]/50 transition-colors bg-[#1e2736]"
      onClick={(e) => e.stopPropagation()}
    >
      {card.image && (
        <div className="relative w-full aspect-video bg-[#151f2e]">
          <Image
            src={card.image}
            alt={card.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="px-3 py-2">
        {domain && (
          <p className="text-[#606984] text-xs mb-0.5">{domain}</p>
        )}
        <p className="text-[#d9e1e8] text-sm font-medium line-clamp-1">
          {card.title}
        </p>
        {card.description && (
          <p className="text-[#606984] text-xs line-clamp-2 mt-0.5">
            {card.description}
          </p>
        )}
      </div>
    </a>
  );
}

function MastodonCard({ post }: { post: MastodonPost }) {
  const text = stripHtml(post.content);
  const imageAttachments = post.mediaAttachments.filter(
    (m) => m.type === "image"
  );

  return (
    <div className="min-w-[300px] md:min-w-0 snap-start bg-[#1f2b3e] rounded-xl border border-[#2e3a4e] overflow-hidden">
      <div className="p-4">
        {/* Account header */}
        <div className="flex items-center gap-3 mb-3">
          {post.account.avatarStatic && (
            <Image
              src={post.account.avatarStatic}
              alt={post.account.displayName}
              width={40}
              height={40}
              className="rounded-full w-10 h-10 flex-shrink-0"
              unoptimized
            />
          )}
          <div className="min-w-0">
            <p className="text-[#d9e1e8] text-sm font-semibold truncate">
              {post.account.displayName}
            </p>
            <p className="text-[#606984] text-xs truncate">
              @{post.account.acct}
            </p>
          </div>
        </div>

        {/* Post content */}
        {text && (
          <p className="text-[#d9e1e8] text-sm leading-relaxed whitespace-pre-line line-clamp-6">
            {text}
          </p>
        )}

        {/* Media attachments */}
        {imageAttachments.length > 0 && (
          <div
            className={`mt-3 grid gap-1 rounded-xl overflow-hidden ${
              imageAttachments.length === 1 ? "grid-cols-1" : "grid-cols-2"
            }`}
          >
            {imageAttachments.slice(0, 4).map((img, i) => (
              <div key={i} className="relative w-full aspect-video">
                <Image
                  src={img.previewUrl}
                  alt={img.description ?? ""}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}

        {/* OGP link preview */}
        {post.card && <LinkPreviewCard card={post.card} />}

        {/* Timestamp — link to original post on Mastodon */}
        <a
          href={post.url}
          target="_blank"
          rel="noreferrer"
          className="block text-[#606984] hover:text-[#9baec8] text-xs mt-3 transition-colors"
        >
          {formatDate(post.createdAt)}
        </a>
      </div>
    </div>
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
      <div className="flex items-center gap-2 px-1 mb-3">
        {/* Mastodon elephant icon */}
        <svg
          viewBox="0 0 74 79"
          className="w-4 h-4 flex-shrink-0"
          fill="#6364ff"
          aria-hidden="true"
        >
          <path d="M73.7014 17.5592C72.5616 9.97527 65.1215 3.90807 56.1478 2.58795C54.4017 2.3235 48.0403 1.48776 33.3383 1.48776H33.2209C18.5168 1.48776 15.2912 2.3235 13.5452 2.58795C4.86482 3.87023 -2.9417 9.26924 1.1105 17.9537C1.53239 18.8588 2.05881 19.7205 2.67968 20.5188C4.13804 22.4519 5.18462 23.9831 6.67932 27.0028C8.96434 31.8025 9.50025 34.2919 11.2463 45.8844C11.8879 50.0644 12.5881 54.2168 14.1354 58.1931C17.2095 66.3218 23.2498 72.8397 32.1375 76.9027C40.5463 80.7723 50.8875 81.7448 60.0424 79.0447C61.7027 78.5525 63.3244 77.9576 64.8962 77.2617C67.4513 76.1417 70.4047 74.7744 70.4047 74.7744C70.4047 74.7744 71.1067 74.5033 70.8337 73.2181C70.5607 71.9329 65.9817 64.7432 65.9817 64.7432C65.9817 64.7432 65.0614 62.8742 62.5901 63.5C56.697 65.0616 50.6003 65.8413 44.4997 65.8217C31.4914 65.8217 28.0549 59.5673 27.0786 57.2014C26.3284 55.3419 25.8636 53.3945 25.6944 51.4075H69.9925C70.2655 51.4075 70.5385 51.4075 70.8115 51.3769C71.0845 51.3463 71.3575 51.3157 71.6305 51.2545C72.9967 50.9222 74.0639 49.8022 74.0637 48.4396C74.0637 47.0773 73.9513 16.3169 73.7014 17.5592Z"/>
        </svg>
        <a
          href="https://fedibird.com/@touyou"
          target="_blank"
          rel="me noreferrer"
          className="text-gray-600 text-sm font-semibold hover:text-[#6364ff] transition-colors"
        >
          {title}
        </a>
      </div>

      {/* Desktop: stacked column */}
      <div className="hidden md:flex flex-col gap-3">
        {posts.map((post) => (
          <MastodonCard key={post.id} post={post} />
        ))}
      </div>

      {/* Mobile: horizontal scroll carousel */}
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

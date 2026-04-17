"use client";

import { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import type { MastodonPost, MastodonCard as MastodonCardType } from "@/lib/mastodon";
import { fetchMastodonPostsClient } from "@/lib/mastodon-client";
import { MastodonSectionSkeleton } from "./MastodonSectionSkeleton";

interface MastodonSectionProps {
  posts: MastodonPost[];
  title?: string;
  layout?: "sidebar" | "carousel";
}

// Format a date deterministically in Asia/Tokyo so server-side rendering
// (Vercel is UTC) and client-side hydration produce identical strings.
// Using toLocaleDateString here caused React hydration mismatch (#418)
// because the server and browser disagreed on the rendered time zone.
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  // Shift to JST (UTC+9) by adding 9 hours to the UTC timestamp, then read
  // the UTC fields of the shifted date to avoid runtime time zone differences.
  const jst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const year = jst.getUTCFullYear();
  const month = jst.getUTCMonth() + 1;
  const day = jst.getUTCDate();
  const hour = String(jst.getUTCHours()).padStart(2, "0");
  const minute = String(jst.getUTCMinutes()).padStart(2, "0");
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
}

function decodeEntities(text: string): string {
  return text.replace(
    /&(amp|lt|gt|quot|apos|#39|#x27);/gi,
    (_, entity: string) => {
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
}

type ContentSegment = { type: "text"; text: string } | { type: "link"; href: string; text: string };

function parseContent(html: string): { segments: ContentSegment[]; plainText: string } {
  const normalized = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p>/gi, "");

  const segments: ContentSegment[] = [];
  const linkPattern = /<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  let lastIndex = 0;
  let match;

  while ((match = linkPattern.exec(normalized)) !== null) {
    if (match.index > lastIndex) {
      const before = normalized.slice(lastIndex, match.index).replace(/<[^>]*>/g, "");
      const decoded = decodeEntities(before);
      if (decoded) segments.push({ type: "text", text: decoded });
    }
    const linkText = decodeEntities(match[2].replace(/<[^>]*>/g, ""));
    const href = decodeEntities(match[1]);
    if (linkText) segments.push({ type: "link", href, text: linkText });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < normalized.length) {
    const remaining = normalized.slice(lastIndex).replace(/<[^>]*>/g, "");
    const decoded = decodeEntities(remaining);
    if (decoded) segments.push({ type: "text", text: decoded });
  }

  const plainText = segments.map((s) => s.text).join("").trim();
  return { segments, plainText };
}

function PostContent({ segments }: { segments: ContentSegment[] }) {
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "link" ? (
          <a
            key={i}
            href={seg.href}
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-600 underline underline-offset-2"
            onClick={(e) => e.stopPropagation()}
          >
            {seg.text}
          </a>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </>
  );
}

function LinkPreviewCard({ card }: { card: MastodonCardType }) {
  const domain = (() => {
    try { return new URL(card.url).hostname; } catch {
      return "";
    }
  })();

  return (
    <a
      href={card.url}
      target="_blank"
      rel="noreferrer"
      className="block mt-2 rounded-lg border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors bg-gray-50"
      onClick={(e) => e.stopPropagation()}
    >
      {card.image && (
        <div className="relative w-full aspect-video bg-gray-100">
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
          <p className="text-gray-400 text-xs mb-0.5">{domain}</p>
        )}
        <p className="text-gray-900 text-sm font-medium line-clamp-1">
          {card.title}
        </p>
        {card.description && (
          <p className="text-gray-500 text-xs line-clamp-2 mt-0.5">
            {card.description}
          </p>
        )}
      </div>
    </a>
  );
}

function MastodonPostCard({ post, compact, "data-post": dataPost }: { post: MastodonPost; compact?: boolean; "data-post"?: boolean }) {
  const { segments, plainText } = parseContent(post.content);
  const imageAttachments = post.mediaAttachments.filter(
    (m) => m.type === "image"
  );
  const hasBottomContent = imageAttachments.length > 0 || post.card;

  return (
    <div
      {...(dataPost ? { "data-post": "" } : {})}
      className={compact
        ? "bg-white overflow-hidden"
        : "min-w-[300px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col"
      }
    >
      <div className={compact ? "p-3" : "p-4 flex flex-col flex-1 min-h-0"}>
        {/* Account header */}
        <div className="flex items-center gap-3 mb-2">
          {post.account.avatarStatic && (
            <Image
              src={post.account.avatarStatic}
              alt={post.account.displayName}
              width={compact ? 32 : 40}
              height={compact ? 32 : 40}
              className={`rounded-full flex-shrink-0 ${compact ? "w-8 h-8" : "w-10 h-10"}`}
              unoptimized
            />
          )}
          <div className="min-w-0">
            <p className="text-gray-900 text-sm font-semibold truncate">
              {post.account.displayName}
            </p>
            <p className="text-gray-400 text-xs truncate">
              @{post.account.acct}
            </p>
          </div>
        </div>

        {/* Post content with inline links */}
        {plainText && (
          <div className={compact ? "" : "max-h-40 overflow-y-auto overflow-x-hidden thin-scrollbar"}>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line break-words">
              <PostContent segments={segments} />
            </p>
          </div>
        )}

        {/* Bottom section: media, OGP, timestamp */}
        <div className={compact ? "mt-2" : "mt-auto pt-2"}>
          {/* Media attachments */}
          {imageAttachments.length > 0 && (
            <div
              className={`grid gap-1 rounded-lg overflow-hidden ${
                imageAttachments.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {imageAttachments.slice(0, 4).map((img, i) => (
                <div key={i} className="relative w-full aspect-video bg-gray-100">
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

          {/* Timestamp */}
          <a
            href={post.url}
            target="_blank"
            rel="noreferrer"
            className={`block text-gray-400 hover:text-gray-600 text-xs transition-colors ${hasBottomContent ? "mt-2" : ""}`}
          >
            {formatDate(post.createdAt)}
          </a>
        </div>
      </div>
    </div>
  );
}

function MastodonHeader({ title }: { title: string }) {
  return (
    <a
      href="https://fedibird.com/@touyou"
      target="_blank"
      rel="me noreferrer"
      className="text-gray-600 text-sm font-semibold hover:text-[#6364ff] transition-colors"
    >
      {title}
    </a>
  );
}

function LoadMoreButton({ onClick, loading }: { onClick: () => void; loading: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
    >
      {loading ? "読み込み中..." : "もっと見る"}
    </button>
  );
}

export function MastodonSection({
  posts: initialPosts,
  title = "Mastodon",
  layout = "carousel",
}: MastodonSectionProps) {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollRestoreRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore scroll position after posts are appended.
  // Uses ResizeObserver to keep restoring while images load and scrollWidth
  // changes, because the initial scrollLeft can be clamped before layout
  // stabilizes. Stops once the target is reached or a timeout elapses.
  useLayoutEffect(() => {
    if (scrollRestoreRef.current === null || !carouselRef.current) return;
    const target = scrollRestoreRef.current;
    const el = carouselRef.current;
    scrollRestoreRef.current = null;

    let active = true;
    const tryRestore = () => {
      if (!active) return;
      el.scrollLeft = target;
    };
    tryRestore();

    const observer = new ResizeObserver(tryRestore);
    observer.observe(el);
    Array.from(el.children).forEach((c) => observer.observe(c));

    // Stop observing after a reasonable delay so normal scrolling isn't hijacked
    const stopTimer = window.setTimeout(() => {
      active = false;
      observer.disconnect();
    }, 1500);

    return () => {
      active = false;
      observer.disconnect();
      window.clearTimeout(stopTimer);
    };
  }, [posts]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const lastId = posts[posts.length - 1]?.id;
      const newPosts = await fetchMastodonPostsClient(5, lastId);
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        // Capture scroll position so useLayoutEffect can restore it after
        // the DOM changes from appending new posts.
        if (layout === "carousel" && carouselRef.current) {
          scrollRestoreRef.current = carouselRef.current.scrollLeft;
        }
        setPosts((prev) => [...prev, ...newPosts]);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, posts, layout]);

  if (!mounted) {
    return <MastodonSectionSkeleton layout={layout} />;
  }

  if (posts.length === 0) {
    return null;
  }

  if (layout === "sidebar") {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col h-full">
        {/* Card header */}
        <div className="px-4 py-3 border-b border-gray-100">
          <MastodonHeader title={title} />
        </div>
        {/* Scrollable feed */}
        <div className="flex-1 overflow-y-auto overscroll-contain no-scrollbar">
          <div className="flex flex-col divide-y divide-gray-100">
            {posts.map((post) => (
              <MastodonPostCard key={post.id} post={post} compact />
            ))}
          </div>
          {hasMore && (
            <div className="border-t border-gray-100">
              <LoadMoreButton onClick={loadMore} loading={loading} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Carousel layout (mobile)
  return (
    <section>
      <div className="px-1 mb-3">
        <MastodonHeader title={title} />
      </div>
      <div className="-mx-4">
        <div
          ref={carouselRef}
          style={{ overflowAnchor: "none" }}
          className="flex gap-3 overflow-x-auto pb-4 px-4 no-scrollbar"
        >
          {posts.map((post) => (
            <MastodonPostCard key={post.id} post={post} data-post />
          ))}
          {hasMore && (
            <button
              onClick={loadMore}
              disabled={loading}
              className="min-w-[120px] self-stretch bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? "..." : "もっと見る"}
            </button>
          )}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

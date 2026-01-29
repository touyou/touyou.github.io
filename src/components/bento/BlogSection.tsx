"use client";

import { useState } from "react";
import Image from "next/image";
import type { BlogPost } from "@/lib/hatena-blog";
import { cardBase } from "@/lib/bento-utils";

interface BlogSectionProps {
  posts: BlogPost[];
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

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group min-w-[280px] md:min-w-0 snap-start`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600">
            <span className="text-white text-4xl font-bold">📝</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
          {post.title}
        </p>
        <p className="text-gray-400 text-xs mt-2">{formatDate(post.pubDate)}</p>
      </div>
    </a>
  );
}

export function BlogSection({ posts, title = "Tech Blog" }: BlogSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (posts.length === 0) {
    return null;
  }

  const visiblePosts = isExpanded ? posts : posts.slice(0, 4);
  const hasMore = posts.length > 4;

  return (
    <section>
      {/* Section Header */}
      <div className="flex items-center justify-between px-1 mb-3">
        <h2 className="text-gray-600 text-sm font-semibold">{title}</h2>
        {hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            {isExpanded ? (
              <>
                <span>折りたたむ</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </>
            ) : (
              <>
                <span>すべて表示 ({posts.length})</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </>
            )}
          </button>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 gap-3">
        {visiblePosts.map((post, index) => (
          <BlogCard key={index} post={post} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {posts.map((post, index) => (
            <BlogCard key={index} post={post} />
          ))}
          {/* Spacer for last card visibility with right padding */}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

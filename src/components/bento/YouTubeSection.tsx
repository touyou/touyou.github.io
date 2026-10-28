"use client";

import Image from "next/image";
import { useState } from "react";
import { cardBase } from "@/lib/bento-utils";
import type { YouTubeVideoData } from "@/lib/bento-types";

interface YouTubeSectionProps {
  videos: YouTubeVideoData[];
  title?: string;
}

function YouTubeCard({ video }: { video: YouTubeVideoData }) {
  if (video.embeddable === false) {
    return <YouTubeLinkCard video={video} />;
  }
  return (
    <div className={`${cardBase} group`}>
      <div className="relative w-full aspect-video bg-gray-900">
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">
          {video.title}
        </p>
      </div>
    </div>
  );
}

// iframe だと「動画を再生できません」になるので、サムネイルを YouTube へのリンクにする
function YouTubeLinkCard({ video }: { video: YouTubeVideoData }) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} group block`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-900">
        <Image
          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
          alt=""
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center w-16 h-11 rounded-xl bg-red-600/90 group-hover:bg-red-600 transition-colors">
            <span className="ml-1 border-y-[9px] border-y-transparent border-l-[15px] border-l-white" />
          </span>
        </div>
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">
          {video.title}
        </p>
      </div>
    </a>
  );
}

export function YouTubeSection({
  videos,
  title = "YouTube",
}: YouTubeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (videos.length === 0) {
    return null;
  }

  const visibleVideos = isExpanded ? videos : videos.slice(0, 4);
  const hasMore = videos.length > 4;

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
                <span>すべて表示 ({videos.length})</span>
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
        {visibleVideos.map((video, index) => (
          <YouTubeCard key={index} video={video} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {videos.map((video, index) => (
            <div key={index} className="min-w-[320px] snap-start">
              <YouTubeCard video={video} />
            </div>
          ))}
          {/* Spacer for last card visibility with right padding */}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

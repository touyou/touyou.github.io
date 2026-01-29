"use client";

import { useState } from "react";
import Image from "next/image";
import type { SpeakerDeckTalk } from "@/lib/speakerdeck";
import { cardBase } from "@/lib/bento-utils";

interface SpeakerDeckSectionProps {
  talks: SpeakerDeckTalk[];
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

function SpeakerDeckCard({ talk }: { talk: SpeakerDeckTalk }) {
  return (
    <a
      href={talk.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group min-w-[280px] md:min-w-0 md:col-span-2 snap-start`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {talk.thumbnail ? (
          <Image
            src={talk.thumbnail}
            alt={talk.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-teal-500 to-emerald-600">
            <span className="text-white text-4xl font-bold">🎤</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="font-medium text-gray-900 text-sm line-clamp-2 flex-1">
          {talk.title}
        </p>
        <p className="text-gray-400 text-xs mt-2">{formatDate(talk.pubDate)}</p>
      </div>
    </a>
  );
}

export function SpeakerDeckSection({
  talks,
  title = "Speaker Deck",
}: SpeakerDeckSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (talks.length === 0) {
    return null;
  }

  const visibleTalks = isExpanded ? talks : talks.slice(0, 4);
  const hasMore = talks.length > 4;

  return (
    <>
      {/* Section Header */}
      <div className="col-span-2 md:col-span-4 flex items-center justify-between mt-6 px-1">
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
                <span>すべて表示 ({talks.length})</span>
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
      <div className="hidden md:contents">
        {visibleTalks.map((talk, index) => (
          <SpeakerDeckCard key={index} talk={talk} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="col-span-2 md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {talks.map((talk, index) => (
            <SpeakerDeckCard key={index} talk={talk} />
          ))}
          {/* Spacer for last card visibility with right padding */}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

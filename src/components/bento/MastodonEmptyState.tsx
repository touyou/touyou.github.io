"use client";

import { RefreshCw } from "lucide-react";
import { MastodonCardSkeleton } from "./MastodonSectionSkeleton";

interface MastodonEmptyStateProps {
  onReload: () => void;
  loading: boolean;
  failed: boolean;
  compact?: boolean;
}

// Shown when the Mastodon feed is empty — either because the initial SSR
// fetch returned zero posts (Fedibird hiccup / ISR captured a miss) or the
// user's manual reload also came back empty. `failed` distinguishes "we
// tried and it didn't work" from "haven't tried yet / server just gave 0".
export function MastodonEmptyState({
  onReload,
  loading,
  failed,
  compact,
}: MastodonEmptyStateProps) {
  // Loading: skeleton cards (mirrors the real post-card layout)
  if (loading) {
    if (compact) {
      return (
        <div className="flex flex-col divide-y divide-gray-100 w-full">
          {Array.from({ length: 3 }).map((_, i) => (
            <MastodonCardSkeleton key={i} compact />
          ))}
        </div>
      );
    }
    return (
      <div className="flex gap-3 overflow-x-hidden pb-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <MastodonCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? "h-full w-full flex flex-col items-center justify-center gap-3 p-6 text-center"
          : "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 p-6 text-center flex flex-col items-center justify-center gap-3 min-h-[240px]"
      }
    >
      <p className="text-gray-500 text-sm">
        {failed ? "取得できませんでした" : "投稿がまだありません"}
      </p>
      <button
        onClick={onReload}
        className="inline-flex items-center gap-1.5 text-sm text-[#6364ff] hover:text-[#4b4cff] transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        再取得
      </button>
    </div>
  );
}

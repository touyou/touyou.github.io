"use client";

import { useState } from "react";
import type { GitHubRepoCard } from "@/lib/github-card";

// GitHub のリポジトリ OGP（1200×600）の配置を cqw で写したもの。
// 実画像と差し替わっても位置が大きくずれないよう、余白と文字の比率をそろえている。
const BAR_COLORS = ["#F05138", "#3178c6", "#00B4AB", "#A97BFF", "#f1e05a"];

function barColor(repo: string): string {
  let hash = 0;
  for (const ch of repo) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return BAR_COLORS[hash % BAR_COLORS.length];
}

function Avatar({ owner }: { owner: string }) {
  const [failed, setFailed] = useState(false);
  const box = "w-[16cqw] h-[16cqw] rounded-[2cqw] shrink-0";
  if (failed) {
    return (
      <div
        aria-hidden
        className={`${box} bg-gray-200 text-gray-500 font-semibold text-[7cqw] flex items-center justify-center`}
      >
        {owner.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    // 外部のアバターで失敗時に差し替えたいので next/image は使わない
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://avatars.githubusercontent.com/${owner}?s=200`}
      alt=""
      className={`${box} object-cover bg-gray-100`}
      onError={() => setFailed(true)}
    />
  );
}

export function GitHubCardPlaceholder({ card }: { card: GitHubRepoCard }) {
  return (
    <div
      data-testid="github-card-placeholder"
      className="absolute inset-0 bg-white text-left flex flex-col [container-type:inline-size]"
    >
      <div className="flex-1 flex flex-col px-[6.5cqw] pt-[6cqw] pb-[4cqw] min-h-0">
        <div className="flex items-start justify-between gap-[4cqw]">
          <div className="min-w-0">
            <p className="text-[5.5cqw] leading-[1.2] text-[#1f2328] break-words">
              <span className="font-normal">{card.owner}/</span>
              <wbr />
              <span className="font-bold">{card.repo}</span>
            </p>
            {card.description && (
              <p className="mt-[2.5cqw] text-[2.8cqw] leading-[1.45] text-[#59636e] line-clamp-3">
                {card.description}
              </p>
            )}
          </div>
          <Avatar owner={card.owner} />
        </div>
        <div className="mt-auto flex justify-end">
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="w-[4.5cqw] h-[4.5cqw] fill-[#1f2328]"
          >
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
          </svg>
        </div>
      </div>
      <div
        aria-hidden
        className="h-[1.4cqw] w-full"
        style={{ backgroundColor: barColor(card.repo) }}
      />
    </div>
  );
}

"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

import { dummyCards } from "./dummy-cards";
import { TradingCard } from "./TradingCard";

/**
 * コレクション画面のイメージ。実際のスクリーンショットではなく、架空カードで組んだ再現。
 * アプリのクイック追加モードと同じく、カードを押すと所持枚数が 1 枚ずつ増える。
 */
export function PhoneMockup({ className }: { className?: string }) {
  const [counts, setCounts] = useState(() => dummyCards.map((card) => card.owned));
  const ownedKinds = counts.filter((count) => count > 0).length;
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-full max-w-[280px] overflow-hidden rounded-[48px] border-[10px] border-neutral-900 bg-neutral-900 shadow-2xl shadow-blue-900/20",
        className,
      )}
      role="group"
      aria-label={`Toreta のコレクション画面の例。架空のカードが並び、${dummyCards.length} 種中 ${ownedKinds} 種を持っている`}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[38px] bg-[#F2F2F7] text-neutral-900">
        <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-[22px] w-[76px] rounded-full bg-neutral-900" />
          <span className="tracking-tighter">●●●</span>
        </div>

        <div className="flex flex-col gap-2 px-4 pt-4">
          <div className="text-[19px] font-bold leading-tight">第1弾 はじまりの星</div>
          <div className="flex items-center gap-2 text-[10px] text-neutral-500">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-300">
              <div className="h-full rounded-full bg-[#2F6BF2] motion-safe:transition-[width] motion-safe:duration-500" style={{ width: `${(ownedKinds / dummyCards.length) * 100}%` }} />
            </div>
            <span>
              <span className="font-semibold text-neutral-900">{ownedKinds}</span> / {dummyCards.length} 種
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 px-4 pt-3">
          {dummyCards.map((card, i) => (
            <button
              key={card.number}
              type="button"
              onClick={() => {
                setCounts((c) => c.map((v, j) => (j === i ? v + 1 : v)));
              }}
              className="relative motion-safe:transition-transform motion-safe:active:scale-95"
              aria-label={`${card.name}を 1 枚追加（いま ${counts[i]} 枚）`}
            >
              <TradingCard card={{ ...card, owned: counts[i] }} />
              {counts[i] > 0 ? (
                <span
                  // 枚数が変わったときだけ作り直して、増えたバッジだけを弾ませる
                  key={counts[i]}
                  className="absolute -bottom-1 -right-1 rounded-full bg-[#2F6BF2] px-1 text-[8px] font-bold leading-[13px] text-white ring-2 ring-[#F2F2F7] motion-safe:animate-in motion-safe:zoom-in-50"
                >
                  ×{counts[i]}
                </span>
              ) : card.wanted ? (
                <span className="absolute -bottom-1 -right-1 rounded-full bg-amber-400 px-1 text-[8px] leading-[13px] text-white ring-2 ring-[#F2F2F7]">
                  ★
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <div className="mt-auto flex justify-center gap-2 px-4 pb-8">
          {["絞り込み", "クイック追加", "カメラ"].map((label, i) => (
            <span
              key={label}
              className={cn(
                "rounded-full px-3 py-1.5 text-[10px] font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur",
                i === 1 ? "bg-[#2F6BF2] text-white" : "bg-white/80 text-[#2F6BF2]",
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

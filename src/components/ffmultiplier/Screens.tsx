import { cn } from "@/lib/utils";

import { answerOf, HEX_DIGITS, hexDigit } from "./hex";
import { HEADING_FONT } from "./lp";
import { SevenSeg } from "./SevenSeg";

/**
 * 紹介ページに置く、アプリの画面の一部を描き直したもの。実際のスクリーンショットではない。
 * 画面の文字はアプリの表示（LocalScoreView / OnlineRankingView / ResultView）に合わせて英語のままにする。
 * ランキングの名前と点数は架空のもの。
 */

/** F の段（F × 0 〜 F × F）の一覧。答えはゲーム画面と同じく黒地に緑の 7 セグメントで見せる */
export function FTable() {
  return (
    <ol className="grid w-full max-w-3xl grid-cols-2 gap-2 sm:grid-cols-4" aria-label="F の段">
      {HEX_DIGITS.map((_, right) => {
        const answer = answerOf({ left: 15, right });
        return (
          <li key={right} className="flex min-w-0 items-center justify-between gap-2 rounded-xl bg-[#111111] px-4 py-3">
            <span className={cn("whitespace-nowrap text-[15px] text-[#F9F8F5]/70", HEADING_FONT)}>F × {hexDigit(right)}</span>
            <SevenSeg text={answer} ghost={false} label={answer} className="text-[24px] text-[#85BF5D]" />
          </li>
        );
      })}
    </ol>
  );
}

/** 点数の決まり。数字は 7 セグメントで見せる */
export function PointChip({ text, label, tone }: { text: string; label: string; tone: "green" | "red" }) {
  return (
    <span className="flex items-center gap-2 rounded-2xl bg-[#111111] px-5 py-3.5" role="img" aria-label={label}>
      <span className={cn("text-[28px] font-bold leading-none", tone === "green" ? "text-[#85BF5D]" : "text-[#E05A5A]")} aria-hidden>
        {text.startsWith("-") ? "−" : "+"}
      </span>
      <SevenSeg text={text.replace(/^[-+]/, "")} ghost={false} className={cn("text-[34px]", tone === "green" ? "text-[#85BF5D]" : "text-[#E05A5A]")} />
    </span>
  );
}

/** Local Score 画面（茶色の地に、点数と日付の一覧） */
export function LocalScoreScreen() {
  const rows = [
    [1, 415, "2026/10/08"],
    [2, 380, "2026/10/06"],
    [3, 340, "2026/10/08"],
    [4, 290, "2026/10/01"],
  ] as const;
  return (
    <div className={cn("flex w-full max-w-[280px] flex-col overflow-hidden rounded-[22px] bg-[#B97C50] text-[#F9F8F5] shadow-lg", HEADING_FONT)} role="img" aria-label="Local Score 画面の例。自分の点数が日付と一緒に高い順に並ぶ">
      <div className="py-3 text-center text-[14px] font-bold">Local Score</div>
      <ul className="flex flex-col pb-3" aria-hidden>
        {rows.map(([rank, score, date]) => (
          <li key={rank} className="flex flex-col gap-0.5 border-t border-white/15 px-5 py-2 text-[13px]">
            <span className="font-semibold">
              {rank}. {score} points
            </span>
            <span className="pl-4 text-[11px] text-white/75">date: {date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Online Ranking 画面（緑の地に、Top50 / Nearby の切り替えと自分の順位） */
export function OnlineRankingScreen() {
  const rows = [
    [1, 1265, "hexlover"],
    [2, 1180, "0xCAFE"],
    [3, 1105, "nibble"],
    [4, 990, "kuku16"],
  ] as const;
  return (
    <div
      className={cn("flex w-full max-w-[280px] flex-col overflow-hidden rounded-[22px] bg-[#85BF5D] text-[#F9F8F5] shadow-lg", HEADING_FONT)}
      role="img"
      aria-label="Online Ranking 画面の例。上位 50 人か、自分の前後の順位を切り替えて見られる"
    >
      <div className="py-3 text-center text-[14px] font-bold">Online Ranking</div>
      <div className="mx-5 grid grid-cols-2 rounded-lg bg-black/10 p-0.5 text-center text-[11px] font-semibold" aria-hidden>
        <span className="rounded-md bg-white py-1 text-[#1d1d1f] shadow-sm">Top50</span>
        <span className="py-1">Nearby</span>
      </div>
      <ul className="flex flex-col pt-2" aria-hidden>
        {rows.map(([rank, score, name]) => (
          <li key={rank} className="flex flex-col gap-0.5 px-5 py-1.5 text-[13px]">
            <span className="font-semibold">
              {rank}. {score} points
            </span>
            <span className="pl-4 text-[11px] text-white/85">{name}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 bg-[#F9F8F5] py-1.5 text-center text-[11px] text-[#555555]" aria-hidden>
        Your Rank: 4
      </div>
    </div>
  );
}

/** ゲームが終わったときの Result カード */
export function ResultCard() {
  return (
    <div
      className={cn("flex w-full max-w-[280px] flex-col items-center gap-4 rounded-[28px] bg-white p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.3)] ring-1 ring-black/5", HEADING_FONT)}
      role="img"
      aria-label="Result 画面の例。点数と High Score の印、SHARE と EXIT のボタンが並ぶ"
    >
      <span className="text-[17px] font-bold" aria-hidden>
        Result
      </span>
      <span className="rounded-full bg-[#B33737] px-3.5 py-1 text-[12px] font-bold text-white" aria-hidden>
        High Score
      </span>
      <span className="flex w-full justify-center rounded-2xl bg-[#111111] py-4 text-[#85BF5D]" aria-hidden>
        <SevenSeg text="415" className="text-[44px]" />
      </span>
      <span className="grid w-full grid-cols-2 gap-2.5 text-[13px] font-bold" aria-hidden>
        <span className="rounded-full bg-[#85BF5D] py-2 text-center text-white">SHARE</span>
        <span className="rounded-full bg-neutral-200 py-2 text-center text-neutral-600">EXIT</span>
      </span>
    </div>
  );
}

/** SHARE を押したときに送られる文（ResultView.swift の shareText と同じ） */
export function ShareMessage() {
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-2">
      <div className="self-end rounded-[20px] rounded-br-md bg-[#0A84FF] px-4 py-2.5 text-[14px] leading-snug text-white">
        I got 415 points! Let&apos;s play FFMultiplier with me! #FFMultiplier
      </div>
      <div className="self-end rounded-[14px] bg-white px-4 py-2.5 text-[12px] text-neutral-500 shadow-sm ring-1 ring-black/5">App Store の FFMultiplier へのリンク</div>
    </div>
  );
}

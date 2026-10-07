import type { ReactNode } from "react";

import { Phrases } from "@/components/app-lp";
import { cn } from "@/lib/utils";

/**
 * FFMultiplier の紹介ページの部品。アプリの見た目（FFGreen・ゲーム画面の黒・白い地・Futura の見出し・7 セグメントの数字）に寄せる。
 * Web フォントは読み込まず、Futura に近い書体をシステムから選ぶ。日本語はシステムの日本語フォントに落ちる。
 * 色はアプリの FFColors（FFMultiply/Assets/Assets.xcassets/FFColors）に合わせる。
 */

/** 見出し用の書体。Futura が無い環境では幾何学的なサンセリフに寄せる */
export const HEADING_FONT = "font-[Futura,'Century_Gothic','Avenir_Next','Hiragino_Sans','Noto_Sans_JP',sans-serif]";

export const APP_STORE_URL = "https://apps.apple.com/jp/app/id1151801381";
export const SUPPORT_URL = "/ffmultiplier/support";
export const PRIVACY_URL = "/ffmultiplier/privacy";

/** ページ全体。白い地（FFWhite）にし、日本語を文節の切れ目で折り返す */
export function FFPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F9F8F5] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#111111] antialiased [word-break:auto-phrase]">
      {children}
    </div>
  );
}

/** 上部に貼り付くナビゲーション。アプリ名は Futura で書く */
export function FFNav({ icon, children }: { icon: ReactNode; children?: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#F9F8F5]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between gap-4 px-6">
        <a href="/ffmultiplier" className={cn("flex items-center gap-2 text-[17px] tracking-wide", HEADING_FONT)}>
          {icon}
          FFMultiplier
        </a>
        <nav className="flex items-center gap-5 text-[13px] text-neutral-600">{children}</nav>
      </div>
    </header>
  );
}

export type Tone = "paper" | "dark" | "green";

const TONE_CLASS: Record<Tone, string> = {
  paper: "bg-[#F9F8F5] text-[#111111]",
  dark: "bg-[#111111] text-[#F9F8F5]",
  green: "bg-[#85BF5D] text-[#111111]", // 白い文字は緑の地でコントラストが足りないので、文字は黒にする
};

/** 白い地・ゲーム画面の黒・FFGreen のどれかで塗る帯 */
export function Section({ tone = "paper", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <section className={TONE_CLASS[tone]}>
      <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-28", className)}>{children}</div>
    </section>
  );
}

/** 中央寄せの見出し。title は文節ごとに渡す */
export function FFHeading({ title, tone = "paper", children }: { title: string[]; tone?: Tone; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <h2 className={cn("text-[clamp(26px,5vw,44px)] font-bold leading-[1.25] tracking-[0.01em]", HEADING_FONT)}>
        <Phrases phrases={title} />
      </h2>
      {children && (
        <p className={cn("text-[clamp(16px,2vw,18px)] leading-[1.85]", tone === "paper" ? "text-neutral-600" : tone === "dark" ? "text-neutral-400" : "text-[#111111]/80")}>
          {children}
        </p>
      )}
    </div>
  );
}

/**
 * 説明と図を並べるカード。図（children）は高さをそろえた枠の中で上下中央に置き、
 * 同じ行のカードどうしで図の位置と高さが変わらないようにする。figureClassName で枠の高さを決める。
 */
export function FFCard({
  title,
  body,
  tone = "paper",
  figureClassName = "h-24",
  children,
}: {
  title: string;
  body: ReactNode;
  tone?: Tone;
  figureClassName?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-6 overflow-hidden rounded-[24px] p-6 sm:p-7",
        tone === "dark" ? "bg-[#1E1E1E] text-[#F9F8F5] ring-1 ring-white/5" : "bg-white text-[#111111] ring-1 ring-black/5",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className={cn("text-[20px] font-bold", HEADING_FONT)}>{title}</h3>
        <p className={cn("text-[15px] leading-[1.8]", tone === "dark" ? "text-neutral-400" : "text-neutral-600")}>{body}</p>
      </div>
      <div className={cn("mt-auto flex w-full items-center justify-center", figureClassName)}>{children}</div>
    </div>
  );
}

/** App Store へのボタン。地の色に合わせて黒か緑にする */
export function StoreButton({ variant = "dark", size = "lg", children }: { variant?: "dark" | "green"; size?: "sm" | "lg"; children: ReactNode }) {
  return (
    <a
      href={APP_STORE_URL}
      className={cn(
        "rounded-full font-bold text-white motion-safe:transition-colors",
        variant === "dark" ? "bg-[#111111] hover:bg-[#2a2a2a]" : "bg-[#85BF5D] hover:bg-[#78B050]",
        size === "lg" ? "px-7 py-3 text-[17px]" : "px-3.5 py-1 text-[12px]",
      )}
    >
      {children}
    </a>
  );
}

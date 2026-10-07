import type { ReactNode } from "react";

import { Phrases } from "@/components/app-lp";
import { cn } from "@/lib/utils";

import { QuizIcon } from "./QuizIcon";
import { INDIGO } from "./quiz-ui";

/**
 * Programming Quiz の紹介ページの部品。
 * Intento などの Apple の製品ページ寄りの部品（app-lp）ではなく、アプリの見た目に寄せる。
 * 地はアプリと同じ systemGroupedBackground（#F2F2F7）、中身は角の丸い白いカード、メインのボタンはインディゴ。
 */

export const GROUPED_BG = "#F2F2F7";

/** ページ全体。書体と折り返しは app-lp の AppPage と同じにする */
export function QuizPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F2F2F7] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1C1C1E] antialiased [word-break:auto-phrase]">
      {children}
    </div>
  );
}

/** 上部に貼り付くナビゲーション。地と同じ色を半透明にする */
export function QuizNav({ children }: { children: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[#F2F2F7]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between gap-4 px-5">
        <a href="/programming-quiz" className="flex min-w-0 items-center gap-2 text-[15px] font-bold">
          <QuizIcon className="h-6 w-6 shrink-0 shadow-none" />
          {/* 幅 320px 前後では文書ページのリンクと並びきらないので、名前は読み上げだけにする */}
          <span className="truncate max-[359px]:sr-only">Programming Quiz</span>
        </a>
        <nav className="flex shrink-0 items-center gap-4 text-[13px] text-neutral-600">{children}</nav>
      </div>
    </header>
  );
}

/** インディゴの丸いボタン型リンク（アプリの「スタート」と同じ色） */
export function StoreButton({ href, children, size = "lg" }: { href: string; children: ReactNode; size?: "sm" | "lg" }) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-bold text-white hover:brightness-110 motion-safe:transition motion-safe:active:scale-95",
        size === "lg" ? "px-8 py-3.5 text-[17px] shadow-[0_10px_24px_-10px_rgba(88,86,214,0.7)]" : "px-3.5 py-1 text-[12px]",
      )}
      style={{ background: INDIGO }}
    >
      {children}
    </a>
  );
}

/** ひとまとまりの説明。帯の色は変えず、余白とカードで区切る */
export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-16 sm:py-24", className)}>{children}</section>
  );
}

/** 見出し。上にアプリと同じ色の丸い角のアイコンを置ける。title は文節ごとに渡す */
export function SectionHeading({ title, icon, children }: { title: string[]; icon?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      {icon}
      <h2 className="text-[clamp(26px,4.6vw,42px)] font-extrabold leading-[1.25] tracking-[-0.01em] [font-feature-settings:'palt']">
        <Phrases phrases={title} />
      </h2>
      {children && <p className="text-[clamp(15px,1.9vw,18px)] leading-[1.8] text-neutral-600">{children}</p>}
    </div>
  );
}

/** 見出しの上の丸い角のアイコン */
export function IconBadge({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span className="flex h-12 w-12 items-center justify-center rounded-[14px] text-white shadow-sm" style={{ background: color }} aria-hidden>
      {children}
    </span>
  );
}

/** 白いカード。図（figure）は下端にそろえ、本文の長さが違っても並びの中で位置がずれないようにする */
export function Card({
  title,
  body,
  badge,
  figure,
  className,
}: {
  title: ReactNode;
  body: ReactNode;
  badge?: ReactNode;
  figure?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex h-full flex-col gap-5 overflow-hidden rounded-[28px] bg-white p-6 sm:p-7", className)}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold">{title}</h3>
          {badge}
        </div>
        <p className="text-[15px] leading-[1.8] text-neutral-600">{body}</p>
      </div>
      {figure && <div className="mt-auto flex w-full justify-center">{figure}</div>}
    </div>
  );
}

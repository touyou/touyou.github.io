"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { appBanners, type AppArt, type AppBanner } from "./app-banners";

/**
 * トップページの、アプリの紹介ページへのカードを横に並べたカルーセル。
 * App Store のカテゴリカードのように、色と絵でリンク先の雰囲気を伝え、文字はアプリ名だけにする。
 * 横スクロールとスクロールスナップで動かし、広い画面では左右のボタンでも送れるようにする。
 */
export function AppCarousel() {
  const scroller = useRef<HTMLUListElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-label="つくったアプリ" className="relative w-full">
      <ul
        ref={scroller}
        className="flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:scroll-px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {appBanners.map((app) => (
          <li key={app.id} className="snap-start">
            <Card app={app} />
          </li>
        ))}
      </ul>
      <div className="mx-auto mt-3 hidden w-full max-w-6xl justify-end gap-2 px-6 sm:flex">
        <ArrowButton label="前のアプリへ" onClick={() => scrollByPage(-1)} direction={-1} />
        <ArrowButton label="次のアプリへ" onClick={() => scrollByPage(1)} direction={1} />
      </div>
    </section>
  );
}

function Card({ app }: { app: AppBanner }) {
  const art = ARTS[app.id];
  const external = app.href.startsWith("http");
  const light = art.text === "light";
  return (
    <a
      href={app.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={`${app.name}${app.status ? `（${app.status}）` : ""}${app.android ? "（Android にも対応）" : ""}`}
      className="group relative block h-[150px] w-[240px] overflow-hidden rounded-[20px] ring-1 ring-black/5 sm:h-[175px] sm:w-[280px]"
      style={{ background: art.background }}
    >
      {/* 絵。ホバーで少しだけ寄る */}
      <div className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]" aria-hidden>
        {art.render}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <span className={cn("text-[17px] font-bold leading-tight tracking-tight", light ? "text-white" : "text-[#1d1d1f]")}>{app.name}</span>
        {(app.status || app.android) && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold backdrop-blur",
              light ? "bg-white/20 text-white" : "bg-black/10 text-[#1d1d1f]",
            )}
          >
            {app.status ?? "Android にも対応"}
          </span>
        )}
      </div>
    </a>
  );
}

/* ---------------------------------------------------------------------------
 * 各アプリの絵。アプリ自身の画面やアイコンのモチーフを、CSS で単純化して描く
 * ------------------------------------------------------------------------- */

const ARTS: Record<AppArt, { background: string; text: "light" | "dark"; render: ReactNode }> = {
  intento: {
    background: "linear-gradient(160deg, #F7F7FA, #E6E6EC)",
    text: "dark",
    render: (
      <div className="absolute -right-4 top-4 flex w-[62%] rotate-[-6deg] flex-col gap-2 rounded-2xl bg-white p-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]">
        {[
          { done: true, star: true },
          { done: false, star: true },
          { done: false, star: false },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className={cn("h-3.5 w-3.5 shrink-0 rounded-full", row.done ? "bg-[#34C759]" : "border-[1.5px] border-[#8E939B]")} />
            <span className={cn("h-2 flex-1 rounded-full", row.done ? "bg-[#C2C8D0]" : "bg-[#5B6068]")} />
            <span className={cn("text-[11px] leading-none", row.star ? "text-[#FFC400]" : "text-[#8E939B]")}>{row.star ? "★" : "☆"}</span>
          </div>
        ))}
      </div>
    ),
  },
  toreta: {
    background: "linear-gradient(150deg, #4C82F7, #2456D6)",
    text: "light",
    render: (
      <div className="absolute right-6 top-3 h-full w-1/2">
        {[
          { rotate: -16, x: -18, colors: ["#9FCBE6", "#2F86B8"] },
          { rotate: -2, x: 14, colors: ["#F3A6C4", "#D9578F"] },
          { rotate: 13, x: 46, colors: ["#F6C987", "#D98A1E"] },
        ].map((card, i) => (
          <span
            key={i}
            className="absolute top-0 flex aspect-[5/7] w-[46%] flex-col rounded-[8px] p-1.5 shadow-lg ring-1 ring-white/30"
            style={{ left: card.x, transform: `rotate(${card.rotate}deg)`, background: `linear-gradient(155deg, ${card.colors[0]}, ${card.colors[1]})` }}
          >
            <span className="flex-1 rounded-[4px] bg-white/30" />
            <span className="mx-auto mt-1 h-1 w-2/3 rounded-full bg-white/70" />
          </span>
        ))}
      </div>
    ),
  },
  graphica: {
    background: "#06060A",
    text: "light",
    render: (
      <>
        {/* GRAPHICA の OGP 画像のうち、文字の入っていない上の部分 */}
        <Image src="/apps/graphica-art.jpg" alt="" fill sizes="280px" className="object-cover" />
        <svg viewBox="0 0 100 100" className="absolute right-5 top-5 h-14 w-14 drop-shadow-[0_0_14px_rgba(217,255,77,0.6)]">
          <path d="M50 0 C55 38 62 45 100 50 C62 55 55 62 50 100 C45 62 38 55 0 50 C38 45 45 38 50 0Z" fill="#D9FF4D" />
        </svg>
      </>
    ),
  },
  playground: {
    background: "radial-gradient(circle at 72% 40%, #8BE3FF 0%, #2A9FD6 14%, #0E4F7A 32%, #0B1A26 58%, #0B0C0E 80%)",
    text: "light",
    render: (
      <>
        <span className="absolute left-[72%] top-[40%] h-[150%] w-auto -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#67DABD]/30" style={{ aspectRatio: "1" }} />
        <span className="absolute left-[72%] top-[40%] h-[95%] w-auto -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/25" style={{ aspectRatio: "1" }} />
      </>
    ),
  },
  checkitout: {
    background: "linear-gradient(160deg, #1B1B21, #0B0B0E)",
    text: "light",
    render: (
      <div className="absolute right-4 top-4 grid grid-cols-2 gap-2 [transform:perspective(300px)_rotateY(-18deg)_rotateX(8deg)]">
        {["#FF3B30", "#FFCC00", "#34C759", "#0A84FF"].map((color) => (
          <span
            key={color}
            className="h-11 w-11 rounded-[10px] border-[2.5px] bg-black/40"
            style={{ borderColor: color, boxShadow: `0 0 16px ${color}55, inset 0 0 12px ${color}33` }}
          />
        ))}
      </div>
    ),
  },
  quiz: {
    background: "linear-gradient(150deg, #6E6CF0, #4B49C4)",
    text: "light",
    render: (
      <div className="absolute -right-3 top-4 flex w-[58%] flex-col gap-1.5">
        {["A", "B", "C"].map((label, i) => (
          <span
            key={label}
            className={cn(
              "flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[11px] font-bold shadow-sm",
              i === 1 ? "bg-white text-[#4B49C4]" : "bg-white/20 text-white",
            )}
          >
            <span className={cn("flex h-4 w-4 items-center justify-center rounded-full text-[9px]", i === 1 ? "bg-[#34C759] text-white" : "bg-white/25")}>
              {i === 1 ? "✓" : label}
            </span>
            <span className={cn("h-1.5 flex-1 rounded-full", i === 1 ? "bg-[#4B49C4]/30" : "bg-white/30")} />
          </span>
        ))}
      </div>
    ),
  },
  ffmultiplier: {
    background: "linear-gradient(150deg, #93CB6B, #6FA748)",
    text: "dark",
    render: (
      <div className="absolute right-4 top-4 rounded-xl bg-[#111111] px-3 py-2 font-mono text-[28px] font-bold leading-none tracking-[0.12em] text-[#85BF5D] shadow-lg [text-shadow:0_0_10px_rgba(133,191,93,0.6)]">
        A×F
        <span className="block text-right text-[20px] text-[#F9F8F5]">=96</span>
      </div>
    ),
  },
};

function ArrowButton({ label, onClick, direction }: { label: string; onClick: () => void; direction: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-base text-neutral-600 transition-colors hover:bg-black/10"
    >
      <span aria-hidden>{direction === 1 ? "›" : "‹"}</span>
    </button>
  );
}

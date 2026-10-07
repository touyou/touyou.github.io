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
      className={cn(
        "group relative block h-[150px] w-[240px] overflow-hidden rounded-[20px] sm:h-[175px] sm:w-[280px]",
        light ? "ring-1 ring-inset ring-white/[0.08]" : "ring-1 ring-inset ring-black/[0.06]",
      )}
      style={{ background: art.background }}
    >
      {/* 絵。ホバーで少しだけ寄る */}
      <div className="absolute inset-0 motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]" aria-hidden>
        {art.render}
      </div>
      {/* 名前の下だけ地を少し沈めて、絵の上でも読めるようにする */}
      {light && <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent" aria-hidden />}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-4 pb-3.5">
        <span className={cn("text-[15px] font-semibold leading-tight tracking-[-0.01em]", light ? "text-white" : "text-[#1d1d1f]")}>{app.name}</span>
        {(app.status || app.android) && (
          <span
            className={cn(
              "shrink-0 text-[10px] font-medium tracking-wide",
              light ? "text-white/60" : "text-[#1d1d1f]/55",
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
 * 各アプリの絵。アプリ自身の画面やアイコンのモチーフを、CSS と SVG で単純化して描く。
 * 記号はフォントによって形が変わるので、文字ではなく SVG で描く
 * ------------------------------------------------------------------------- */

function StarGlyph({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 3.2l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.5l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7z"
        fill={filled ? "#FFC400" : "none"}
        stroke={filled ? "#FFC400" : "#A1A6AE"}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path d="M6 12.5l4 4L18 8" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** 7 セグメント表示。FFMultiplier のゲーム画面の数字（DSEG7）に寄せて、消えているセグメントもうっすら見せる */
const SEGMENTS: Record<string, string> = {
  "9": "abcdfg",
  "6": "acdefg",
  A: "abcefg",
  F: "aefg",
};
const SEGMENT_PATHS: Record<string, string> = {
  a: "M2.6 1h6.8l-1.4 1.6H4z",
  b: "M9.8 1.4l.0 7.2-1.3 .8-.9-1.1V3.1z",
  c: "M9.8 10.4v7.2l-2.2-1.7v-4.6l.9-1.1z",
  d: "M2.6 18h6.8l-1.4-1.6H4z",
  e: "M2.2 10.4v7.2l2.2-1.7v-4.6l-.9-1.1z",
  f: "M2.2 1.4v7.2l1.3 .8.9-1.1V3.1z",
  g: "M3.4 9.5l1-1h5.2l1 1-1 1H4.4z",
};

function SevenSegment({ char }: { char: string }) {
  const lit = SEGMENTS[char] ?? "";
  return (
    <svg viewBox="0 0 12 19" className="h-full w-auto -skew-x-6">
      {Object.entries(SEGMENT_PATHS).map(([key, d]) => (
        <path key={key} d={d} fill={lit.includes(key) ? "#9BE06A" : "rgba(155,224,106,0.08)"} />
      ))}
    </svg>
  );
}

const DARK_RING = "ring-1 ring-inset ring-white/[0.08]";

const ARTS: Record<AppArt, { background: string; text: "light" | "dark"; render: ReactNode }> = {
  intento: {
    background: "linear-gradient(165deg, #FBFBFD 0%, #ECECF1 100%)",
    text: "dark",
    render: (
      <div className="absolute right-[-10%] top-[14%] flex w-[64%] rotate-[-5deg] flex-col gap-[7px] rounded-[14px] bg-white px-3 py-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_-8px_rgba(0,0,0,0.18)]">
        {[
          { done: true, star: true, w: "62%" },
          { done: false, star: true, w: "78%" },
          { done: false, star: false, w: "54%" },
        ].map((row, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-[13px] w-[13px] shrink-0 items-center justify-center rounded-full",
                row.done ? "bg-[#34C759] text-white" : "border-[1.5px] border-[#A1A6AE]",
              )}
            >
              {row.done && <CheckGlyph className="h-[9px] w-[9px]" />}
            </span>
            <span className={cn("h-[5px] rounded-full", row.done ? "bg-[#D5D9DF]" : "bg-[#3A3D42]")} style={{ width: row.w }} />
            <StarGlyph filled={row.star} className="ml-auto h-[11px] w-[11px]" />
          </div>
        ))}
      </div>
    ),
  },
  toreta: {
    background: "linear-gradient(160deg, #5A8BF8 0%, #2C5FE0 100%)",
    text: "light",
    render: (
      <div className="absolute right-[8%] top-[10%] h-[70%] w-[48%]">
        {[
          { rotate: -14, left: "0%", colors: ["#B8D8EE", "#3E8FC0"] },
          { rotate: -1, left: "24%", colors: ["#F7BCD3", "#D85D93"] },
          { rotate: 12, left: "48%", colors: ["#F8D69F", "#DC9128"] },
        ].map((card, i) => (
          <span
            key={i}
            className="absolute top-0 flex aspect-[5/7] w-[48%] flex-col gap-[5px] rounded-[7px] p-[5px] shadow-[0_8px_18px_-6px_rgba(10,30,90,0.55)] ring-1 ring-inset ring-white/25"
            style={{ left: card.left, transform: `rotate(${card.rotate}deg)`, background: `linear-gradient(155deg, ${card.colors[0]}, ${card.colors[1]})` }}
          >
            <span className="flex-1 rounded-[3px] bg-white/25" />
            <span className="mx-auto h-[3px] w-3/5 rounded-full bg-white/75" />
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
        <Image src="/apps/graphica-art.jpg" alt="" fill sizes="280px" className="object-cover opacity-90" />
        <svg viewBox="0 0 100 100" className="absolute right-[9%] top-[14%] h-[34%] w-auto drop-shadow-[0_0_18px_rgba(217,255,77,0.45)]">
          <path d="M50 0 C55 38 62 45 100 50 C62 55 55 62 50 100 C45 62 38 55 0 50 C38 45 45 38 50 0Z" fill="#D9FF4D" />
        </svg>
      </>
    ),
  },
  playground: {
    background: "linear-gradient(160deg, #16171A 0%, #0B0C0E 100%)",
    text: "light",
    render: (
      // シェーダーのプレビューと、それを書いたコード。Playground の「描いて、コードで学ぶ」を小さな編集画面で見せる
      <div className={cn("absolute right-[-6%] top-[12%] flex w-[78%] gap-2.5 rounded-[12px] bg-[#1C1D21] p-2.5 shadow-[0_14px_30px_-10px_rgba(0,0,0,0.8)]", DARK_RING)}>
        <span className="relative aspect-square w-[38%] shrink-0 overflow-hidden rounded-[8px]">
          <Image src="/apps/playground-preview.jpg" alt="" fill sizes="80px" className="object-cover" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col justify-center gap-[6px] overflow-hidden whitespace-nowrap font-mono text-[8.5px] leading-none text-white/45">
          <span>
            <span className="text-[#67DABD]">float</span> d = length(uv);
          </span>
          <span>
            <span className="text-[#67DABD]">float</span> ring =
          </span>
          <span className="pl-2">smoothstep(.3, .0, …);</span>
          <span>
            <span className="text-[#C792EA]">return</span> half4(col, 1);
          </span>
        </span>
      </div>
    ),
  },
  checkitout: {
    background: "linear-gradient(165deg, #1A1A1F 0%, #0A0A0C 100%)",
    text: "light",
    render: (
      <div className="absolute right-[9%] top-[12%] grid grid-cols-2 gap-[7px] [transform:perspective(320px)_rotateY(-20deg)_rotateX(10deg)]">
        {["#FF453A", "#FFD60A", "#32D74B", "#0A84FF"].map((color, i) => (
          <span
            key={color}
            className="h-[42px] w-[42px] rounded-[10px] border-2"
            style={{
              borderColor: color,
              background: i === 2 ? `${color}33` : "rgba(0,0,0,0.35)",
              boxShadow: i === 2 ? `0 0 22px ${color}88, inset 0 0 14px ${color}55` : `0 0 12px ${color}40`,
            }}
          />
        ))}
      </div>
    ),
  },
  quiz: {
    background: "linear-gradient(160deg, #7472F2 0%, #4C4AC8 100%)",
    text: "light",
    render: (
      <div className="absolute right-[-6%] top-[12%] flex w-[60%] flex-col gap-[6px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn(
              "flex items-center gap-2 rounded-full px-2.5 py-[7px]",
              i === 1 ? "bg-white shadow-[0_6px_16px_-6px_rgba(20,10,80,0.6)]" : "bg-white/[0.16] ring-1 ring-inset ring-white/15",
            )}
          >
            <span
              className={cn(
                "flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full",
                i === 1 ? "bg-[#34C759] text-white" : "border-[1.5px] border-white/50",
              )}
            >
              {i === 1 && <CheckGlyph className="h-[10px] w-[10px]" />}
            </span>
            <span className={cn("h-[5px] rounded-full", i === 1 ? "bg-[#4C4AC8]/35" : "bg-white/35")} style={{ width: ["58%", "72%", "46%"][i] }} />
          </span>
        ))}
      </div>
    ),
  },
  ffmultiplier: {
    background: "linear-gradient(160deg, #9AD172 0%, #72AB4B 100%)",
    text: "dark",
    render: (
      <div className={cn("absolute right-[7%] top-[12%] flex flex-col items-end gap-1.5 rounded-[12px] bg-[#111111] px-3 py-2.5 shadow-[0_12px_26px_-10px_rgba(20,40,10,0.7)]", DARK_RING)}>
        <span className="flex h-[30px] items-center gap-1.5 [filter:drop-shadow(0_0_6px_rgba(155,224,106,0.55))]">
          <SevenSegment char="A" />
          <span className="text-[13px] font-light text-[#9BE06A]/70">×</span>
          <SevenSegment char="F" />
        </span>
        <span className="flex h-[22px] items-center gap-1 [filter:drop-shadow(0_0_6px_rgba(155,224,106,0.55))]">
          <span className="mr-0.5 text-[12px] font-light text-[#9BE06A]/70">=</span>
          <SevenSegment char="9" />
          <SevenSegment char="6" />
        </span>
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

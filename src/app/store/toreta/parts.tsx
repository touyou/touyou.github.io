"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Toreta のストア画像で繰り返し使う意匠。アプリのアイコン（傾いた 2 枚のカード）と、
 * アプリのサンプルのカード（「スターライト・クロニクル」の絵柄）を CSS で描く。
 */

/** 夜空の地に使う色。アイコンの青（#2F6BF2）と、スクショのアクセント（インディゴ #5146D9）から取る */
export const INK = { top: "#1A1748", bottom: "#0B0A24", gold: "#F2C14E", text: "#F5F4FF", sub: "#B9B5E8" } as const;

/** アプリのアイコン。Icon Composer の 2 枚のカード（後ろは -14°、前は 9°）を青の地に重ねる */
export function ToretaIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" className="block rounded-[22.5%] shadow-[0_10px_30px_rgba(0,0,0,0.35)]" aria-label="Toreta のアイコン">
      <defs>
        <linearGradient id="toreta-icon-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5C8DF7" />
          <stop offset="1" stopColor="#1F55D6" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#toreta-icon-bg)" />
      <g transform="rotate(-14 512 512)" opacity="0.75">
        <rect x="300" y="222" width="400" height="560" rx="44" fill="#FFFFFF" />
      </g>
      <g transform="rotate(9 512 512) translate(40 24)">
        <rect x="300" y="222" width="400" height="560" rx="44" fill="#FFFFFF" />
        <rect x="336" y="300" width="328" height="300" rx="22" fill="#2F6BF2" fillOpacity="0.85" />
        <rect x="336" y="632" width="200" height="34" rx="17" fill="#2F6BF2" fillOpacity="0.55" />
        <rect x="336" y="688" width="136" height="34" rx="17" fill="#2F6BF2" fillOpacity="0.35" />
      </g>
    </svg>
  );
}

// アプリのサンプルのカードの記号（雪・きらめき・稲妻・月・しずく・葉）
const SYMBOLS = {
  snow: "M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 3.5l3 2.5 3-2.5M9 20.5l3-2.5 3 2.5",
  sparkle: "M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z",
  bolt: "M13.5 2L4.5 13.5h6.5L9.5 22l10-12.5H13z",
  moon: "M15.5 3a9 9 0 1 0 5.5 13.6A7.2 7.2 0 0 1 15.5 3z",
  drop: "M12 2.5S5 10.2 5 15a7 7 0 0 0 14 0c0-4.8-7-12.5-7-12.5z",
  leaf: "M4.5 19.5C4.5 10 10.5 4.5 20 4.5c0 9.5-5.5 15-15.5 15zM4.5 19.5L14 10",
} as const;
type SymbolName = keyof typeof SYMBOLS;

/** スクショに写っているサンプルのカード。名前・番号・レアリティはアプリのダミーデータのまま */
export const CARDS = {
  bell: { name: "時計塔のベル", no: "SC01-001", rarity: "SR", symbol: "snow", art: ["#E9EEFF", "#8E9BD8", "#5B66B8"], frame: "#9A7CF0" },
  luka: { name: "琥珀のルカ", no: "SC01-003", rarity: "R", symbol: "bolt", art: ["#FFF4B8", "#E8C04A", "#6E6A86"], frame: "#7B6BEA" },
  mina: { name: "夜明けのミナ", no: "SC01-004", rarity: "C", symbol: "moon", art: ["#C9B8FF", "#7E5CE6", "#3B2A9E"], frame: "#6C5CE0" },
  kai: { name: "森番のカイ", no: "SC01-006", rarity: "C", symbol: "drop", art: ["#C8F0FF", "#4FB3E8", "#2364B8"], frame: "#5AA5E6" },
  rei: { name: "灯火のレイ", no: "SC01-007", rarity: "C", symbol: "leaf", art: ["#E2F7D2", "#7CC48A", "#2E7D5B"], frame: "#5FB07A" },
  shion: { name: "風渡りのシオン", no: "SC01-002", rarity: "C", symbol: "sparkle", art: ["#FFE1F4", "#E07AC0", "#7B3FA8"], frame: "#D46AB4" },
} as const satisfies Record<string, { name: string; no: string; rarity: string; symbol: SymbolName; art: readonly string[]; frame: string }>;
export type CardName = keyof typeof CARDS;

/**
 * トレカ 1 枚。縦横比は実物のカード（63×88）に合わせる。blur で奥に置いたカードをぼかし、奥行きを出す。
 * 文字はカードの幅に比例させるので、どの大きさでも同じ見た目になる
 */
export function TCard({ card, width, blur = 0, plain = false, className, style }: { card: CardName; width: number; blur?: number; plain?: boolean; className?: string; style?: CSSProperties }) {
  const c = CARDS[card];
  const u = width / 100;
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width,
        height: (width * 88) / 63,
        borderRadius: 6 * u,
        padding: 4.5 * u,
        background: `linear-gradient(160deg, ${c.frame}, color-mix(in srgb, ${c.frame} 55%, #1a1748))`,
        boxShadow: `0 ${18 * u}px ${36 * u}px -${10 * u}px rgba(5,4,25,0.6)`,
        filter: blur ? `blur(${blur}px)` : undefined,
        ...style,
      }}
    >
      <div className="relative h-full w-full overflow-hidden" style={{ borderRadius: 3 * u, background: `linear-gradient(170deg, ${c.art[0]}, ${c.art[1]} 55%, ${c.art[2]})` }}>
        {/* ホイルの斜めの光 */}
        <div
          className="absolute inset-0"
          style={{ background: "repeating-linear-gradient(120deg, rgba(255,255,255,0) 0 14%, rgba(255,255,255,0.22) 14% 20%, rgba(255,255,255,0) 20% 34%)" }}
        />
        <svg viewBox="0 0 24 24" className="absolute left-1/2 -translate-x-1/2" style={{ top: 22 * u, width: 40 * u, height: 40 * u }} aria-hidden>
          <path d={SYMBOLS[c.symbol]} fill={c.symbol === "snow" || c.symbol === "leaf" ? "none" : "white"} stroke="white" strokeWidth={c.symbol === "snow" || c.symbol === "leaf" ? 1.8 : 0} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {!plain && (
          <div className="absolute inset-x-0 bottom-0 bg-[#1C1840]/90 text-white" style={{ padding: `${3.5 * u}px ${5 * u}px ${3 * u}px` }}>
            <div className="text-center font-bold leading-none" style={{ fontSize: 8.4 * u }}>
              {c.name}
            </div>
            <div className="flex justify-between font-semibold leading-none opacity-80" style={{ fontSize: 4.6 * u, marginTop: 2.6 * u }}>
              <span>{c.no}</span>
              <span>{c.rarity}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** 夜空の地。カードの色をぼかして流し、ごく薄い粒子で色の段をならす。点や丸の飾りは置かない */
export function NightSky({ glows, id }: { glows: { x: number; y: number; rx: number; ry: number; c: string; o?: number }[]; id: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {glows.map((g) => (
        <span
          key={`${g.x}-${g.y}`}
          className="absolute rounded-full blur-[110px]"
          style={{ left: g.x - g.rx, top: g.y - g.ry, width: g.rx * 2, height: g.ry * 2, background: g.c, opacity: g.o ?? 0.5 }}
        />
      ))}
      <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-screen">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** 端末の後ろに置くぼかした光。暗い地でも端末の輪郭が沈まないようにする */
export function Backlight({ color, className, style }: { color: string; className?: string; style?: CSSProperties }) {
  return <div aria-hidden className={cn("absolute rounded-[30%] blur-[60px]", className)} style={{ background: color, opacity: 0.55, ...style }} />;
}

/** カメラの読み取り枠。角だけの括弧で、カードを囲む */
export function Viewfinder({ width, height, stroke }: { width: number; height: number; stroke: number }) {
  const arm = Math.min(width, height) * 0.16;
  const corner = (x: number, y: number, sx: number, sy: number) => `M${x} ${y + sy * arm}V${y}H${x + sx * arm}`;
  const i = stroke / 2;
  return (
    <svg width={width} height={height} className="block overflow-visible" aria-hidden>
      <path
        d={[corner(i, i, 1, 1), corner(width - i, i, -1, 1), corner(i, height - i, 1, -1), corner(width - i, height - i, -1, -1)].join("")}
        fill="none"
        stroke="white"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 読み取ったカードの知らせ。アプリの読み取り画面と同じく、番号・名前・所持枚数と「追加」を出す */
export function ScanResult({ card, owned, zoom = 1 }: { card: CardName; owned: number; zoom?: number }) {
  const c = CARDS[card];
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-white/95 py-3 pl-3 pr-3 text-[#1d1d1f] shadow-[0_24px_50px_-16px_rgba(5,4,25,0.7)]" style={{ zoom }}>
      <TCard card={card} width={38} plain style={{ boxShadow: "none" }} />
      <div className="flex flex-col gap-0.5 pr-2">
        <span className="text-[11px] font-semibold text-neutral-500">{c.no}</span>
        <span className="whitespace-nowrap text-[15px] font-bold leading-tight">{c.name}</span>
        <span className="text-[11px] font-medium text-neutral-500">所持 {owned} 枚</span>
      </div>
      <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-[#5146D9] px-3.5 py-2 text-[13px] font-bold text-white">＋ 追加</span>
    </div>
  );
}

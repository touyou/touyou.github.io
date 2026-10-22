"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * GRAPHICA のストア画像の部品。いま App Store に出ている画像（暗い地にぼけた金色の光、Syne のワードマーク、
 * IBM Plex Mono の大文字の一言、チタンの iPhone）をそのまま組み直すためのもの。
 * 色と書体はアプリの Web 版（graphica の app/globals.css・assets/brand）と同じ値。
 * 姉妹アプリの Graphica Playground も同じ部品を使い、光の色だけを変える。
 */

export const G = {
  void: "#06060a",
  paper: "#ece9e2",
  acid: "#d9ff4d",
  mint: "#67dabd",
} as const;

export const DISPLAY = "font-['Syne',sans-serif]";
export const MONO = "font-['IBM_Plex_Mono',ui-monospace,monospace]";
export const BODY = "font-['Zen_Kaku_Gothic_New','Hiragino_Sans','Hiragino_Kaku_Gothic_ProN',sans-serif]";

/** ページの頭に置く。書体を読み込み、開発サーバーのインジケータを写さない */
export function StoreStyle({ background = G.void }: { background?: string }) {
  return (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=IBM+Plex+Mono:wght@500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=block');nextjs-portal{display:none!important}body{margin:0;background:${background}}`}</style>
  );
}

/** 帯の中のある位置に置く。x は帯の左端からの距離なので、画像の境目をまたいで置ける */
export function Place({ x, y, w, rotate = 0, z, children, className, style }: { x: number; y: number; w?: number; rotate?: number; z?: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn("absolute", className)} style={{ left: x, top: y, width: w, transform: rotate ? `rotate(${rotate}deg)` : undefined, zIndex: z, ...style }}>
      {children}
    </div>
  );
}

/** 決まった種から同じ並びを返す乱数。撮るたびに光の粒が動かないようにする */
function random(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export type Light = { x: number; y: number; r: number; angle?: number };
export type Palette = { base: string; glow: string; dot: string; dot2: string };

/** GRAPHICA の地: 夜の青から上の光源に向かって金色に温まる */
export const GOLD: Palette = {
  base: "radial-gradient(140% 90% at 70% 0%, #2a2216 0%, #12131a 45%, #0a0b11 100%)",
  glow: "rgba(255,214,150,0.55)",
  dot: "255,220,160",
  dot2: "190,205,255",
};

/**
 * ぼけた光の粒と、上から差す光の筋。画像の上から下までまんべんなく散らし、途中で途切れさせない。
 * 粒は奥（小さくぼけ弱い）と手前（大きくぼけ強い）の 2 層。
 */
export function Bokeh({ width, height, lights, palette = GOLD, density = 1, seed = 7, scale = 1 }: { width: number; height: number; lights: Light[]; palette?: Palette; density?: number; seed?: number; scale?: number }) {
  const rnd = random(seed);
  const count = Math.round(((width * height) / 9000) * density);
  const dots = Array.from({ length: count }, (_, i) => {
    const near = rnd() < 0.18;
    const r = (near ? 10 + rnd() * 18 : 3 + rnd() * 7) * scale;
    const warm = rnd() < 0.72;
    return { i, x: rnd() * width, y: rnd() * height, r, blur: (near ? 5 + rnd() * 6 : 1 + rnd() * 2.5) * scale, a: near ? 0.1 + rnd() * 0.2 : 0.18 + rnd() * 0.42, warm };
  });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: palette.base }}>
      {lights.map((l, i) => (
        <div key={`l${i}`}>
          <span className="absolute rounded-full" style={{ left: l.x - l.r, top: l.y - l.r, width: l.r * 2, height: l.r * 2, background: `radial-gradient(circle, ${palette.glow} 0%, transparent 65%)`, filter: `blur(${l.r * 0.25}px)` }} />
          {/* 光の筋。光源から斜め下へ扇状に広げ、ぼかしてやわらげる */}
          <span
            className="absolute"
            style={{
              left: l.x - l.r * 2.4,
              top: l.y - l.r * 0.2,
              width: l.r * 4.8,
              height: l.r * 4.4,
              transformOrigin: "50% 0%",
              transform: `rotate(${l.angle ?? 0}deg)`,
              background: `repeating-conic-gradient(from 150deg at 50% 0%, transparent 0deg, ${palette.glow.replace(/[\d.]+\)$/, "0.09)")} 2deg, transparent 5deg, transparent 9deg)`,
              maskImage: "radial-gradient(70% 90% at 50% 0%, #000 0%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(70% 90% at 50% 0%, #000 0%, transparent 75%)",
              filter: `blur(${3 * scale}px)`,
            }}
          />
        </div>
      ))}
      {dots.map((d) => (
        <span
          key={d.i}
          className="absolute rounded-full"
          style={{ left: d.x - d.r, top: d.y - d.r, width: d.r * 2, height: d.r * 2, background: `rgba(${d.warm ? palette.dot : palette.dot2},${d.a})`, filter: `blur(${d.blur}px)` }}
        />
      ))}
      {/* 端を少し落とし、光が画面の外へ抜けていくように見せる */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(120% 100% at 50% 40%, transparent 55%, rgba(0,0,0,0.45) 100%)" }} />
    </div>
  );
}

/** 4 つの尖りの星（ブランドの ✦） */
export function Spark({ size, color = G.acid, className }: { size: number; color?: string; className?: string }) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 64 64" className={className}>
      <path d="M32 7 C 34.5 24, 40 29.5, 57 32 C 40 34.5, 34.5 40, 32 57 C 29.5 40, 24 34.5, 7 32 C 24 29.5, 29.5 24, 32 7 Z" fill={color} />
    </svg>
  );
}

/** ワードマーク。Web の SiteHeader と同じ Syne 700・字間 0.18em・paper 色に acid の ✦ */
export function Wordmark({ size, text = "GRAPHICA", spark = G.acid, className }: { size: number; text?: string; spark?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center whitespace-nowrap font-bold leading-none", DISPLAY, className)} style={{ fontSize: size, letterSpacing: "0.18em", color: G.paper }}>
      {text}
      <Spark size={size * 0.92} color={spark} className="ml-[0.02em]" />
    </span>
  );
}

/** 大文字の短い一言（GENERATIVE ART, FROM WORDS）。IBM Plex Mono の太字 */
export function Kicker({ children, size, className, style }: { children: ReactNode; size: number; className?: string; style?: CSSProperties }) {
  return (
    <span className={cn("whitespace-nowrap font-semibold uppercase leading-none", MONO, className)} style={{ fontSize: size, letterSpacing: "0.04em", color: G.paper, ...style }}>
      {children}
    </span>
  );
}

const DEVICE_SHADOW = "0 60px 90px -30px rgba(0,0,0,0.85), 0 20px 40px -20px rgba(0,0,0,0.6)";

/** チタンの iPhone。いまのストア画像の端末に合わせて明るめの灰色の枠に、側面のボタンを描く */
export function Phone({ src, width }: { src: string; width: number }) {
  const pad = width * 0.024;
  const r = width * 0.14;
  const btn = (top: number, h: number, side: "l" | "r") => (
    <span className="absolute rounded-full" style={{ [side === "l" ? "left" : "right"]: -width * 0.012, top: width * top, width: width * 0.016, height: width * h, background: "linear-gradient(90deg,#4a4d52,#9a9ea5,#4a4d52)" }} />
  );
  return (
    <div className="relative" style={{ width, padding: pad, borderRadius: r + pad, background: "linear-gradient(145deg,#8d929a 0%,#3a3d43 14%,#1f2125 50%,#3a3d43 86%,#9a9fa7 100%)", boxShadow: `${DEVICE_SHADOW}, inset 0 0 0 1.5px rgba(200,205,214,0.55)` }}>
      {btn(0.42, 0.1, "l")}
      {btn(0.56, 0.16, "l")}
      {btn(0.75, 0.16, "l")}
      {btn(0.62, 0.24, "r")}
      <div className="overflow-hidden bg-black" style={{ borderRadius: r, padding: width * 0.012 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block w-full" style={{ borderRadius: r * 0.92 }} />
      </div>
    </div>
  );
}

/** 銀の iPad Pro（横向きも縦向きも、渡したスクショの向きのまま） */
export function Tablet({ src, width }: { src: string; width: number }) {
  const pad = width * 0.022;
  const r = width * 0.035;
  return (
    <div className="relative" style={{ width, padding: pad * 0.25, borderRadius: r + pad, background: "linear-gradient(145deg,#e4e6ea,#9fa3aa 40%,#c9ccd1 70%,#f1f2f4)", boxShadow: DEVICE_SHADOW }}>
      <div className="bg-black" style={{ padding: pad * 0.75, borderRadius: r + pad * 0.75 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block w-full" style={{ borderRadius: r * 0.6 }} />
      </div>
    </div>
  );
}

/**
 * Mac のウィンドウ。撮ったウィンドウの画像（余白を足す前のもの）に、角丸と影を付ける。
 * 撮影ではウィンドウを画面いっぱいに広げるので中身が小さく空きが多い。crop で左上から切り出し、
 * 小さめのウィンドウに見せる（値はウィンドウの幅・高さに対する割合）
 */
export function MacWindow({ src, width, crop = { w: 1, h: 1 }, aspect }: { src: string; width: number; crop?: { w: number; h: number }; aspect: number }) {
  const imageWidth = width / crop.w;
  return (
    <div className="relative overflow-hidden" style={{ width, height: (imageWidth / aspect) * crop.h, borderRadius: width * 0.016, boxShadow: `${DEVICE_SHADOW}, 0 0 0 1px rgba(255,255,255,0.12)` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="absolute left-0 top-0 max-w-none" style={{ width: imageWidth }} />
    </div>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";

import { PAD_COLORS, PAD_FILL, PAD_FILL_PRESSED, type PadColor } from "@/components/checkitout/pads";
import { cn } from "@/lib/utils";

/**
 * チェケラのストア画像の部品。地はアプリと同じほぼ黒、色はパッドの赤・黄・緑・青だけを使う。
 * 紹介ページ（src/app/checkitout）と同じく、アプリのロゴの書体・ロゴ画像・声のサンプルは使わない。
 * 文字の勢いは、システムの一番太いウェイトと詰めた字間で出す。
 */

export const FONT = "font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]";

/** アプリの background 画像の細かいざらつきを SVG のノイズで近づけたもの（紹介ページの lp.tsx と同じ） */
export const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** パッド 1 個を大きく描く。枠の太さと光は大きさに比例させる */
export function NeonPad({
  color,
  size,
  pressed = false,
  label,
  className,
  style,
}: {
  color: PadColor;
  size: number;
  pressed?: boolean;
  label?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const c = PAD_COLORS[color];
  const border = Math.max(3, size * 0.055);
  const glow = pressed
    ? `0 0 ${size * 0.28}px ${c}CC, 0 0 ${size * 0.06}px ${c}, inset 0 0 ${size * 0.16}px ${c}77`
    : `0 0 ${size * 0.14}px ${c}66, inset 0 0 ${size * 0.06}px ${c}33`;
  return (
    <span
      className={cn("relative flex shrink-0 items-end", className)}
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.16,
        border: `${border}px solid ${c}`,
        background: pressed ? PAD_FILL_PRESSED : PAD_FILL,
        boxShadow: glow,
        padding: size * 0.07,
        ...style,
      }}
    >
      {label && (
        <span className="font-bold leading-none text-white" style={{ fontSize: Math.max(10, size * 0.12) }}>
          {label}
        </span>
      )}
    </span>
  );
}

const ROWS: PadColor[] = ["red", "yellow", "green", "blue"];

/** ピントの外れたパッドの塊。画像の境目に置き、隣の画像へ流れて見せる */
export function BokehPads({ colors, size, blur, opacity = 0.55 }: { colors: PadColor[]; size: number; blur: number; opacity?: number }) {
  return (
    <div className="grid grid-cols-2" style={{ gap: size * 0.12, filter: `blur(${blur}px)`, opacity }} aria-hidden>
      {colors.map((color, i) => (
        <NeonPad key={i} color={color} size={size} pressed={i === 0} />
      ))}
    </div>
  );
}

/** 4×4 の全部のパッド。押しているものだけ明るくする */
export function PadGrid({ size, pressed = [], gap }: { size: number; pressed?: number[]; gap?: number }) {
  return (
    <div className="grid grid-cols-4" style={{ gap: gap ?? size * 0.14 }}>
      {Array.from({ length: 16 }, (_, i) => (
        <NeonPad key={i} color={ROWS[Math.floor(i / 4)]} size={size} pressed={pressed.includes(i)} />
      ))}
    </div>
  );
}

/**
 * 録音パネルの波形を大きくしたもの。アプリと同じく中心から上下に伸びる棒で、山が 2 つの声の形にする。
 * 高さは決まった式で出すので、撮るたびに同じ絵になる
 */
export function Waveform({ width, height, color, bars = 90 }: { width: number; height: number; color: string; bars?: number }) {
  const step = width / bars;
  const mid = height / 2;
  const amps = Array.from({ length: bars }, (_, i) => {
    const t = i / bars;
    const env = 0.85 * Math.exp(-(((t - 0.3) / 0.13) ** 2)) + Math.exp(-(((t - 0.72) / 0.11) ** 2)) + 0.05;
    const jitter = 0.45 + 0.55 * Math.abs(Math.sin(i * 12.9898) * Math.cos(i * 4.1414));
    return Math.min(1, env * jitter);
  });
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ filter: `drop-shadow(0 0 ${height * 0.05}px ${color})` }} aria-hidden>
      {amps.map((a, i) => (
        <line
          key={i}
          x1={i * step + step / 2}
          x2={i * step + step / 2}
          y1={mid - a * mid * 0.95}
          y2={mid + a * mid * 0.95}
          stroke={color}
          strokeWidth={step * 0.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/** パッドの色の光を大きくぼかして、端末の下に敷く */
export function Glow({ x, y, w, h, color, opacity = 0.4, blur = 90 }: { x: number; y: number; w: number; h: number; color: PadColor; opacity?: number; blur?: number }) {
  return (
    <span
      className="absolute rounded-full"
      aria-hidden
      style={{ left: x, top: y, width: w, height: h, background: PAD_COLORS[color], opacity, filter: `blur(${blur}px)` }}
    />
  );
}

/** 見出しの上の札。パッドの色の小さな四角と英字のラベルで、6 枚に同じ形をくり返す */
export function Tag({ color, label, size }: { color: PadColor; label: string; size: number }) {
  const c = PAD_COLORS[color];
  return (
    <span className="flex items-center font-black tracking-[0.18em]" style={{ gap: size * 0.6, fontSize: size, color: c }}>
      <span style={{ width: size * 0.9, height: size * 0.9, borderRadius: size * 0.2, border: `${Math.max(2, size * 0.16)}px solid ${c}`, boxShadow: `0 0 ${size * 0.6}px ${c}` }} />
      {label}
    </span>
  );
}

/**
 * 実機のスクショを端末の枠に入れる。intento/strip.tsx の Device と同じ考え方で、横向きのスクショも入れられるようにした。
 * 角丸と枠の太さは短い辺に比例させる。黒い地に沈まないよう、枠の外側にごく細い明るい縁を付ける
 */
const KIND = {
  iphone: { pad: 0.022, radius: 0.12, aspect: 2868 / 1320 },
  ipad: { pad: 0.035, radius: 0.04, aspect: 2752 / 2064 },
} as const;

export const DEVICE_SHADOW = "0 0 0 1.5px rgba(255,255,255,0.16), 0 40px 70px -20px rgba(0,0,0,0.9), 0 12px 24px -10px rgba(0,0,0,0.7)";

export function Phone({ src, kind, width, landscape = false, children }: { src: string; kind: keyof typeof KIND; width: number; landscape?: boolean; children?: ReactNode }) {
  const { pad: padRatio, radius, aspect } = KIND[kind];
  const short = landscape ? width / aspect : width;
  const pad = Math.max(4, short * padRatio);
  const inner = short * radius;
  return (
    <div className="relative bg-[#1d1d1f]" style={{ width, padding: pad, borderRadius: inner + pad, boxShadow: DEVICE_SHADOW }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full" style={{ borderRadius: inner }} />
      {children}
    </div>
  );
}

/**
 * 紙吹雪。今ストアに出ている画像（ライブ会場に紙吹雪が舞う写真）の空気だけを借りる。写真は使わない。
 * 白い紙片を主にパッドの色を少し混ぜ、手前の何枚かはぼかして奥行きを出す。位置は決まった式で出す
 */
const CONFETTI_COLORS = ["#FFFFFF", "#FFFFFF", "#FFFFFF", PAD_COLORS.red, "#FFFFFF", PAD_COLORS.yellow, "#FFFFFF", PAD_COLORS.blue, "#FFFFFF", PAD_COLORS.green];

/** avoid（Confetti の中の座標）に入る紙片は描かない。見出しに紙片が重ならないようにする */
type Rect = { x: number; y: number; w: number; h: number };

export function Confetti({ x, y, w, h, count, unit = 1, seed = 1, avoid }: { x: number; y: number; w: number; h: number; count: number; unit?: number; seed?: number; avoid?: Rect }) {
  const rand = (i: number, k: number) => {
    const v = Math.sin((i + 1) * 12.9898 * seed + k * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return (
    <div className="pointer-events-none absolute" style={{ left: x, top: y, width: w, height: h, zIndex: 2 }} aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const px = rand(i, 1) * w;
        const py = rand(i, 2) * h;
        if (avoid && px > avoid.x && px < avoid.x + avoid.w && py > avoid.y && py < avoid.y + avoid.h) return null;
        const near = rand(i, 5) > 0.82;
        const size = (near ? 1.8 : 1) * unit * (0.7 + rand(i, 3) * 0.6);
        return (
          <span
            key={i}
            className="absolute"
            style={{
              left: px,
              top: py,
              width: 5 * size,
              height: 11 * size,
              borderRadius: 1.5 * size,
              background: CONFETTI_COLORS[Math.floor(rand(i, 4) * CONFETTI_COLORS.length)],
              opacity: near ? 0.55 : 0.4 + rand(i, 6) * 0.45,
              transform: `rotate(${Math.round(rand(i, 7) * 180 - 90)}deg) skewX(${Math.round(rand(i, 8) * 30 - 15)}deg)`,
              filter: near ? `blur(${2.5 * unit}px)` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

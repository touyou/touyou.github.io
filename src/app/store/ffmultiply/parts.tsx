"use client";

import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * FFMultiply のストア画像で使う部品。アプリの配色（黒地・FF グリーン）と、
 * ゲーム画面の 7 セグメント表示（DSEG7）、アイコンの論理回路の線をそのまま意匠にする。
 * DSEG7 は SIL OFL のフォントで、アプリのリポジトリから public/store-shots/ffmultiply/ へ写す（gitignore）。
 */

// アプリの Asset カタログ（FFColors）の値
export const FF = {
  black: "#0B0C0B",
  green: "#85BF5D",
  red: "#B33737",
  key: "#BBBBBB",
} as const;

export const SEG_FONT = "/store-shots/ffmultiply/DSEG7ClassicMini-Bold.ttf";

/** 見出しの書体。英語はアプリと同じ Futura、日本語はヒラギノ */
export const TITLE_FONT =
  "font-[Futura,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]";

/** ページの頭に置く。DSEG7 を読み込み、開発サーバーのインジケータを写さない */
export function StoreStyle() {
  return (
    <style>{`@font-face{font-family:DSEG7;src:url(${SEG_FONT}) format("truetype");font-display:block}nextjs-portal{display:none!important}body{margin:0;background:${FF.black}}`}</style>
  );
}

/** 7 セグメントの数字。消えているセグメント（"8"）を薄く下に敷いて、本物の表示器に見せる */
export function Seg({
  text,
  size,
  color = FF.green,
  glow = true,
  ghost = 0.09,
  className,
}: {
  text: string;
  size: number;
  color?: string;
  glow?: boolean;
  ghost?: number;
  className?: string;
}) {
  const off = text.replace(/[^ ]/g, "8");
  return (
    <span
      className={cn(
        "relative inline-block whitespace-pre leading-none",
        className,
      )}
      style={{ fontFamily: "DSEG7", fontSize: size }}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{ color: "#fff", opacity: ghost }}
      >
        {off}
      </span>
      <span
        className="relative"
        style={{
          color,
          textShadow: glow ? `0 0 ${size * 0.18}px ${color}88` : undefined,
        }}
      >
        {text}
      </span>
    </span>
  );
}

// 部品はどれも同じ影で浮かせる。黒地では黒い影が見えないので、下に緑の光をにじませる
export const LIFT =
  "shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.07)]";

/** ゲーム画面の問題表示をまねた液晶のかたまり。「b × 7 = 4d」のように左右を 7 セグで、記号は普通の書体で */
export function LcdChip({
  a,
  b,
  ans,
  size = 44,
  className,
}: {
  a: string;
  b: string;
  ans: string;
  size?: number;
  className?: string;
}) {
  const op = { fontSize: size * 0.8 };
  return (
    <div
      className={cn(
        "flex items-center gap-[0.35em] rounded-[0.45em] bg-[#121412] px-[0.6em] py-[0.5em] font-[-apple-system,sans-serif] text-white/70",
        LIFT,
        className,
      )}
      style={{ fontSize: size }}
    >
      <Seg text={a} size={size} color="#F2F2F2" glow={false} />
      <span style={op}>×</span>
      <Seg text={b} size={size} color="#F2F2F2" glow={false} />
      <span style={op}>=</span>
      <Seg text={ans} size={size} />
    </div>
  );
}

const KEYS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "b",
  "C",
  "d",
  "E",
  "F",
];

/** 0〜F の 16 キー。lit に入れたキーだけ緑に光らせる（答えを打っているところ） */
export function Keypad({
  width,
  lit = [],
  className,
}: {
  width: number;
  lit?: string[];
  className?: string;
}) {
  const gap = width * 0.035;
  const key = (width - gap * 5) / 4;
  return (
    <div
      className={cn(
        "grid grid-cols-4 rounded-[28px] bg-[#151715]",
        LIFT,
        className,
      )}
      style={{ width, padding: gap, gap }}
    >
      {KEYS.map((k) => {
        const on = lit.includes(k);
        return (
          <div
            key={k}
            className="flex items-center justify-center rounded-[18%]"
            style={{
              height: key,
              background: on
                ? "linear-gradient(180deg,#22301b,#18210f)"
                : "linear-gradient(180deg,#1f211f,#191a19)",
              boxShadow: on
                ? `inset 0 0 0 2px ${FF.green}aa, 0 0 ${key * 0.4}px ${FF.green}55`
                : "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <Seg
              text={k}
              size={key * 0.46}
              color={on ? FF.green : FF.key}
              glow={on}
              ghost={0.06}
            />
          </div>
        );
      })}
    </div>
  );
}

/** ぼかした緑の光。端末や部品の下に敷いて、黒地の上で浮いて見せる */
export function Glow({
  x,
  y,
  w,
  h,
  color = FF.green,
  opacity = 0.28,
  blur = 90,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color?: string;
  opacity?: number;
  blur?: number;
}) {
  return (
    <span
      aria-hidden
      className="absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
        background: color,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

/** アイコンと同じ論理回路の線。帯の端から端まで配線を通し、画像の境目をまたいでつなぐ */
export type Gate = {
  x: number;
  y: number;
  type: "and" | "or" | "not";
  rot?: number;
  size?: number;
  lit?: boolean;
};
export type Trace = { pts: [number, number][]; lit?: boolean };

function GateShape({ type, s }: { type: Gate["type"]; s: number }) {
  if (type === "and")
    return (
      <path
        d={`M${-s / 2},${-s / 2} H0 A${s / 2},${s / 2} 0 0 1 0,${s / 2} H${-s / 2} Z`}
      />
    );
  if (type === "or")
    return (
      <path
        d={`M${-s / 2},${-s / 2} Q${s * 0.25},${-s / 2} ${s / 2},0 Q${s * 0.25},${s / 2} ${-s / 2},${s / 2} Q${-s * 0.25},0 ${-s / 2},${-s / 2} Z`}
      />
    );
  const r = s * 0.11;
  return (
    <>
      <path
        d={`M${-s / 2},${-s / 2} L${s / 2 - r * 2},0 L${-s / 2},${s / 2} Z`}
      />
      <circle cx={s / 2 - r} cy={0} r={r} />
    </>
  );
}

export function Circuit({
  width,
  height,
  traces,
  gates,
  stroke = 3,
  className,
}: {
  width: number;
  height: number;
  traces: Trace[];
  gates: Gate[];
  stroke?: number;
  className?: string;
}) {
  const dim = "#2B2E2B";
  const lit = `${FF.green}99`;
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute left-0 top-0", className)}
      width={width}
      height={height}
      fill="none"
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {traces.map((t, i) => (
        <polyline
          key={i}
          points={t.pts.map((p) => p.join(",")).join(" ")}
          stroke={t.lit ? lit : dim}
          strokeWidth={stroke}
        />
      ))}
      {gates.map((g, i) => (
        <g
          key={i}
          transform={`translate(${g.x},${g.y}) rotate(${g.rot ?? 0})`}
          stroke={g.lit ? lit : dim}
          strokeWidth={stroke}
          fill={FF.black}
        >
          <GateShape type={g.type} s={g.size ?? 44} />
        </g>
      ))}
    </svg>
  );
}

/** 帯の中のある位置に置く（Intento の At と同じ。zoom を持たない軽い版） */
export function Place({
  x,
  y,
  w,
  rotate = 0,
  z,
  children,
  className,
  style,
}: {
  x: number;
  y: number;
  w?: number;
  rotate?: number;
  z?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn("absolute", className)}
      style={{
        left: x,
        top: y,
        width: w,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        zIndex: z,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * iPhone の枠。Intento の Device は黒っぽい枠なので、黒地では輪郭が消える。
 * 枠をチタンのような明るめの灰色にして、縁に細い光を入れる
 */
export function Phone({ src, width }: { src: string; width: number }) {
  const pad = Math.max(4, width * 0.024);
  const r = width * 0.12;
  return (
    <div
      className="relative"
      style={{
        width,
        padding: pad,
        borderRadius: r + pad,
        background:
          "linear-gradient(145deg,#5a5d5a,#2a2c2a 40%,#1a1b1a 70%,#454845)",
        boxShadow:
          "0 50px 90px -30px rgba(0,0,0,0.95), inset 0 0 0 1px rgba(255,255,255,0.18)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="block w-full"
        style={{ borderRadius: r }}
      />
    </div>
  );
}

/** 連続正解のボーナスの階段。1 問の点が 5 問ごとに +5 され、最大 25 点（GameViewModel の定数どおり） */
export function StreakStairs({
  width,
  streakLabel,
  className,
}: {
  width: number;
  streakLabel: string;
  className?: string;
}) {
  const steps = [
    { pts: "+10", streak: "0" },
    { pts: "+15", streak: "5" },
    { pts: "+20", streak: "10" },
    { pts: "+25", streak: "15" },
  ];
  const gap = width * 0.04;
  const col = (width - gap * 3) / 4;
  const unit = col * 0.62;
  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ width, gap: col * 0.16 }}
    >
      <div className="flex items-end" style={{ gap }}>
        {steps.map((s, i) => (
          <div
            key={s.pts}
            className="flex flex-col items-center"
            style={{ width: col, gap: col * 0.12 }}
          >
            <Seg
              text={s.pts.replace("+", "")}
              size={col * 0.36}
              glow={i === 3}
              color={i === 3 ? FF.green : "#E6E6E6"}
            />
            <div
              className="w-full rounded-t-[10px]"
              style={{
                height: unit * (i + 1),
                background:
                  i === 3
                    ? `linear-gradient(180deg,${FF.green},#4d7a33)`
                    : `linear-gradient(180deg,rgba(133,191,93,${0.25 + i * 0.12}),rgba(133,191,93,0.06))`,
                boxShadow:
                  i === 3 ? `0 0 ${col * 0.5}px ${FF.green}66` : undefined,
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="flex border-t border-white/20"
        style={{ gap, paddingTop: col * 0.1 }}
      >
        {steps.map((s) => (
          <span
            key={s.streak}
            className="text-center font-[-apple-system,sans-serif] font-semibold text-white/55"
            style={{ width: col, fontSize: col * 0.2 }}
          >
            {s.streak}
          </span>
        ))}
      </div>
      <span
        className="font-[-apple-system,'Hiragino_Sans',sans-serif] font-semibold text-white/45"
        style={{ fontSize: col * 0.19 }}
      >
        {streakLabel}
      </span>
    </div>
  );
}

/** 自己ベストの液晶。ローカルスコアの 1 位（スクショの 230 点）を大きく出す */
export function BestChip({
  label,
  score,
  size,
  className,
}: {
  label: string;
  score: string;
  size: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-start rounded-[0.4em] bg-[#121412] px-[0.5em] py-[0.4em]",
        LIFT,
        className,
      )}
      style={{ fontSize: size, gap: size * 0.2 }}
    >
      <span
        className="font-[-apple-system,'Hiragino_Sans',sans-serif] font-bold tracking-[0.04em] text-white/55"
        style={{ fontSize: size * 0.28 }}
      >
        {label}
      </span>
      <Seg text={score} size={size} />
    </div>
  );
}

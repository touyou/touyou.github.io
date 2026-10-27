"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Google Play 用の画像で、エミュレータのスクショを入れる Android の端末枠。
 * Apple の端末枠と見分けが付くよう、縦向きのときだけ画面の上の中央にパンチホールのカメラを描く。
 * 横向きはアプリの画面の左端にパッドなどが来るので、穴で隠さないよう描かない
 */
export function AndroidPhone({
  src,
  width,
  landscape = false,
  frame = "#1b1c1e",
  shadow = "0 0 0 1.5px rgba(255,255,255,0.14), 0 40px 70px -20px rgba(0,0,0,0.9), 0 12px 24px -10px rgba(0,0,0,0.7)",
  style,
  children,
}: {
  src: string;
  width: number;
  landscape?: boolean;
  frame?: string;
  shadow?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  // 1080×2400 のスクショを想定し、角丸と枠の太さは短い辺に比例させる
  const short = landscape ? width / (2400 / 1080) : width;
  const pad = Math.max(3, short * 0.026);
  const radius = short * 0.1;
  const hole = short * 0.034;
  return (
    <div className="relative" style={{ width, padding: pad, borderRadius: radius + pad, background: frame, boxShadow: shadow, ...style }}>
      {/* children は画面の上に重ねる。位置は画面に対する割合で指定できる */}
      <div className="relative overflow-hidden" style={{ borderRadius: radius }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="block w-full" />
        {children}
      </div>
      {!landscape && (
        <span
          aria-hidden
          className="absolute rounded-full bg-black"
          style={{ width: hole, height: hole, left: `calc(50% - ${hole / 2}px)`, top: pad + short * 0.022, boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
        />
      )}
    </div>
  );
}

/** Play のフィーチャーグラフィック（1024×500）。2 倍で撮って縮める */
export const FEATURE = { w: 1024, h: 500 } as const;

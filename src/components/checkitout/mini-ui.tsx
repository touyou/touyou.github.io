import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { APP_BACKGROUND, PAD_COLORS, PAD_FILL, PAD_FILL_PRESSED, type PadColor } from "./pads";

/**
 * 紹介ページの小さな図に使う、アプリの画面の部品を描き直したもの。
 * 形と色はアプリ（CheckItOut/Checkitout/Views）に合わせ、文字はシステムフォントで描く（アプリのロゴ用フォントは使わない）。
 */

const ROW_COLORS: PadColor[] = ["red", "yellow", "green", "blue"];

/** パッド 1 個。枠の色は行ごと、押している間は中が明るくなる */
export function MiniPad({
  color,
  pressed = false,
  label,
  className,
  children,
}: {
  color: PadColor;
  pressed?: boolean;
  label?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      className={cn("relative flex aspect-square items-end overflow-hidden rounded-[18%] border-[3px] p-1", className)}
      style={{ borderColor: PAD_COLORS[color], background: pressed ? PAD_FILL_PRESSED : PAD_FILL }}
    >
      {label && <span className="truncate text-[9px] font-semibold leading-none text-white">{label}</span>}
      {children}
    </span>
  );
}

/** 4×4 のパッド。pressed に入れた番号のパッドを押した状態で描く */
export function MiniPadGrid({
  pressed = [],
  labels = {},
  highlight,
  className,
}: {
  pressed?: number[];
  labels?: Record<number, string>;
  highlight?: number;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-4 gap-1", className)}>
      {Array.from({ length: 16 }, (_, i) => (
        <MiniPad
          key={i}
          color={ROW_COLORS[Math.floor(i / 4)]}
          pressed={pressed.includes(i)}
          label={labels[i]}
          className={cn("border-2", highlight === i && "ring-2 ring-white ring-offset-1 ring-offset-black")}
        />
      ))}
    </div>
  );
}

/** アプリの暗い地の上に載せる枠 */
export function DarkScreen({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden rounded-2xl p-3 text-white", className)} style={{ background: APP_BACKGROUND }}>
      {children}
    </div>
  );
}

/** 音の一覧の 1 行。割り当て先がなければ NONE と出す（アプリと同じ表記） */
export function SoundRow({ name, pad, selected = false }: { name: string; pad: number | null; selected?: boolean }) {
  return (
    <div className={cn("flex shrink-0 items-center justify-between gap-2 rounded-md px-2 py-1 text-[11px]", selected ? "bg-[#0A84FF]" : "bg-white/10")}>
      <span className="truncate font-semibold">{name}</span>
      <span className="shrink-0 text-[10px] text-white/70">{pad === null ? "NONE" : `PAD ${pad + 1}`}</span>
    </div>
  );
}

/** 録音パネル。波形と、REC・STOP・PLAY・SAVE のボタン、名前の欄 */
export function MiniRecordPanel() {
  // 波形は固定の見本。左右対称に、中心から上下へ伸ばす
  const bars = [2, 4, 7, 12, 18, 14, 9, 16, 22, 26, 20, 12, 8, 15, 24, 19, 10, 6, 4, 3, 5, 9, 6, 3, 2];
  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl bg-white/90 p-3 text-[#1d1d1f] shadow-sm ring-1 ring-black/5">
      <span className="text-[12px] font-bold">録音</span>
      <div className="flex h-14 items-center gap-[3px] overflow-hidden rounded-lg bg-[#636668] px-2">
        {bars.map((h, i) => (
          <span key={i} className="w-[3px] shrink-0 rounded-full bg-black" style={{ height: `${h * 2}px` }} />
        ))}
      </div>
      <span className="rounded-md bg-white px-2 py-1 text-[11px] ring-1 ring-black/10">手拍子</span>
      <div className="flex justify-between gap-1 text-[9px] font-semibold">
        {["REC", "STOP", "PLAY", "SAVE"].map((label) => (
          <span key={label} className={cn("flex-1 rounded-full bg-neutral-200 py-1 text-center", label === "REC" && "bg-[#E63C35] text-white")}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 「再生／編集」の切り替えと「録音」ボタン */
export function MiniModeControls({ mode }: { mode: "play" | "edit" }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-semibold">
      <div className="flex min-w-0 flex-1 rounded-lg bg-white/15 p-0.5">
        {(["play", "edit"] as const).map((m) => (
          <span key={m} className={cn("flex-1 rounded-md py-1 text-center", mode === m ? "bg-white text-[#1d1d1f]" : "text-white/80")}>
            {m === "play" ? "再生" : "編集"}
          </span>
        ))}
      </div>
      <span className="shrink-0 rounded-full bg-[#E63C35]/90 px-2.5 py-1 text-white">録音</span>
    </div>
  );
}

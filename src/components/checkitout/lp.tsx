import type { ReactNode } from "react";

import { Phrases } from "@/components/app-lp";
import { cn } from "@/lib/utils";

import { APP_BACKGROUND, PAD_COLORS, type PadColor } from "./pads";

/**
 * チェケラの紹介ページ・文書ページの部品。
 * アプリの見た目（ほぼ黒の地、光る 4 色のパッド、白い文字）に合わせるため、app-lp の白い部品は使わずにここで作る。
 * 地の質感は、アプリの background 画像の細かいざらつきを SVG のノイズで近づけたもの（画像は使わない）。
 */

export const RAISED = "#151515";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** パッドの色で光らせる影。strength を上げると押したときのように強く光る */
export function glow(color: PadColor, strength: 1 | 2 = 1): string {
  const c = PAD_COLORS[color];
  return strength === 1 ? `0 0 10px ${c}55, inset 0 0 6px ${c}22` : `0 0 18px ${c}AA, 0 0 4px ${c}, inset 0 0 12px ${c}55`;
}

/** ページ全体。システムフォントにし、日本語を文節の切れ目で折り返す */
export function CkPage({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-white antialiased [word-break:auto-phrase]"
      style={{ backgroundColor: APP_BACKGROUND, backgroundImage: GRAIN }}
    >
      {children}
    </div>
  );
}

/** 上部に貼り付く半透明のナビゲーション */
export function CkNav({ icon, name, home, children }: { icon: ReactNode; name: string; home: string; children: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-6">
        <a href={home} className="flex items-center gap-2 text-[15px] font-semibold">
          {icon}
          {name}
        </a>
        <nav className="flex items-center gap-5 text-[13px] text-white/60 [&_a:hover]:text-white">{children}</nav>
      </div>
    </header>
  );
}

/** 帯。地の黒と、一段明るい黒を交互に置く */
export function CkBand({ tone = "base", children, className }: { tone?: "base" | "raised"; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border-t border-white/[0.06]", tone === "raised" && "bg-white/[0.03]")}>
      <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32", className)}>{children}</div>
    </section>
  );
}

/** 中央寄せの見出し。title は文節ごとに渡す。上に 4 色の短い線を置き、パッドの並びを思わせる */
export function CkHeading({ title, children }: { title: string[]; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <ColorBars />
      <h2 className="text-[clamp(28px,5vw,48px)] font-bold leading-[1.2] tracking-[-0.015em] [font-feature-settings:'palt']">
        <Phrases phrases={title} />
      </h2>
      {children && <p className="text-[clamp(16px,2vw,19px)] leading-[1.8] text-white/65">{children}</p>}
    </div>
  );
}

/** 赤・黄・緑・青の短い線 */
export function ColorBars({ className }: { className?: string }) {
  return (
    <span className={cn("flex gap-1.5", className)} aria-hidden>
      {(Object.keys(PAD_COLORS) as PadColor[]).map((color) => (
        <span key={color} className="h-1 w-5 rounded-full" style={{ background: PAD_COLORS[color], boxShadow: `0 0 8px ${PAD_COLORS[color]}` }} />
      ))}
    </span>
  );
}

/**
 * タイル。上の縁をパッドの色で光らせる。
 * 図（children）は高さを固定して下端に置き、本文の長さが違っても同じ行のタイルで図の位置がそろうようにする。
 */
export function CkTile({
  title,
  body,
  color,
  visualHeight = "h-40",
  className,
  children,
}: {
  /** 折り返す位置を決めたいときは文節ごとの配列で渡す */
  title: string | string[];
  body: ReactNode;
  color: PadColor;
  visualHeight?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("flex w-full flex-col gap-6 overflow-hidden rounded-[24px] border-t-[3px] p-7 ring-1 ring-white/[0.08]", className)}
      style={{ background: RAISED, borderTopColor: PAD_COLORS[color], boxShadow: `0 -6px 18px -10px ${PAD_COLORS[color]}` }}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold tracking-tight">{Array.isArray(title) ? <Phrases phrases={title} /> : title}</h3>
        <p className="text-[15px] leading-[1.8] text-white/60">{body}</p>
      </div>
      {children && <div className={cn("mt-auto flex w-full items-center justify-center", visualHeight)}>{children}</div>}
    </div>
  );
}

/** 光る枠のボタン型リンク。アプリの旧版のボタン（黒い地に色の文字）に合わせる */
export function CkPillLink({
  href,
  color = "blue",
  size = "lg",
  children,
}: {
  href: string;
  color?: PadColor;
  size?: "sm" | "lg";
  children: ReactNode;
}) {
  const c = PAD_COLORS[color];
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-full border-2 font-bold hover:brightness-125 motion-safe:transition",
        size === "lg" ? "min-h-12 px-7 py-2.5 text-[17px]" : "px-3 py-0.5 text-[12px]",
      )}
      style={{ borderColor: c, color: c, background: RAISED, boxShadow: glow(color) }}
    >
      {children}
    </a>
  );
}

/** サポート・プライバシーポリシーの枠。装飾は見出しと本文の書体・色までに抑え、「見出し → 本文」が機械的に読める構造に保つ */
export function CkDocsShell({ nav, footer, children }: { nav: ReactNode; footer: ReactNode; children: ReactNode }) {
  return (
    <CkPage>
      {nav}
      <main className="mx-auto w-full max-w-3xl px-6 py-16 text-[17px] leading-[1.9] text-white/75 [&_a]:text-[#4FC3F7] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h1]:mb-3 [&_h1]:text-[clamp(26px,6vw,44px)] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-white [&_h2]:mb-3 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-white [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-white [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </main>
      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-x-5 gap-y-2 px-6 py-8 text-xs text-white/55 [&_a:hover]:text-white">{footer}</div>
      </footer>
    </CkPage>
  );
}

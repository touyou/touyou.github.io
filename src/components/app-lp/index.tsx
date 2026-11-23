import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 個人開発アプリ（Toreta / Intento）の紹介ページで共通に使う部品。
 * どちらもネイティブの見た目を大事にしているアプリなので、Apple の製品ページに近い書体・余白・色にそろえる。
 */

export { SafeAreaColor } from "./SafeAreaColor";

/** 英語のページでは、共通の部品の決まり文句も英語にする */
export type Lang = "ja" | "en";

export const APP_BLUE = "#0071E3";
export const PAGE_GRAY = "#F5F5F7";

/** ページ全体。システムフォントにし、日本語を文節の切れ目で折り返す（auto-phrase 非対応のブラウザでは通常の折り返し） */
export function AppPage({ children, lang = "ja" }: { children: ReactNode; lang?: Lang }) {
  return (
    <div lang={lang} className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [word-break:auto-phrase]">
      {/* ルートの <html lang> は ja 固定なので、英語のページでは読み込んだ時点で書き換える */}
      {lang !== "ja" && <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(lang)}` }} />}
      <SkipLink lang={lang} />
      {children}
    </div>
  );
}

/** 上部に貼り付く半透明のナビゲーション */
export function AppNav({ icon, name, home, children }: { icon: ReactNode; name: string; home: string; children: ReactNode }) {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-6">
        <a href={home} className="flex items-center gap-2 text-[15px] font-semibold">
          {icon}
          {name}
        </a>
        <nav className="flex items-center gap-5 text-[13px] text-neutral-600">{children}</nav>
      </div>
    </header>
  );
}

/** 白とグレーを交互に置く帯 */
export function Band({ tone = "white", children, className }: { tone?: "white" | "gray"; children: ReactNode; className?: string }) {
  return (
    <section className={cn(tone === "gray" && "bg-[#F5F5F7]")}>
      <div className={cn("mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32", className)}>{children}</div>
    </section>
  );
}

/** 文節ごとに inline-block にして、まとまりの途中で折り返さないようにする */
export function Phrases({ phrases }: { phrases: string[] }) {
  return (
    <>
      {phrases.map((phrase) => (
        <span key={phrase} className="inline-block">
          {phrase}
        </span>
      ))}
    </>
  );
}

/** 中央寄せの見出し。title は文節ごとに渡す */
export function Heading({ title, children }: { title: string[]; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <h2 className="text-[clamp(28px,5vw,48px)] font-bold leading-[1.2] tracking-[-0.015em] [font-feature-settings:'palt']">
        <Phrases phrases={title} />
      </h2>
      {children && <p className="text-[clamp(16px,2vw,19px)] leading-[1.8] text-neutral-600">{children}</p>}
    </div>
  );
}

/** 角の大きいタイル。中身の見本（children）は下端にそろえ、本文の長さが違っても並びの中で位置がずれないようにする */
export function Tile({
  title,
  body,
  className,
  children,
  dark = false,
}: {
  title: string;
  body: ReactNode;
  className?: string;
  children?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-6 overflow-hidden rounded-[28px] p-7", dark ? "bg-[#1d1d1f] text-white" : "bg-[#F5F5F7]", className)}>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className={cn("text-[15px] leading-[1.8]", dark ? "text-neutral-400" : "text-neutral-600")}>{body}</p>
      </div>
      {children && <div className="mt-auto flex w-full justify-center">{children}</div>}
    </div>
  );
}

export function TapHint({ dark = false }: { dark?: boolean }) {
  return <span className={cn("text-xs", dark ? "text-neutral-500" : "text-neutral-400")}>押して試せます</span>;
}

/** 青い丸ボタン型のリンク */
export function PillLink({ href, children, size = "lg" }: { href: string; children: ReactNode; size?: "sm" | "lg" }) {
  return (
    <a
      href={href}
      className={cn(
        "rounded-full bg-[#0071E3] font-medium text-white transition hover:bg-[#0077ED]",
        size === "lg" ? "px-7 py-3 text-[17px]" : "px-3 py-1 text-[12px]",
      )}
    >
      {children}
    </a>
  );
}

/**
 * 実機の画面写真を入れる端末の枠。太さと角丸を枠の幅に対する割合（cqw）で決め、どの大きさでも画面の角丸が枠と同心になるようにする。
 * 画像は枠いっぱいに置く（画面の縦横比のまま）。
 */
const DEVICE_SHAPE = {
  iphone: { bezel: 2.6, screenRadius: 12.5 },
  // 横向きの iPhone。枠の幅が縦向きの約 2.17 倍になるので、同じ見た目になるよう割合を縮める
  ipad: { bezel: 3.2, screenRadius: 2.4 },
} as const;

export function DeviceFrame({ device, dark = false, className, children }: { device: keyof typeof DEVICE_SHAPE; dark?: boolean; className?: string; children: ReactNode }) {
  const { bezel, screenRadius } = DEVICE_SHAPE[device];
  return (
    <div className={cn("[container-type:inline-size]", className)}>
      <div
        className={cn(
          "bg-[#1d1d1f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45),inset_0_0_0_1px_rgba(255,255,255,0.08)]",
          dark && "ring-1 ring-white/15",
        )}
        style={{ padding: `${bezel}cqw`, borderRadius: `${bezel + screenRadius}cqw` }}
      >
        <div className="overflow-hidden bg-black [&_img]:block [&_img]:w-full" style={{ borderRadius: `${screenRadius}cqw` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export type Screen = { src: string; alt: string; caption: string; landscape?: boolean };

/**
 * 実機の画面を端末の枠に入れて横に並べる帯。幅に収まらないぶんは横にスクロールし、1 枚ずつ止まる。
 * 帯そのものは画面の端まで使いたいので、Band の中ではなく section の間に置く。
 */
export function ScreenStrip({ screens, label, dark = false }: { screens: Screen[]; label: string; dark?: boolean }) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className="snap-x snap-mandatory overflow-x-auto outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0071E3] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="mx-auto flex w-max items-end gap-5 px-6 pb-4 pt-2 sm:gap-7">
        {screens.map((screen) => (
          <li key={screen.src} className={cn("flex shrink-0 snap-center flex-col items-center gap-4", screen.landscape ? "w-[420px] sm:w-[460px]" : "w-[190px] sm:w-[212px]")}>
            {/* 本物の端末枠（Apple Design Resources）を焼き込んだ画像。画面の角は枠の穴で切ってあるので、角丸は実機と同じ曲線になる */}
            <Image src={screen.src} alt={screen.alt} width={screen.landscape ? 1400 : 600} height={screen.landscape ? 686 : 1224} className="h-auto w-full" />
            <span className={cn("text-[13px]", dark ? "text-white/55" : "text-neutral-500")}>{screen.caption}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** キーボードで来た人が、貼り付いたナビを飛ばして本文へ移れるリンク。フォーカスが来たときだけ見える。行き先は各ページの <main id="main" tabIndex={-1} className="outline-none"> */
export function SkipLink({ lang = "ja" }: { lang?: Lang }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-2 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#1d1d1f] focus:shadow-lg"
    >
      {lang === "en" ? "Skip to content" : "本文へ移動"}
    </a>
  );
}

export type FaqItem = { q: string; a: ReactNode };

/**
 * 入れる前に気になりそうなことだけを数問。残りはサポートのページに任せ、同じ答えを 2 か所で育てない。
 * 見出しは各ページの書体で付けるので、ここは問いと答えの並びだけ。
 */
export function Faq({
  items,
  moreHref,
  dark = false,
  accentClassName,
  lang = "ja",
}: {
  items: FaqItem[];
  moreHref: string;
  dark?: boolean;
  accentClassName?: string;
  lang?: Lang;
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div className={cn("border-t", dark ? "border-white/10" : "border-black/10")}>
        {items.map((item) => (
          <details key={item.q} className={cn("group border-b", dark ? "border-white/10" : "border-black/10")}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span aria-hidden="true" className={cn("shrink-0 text-xl font-light transition-transform group-open:rotate-45", dark ? "text-white/50" : "text-neutral-400")}>
                +
              </span>
            </summary>
            <div className={cn("pb-6 text-[15px] leading-[1.9]", dark ? "text-white/65" : "text-neutral-600")}>{item.a}</div>
          </details>
        ))}
      </div>
      <a href={moreHref} className={cn("self-center text-[15px] hover:underline", accentClassName ?? (dark ? "text-white" : "text-[#0066CC]"))}>
        {lang === "en" ? "More questions? Visit Support ›" : "そのほかの質問はサポートへ ›"}
      </a>
    </div>
  );
}

/** つくった人の小さな章。個人で作っていることと、声の届け先を置く */
export function MakerNote({
  children,
  contactHref,
  dark = false,
  accentClassName,
  lang = "ja",
}: {
  children: ReactNode;
  contactHref: string;
  dark?: boolean;
  accentClassName?: string;
  lang?: Lang;
}) {
  const link = cn("hover:underline", accentClassName ?? (dark ? "text-white" : "text-[#0066CC]"));
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
      <Image src="/avatar.jpg" alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full" />
      <div className="flex flex-col gap-1">
        <p className={cn("text-[13px] tracking-[0.1em]", dark ? "text-white/50" : "text-neutral-500")}>{lang === "en" ? "Made by" : "つくった人"}</p>
        <p className="text-lg font-semibold">touyou</p>
      </div>
      <p className={cn("text-[15px] leading-[1.9]", dark ? "text-white/70" : "text-neutral-600")}>{children}</p>
      <div className="flex gap-6 text-[15px]">
        <a href={contactHref} className={link}>
          {lang === "en" ? "Send feedback ›" : "感想・不具合を送る ›"}
        </a>
        <Link href="/" className={link}>
          touyou.dev ›
        </Link>
      </div>
    </div>
  );
}

/**
 * サポート・プライバシーポリシーのような文書ページの枠。
 * App Store の審査担当が確認する経路なので、装飾は見出しと本文の書体・色までに抑え、「見出し → 本文」が機械的に読める構造に保つ。
 */
export function DocsShell({ nav, footer, children }: { nav: ReactNode; footer: ReactNode; children: ReactNode }) {
  return (
    <AppPage>
      {nav}
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-3xl px-6 py-16 text-[17px] leading-[1.9] text-neutral-700 [&_a]:text-[#0066CC] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h1]:mb-3 [&_h1]:text-[clamp(32px,6vw,44px)] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-[#1d1d1f] [&_h2]:mb-3 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[#1d1d1f] [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1d1d1f] [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-[#1d1d1f] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 outline-none">
        {children}
      </main>
      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-x-5 gap-y-2 px-6 py-8 text-xs text-neutral-500 [&_a:hover]:text-neutral-900">
          {footer}
        </div>
      </footer>
    </AppPage>
  );
}

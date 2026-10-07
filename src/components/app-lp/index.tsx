import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * 個人開発アプリ（Toreta / Intento）の紹介ページで共通に使う部品。
 * どちらもネイティブの見た目を大事にしているアプリなので、Apple の製品ページに近い書体・余白・色にそろえる。
 */

export const APP_BLUE = "#0071E3";
export const PAGE_GRAY = "#F5F5F7";

/** ページ全体。システムフォントにし、日本語を文節の切れ目で折り返す（auto-phrase 非対応のブラウザでは通常の折り返し） */
export function AppPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [word-break:auto-phrase]">
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
 * サポート・プライバシーポリシーのような文書ページの枠。
 * App Store の審査担当が確認する経路なので、装飾は見出しと本文の書体・色までに抑え、「見出し → 本文」が機械的に読める構造に保つ。
 */
export function DocsShell({ nav, footer, children }: { nav: ReactNode; footer: ReactNode; children: ReactNode }) {
  return (
    <AppPage>
      {nav}
      <main className="mx-auto w-full max-w-3xl px-6 py-16 text-[17px] leading-[1.9] text-neutral-700 [&_a]:text-[#0066CC] [&_a]:underline-offset-4 hover:[&_a]:underline [&_h1]:mb-3 [&_h1]:text-[clamp(32px,6vw,44px)] [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:tracking-tight [&_h1]:text-[#1d1d1f] [&_h2]:mb-3 [&_h2]:mt-14 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-[#1d1d1f] [&_h3]:mb-2 [&_h3]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-[#1d1d1f] [&_li]:mb-1.5 [&_p]:mb-4 [&_strong]:text-[#1d1d1f] [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
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

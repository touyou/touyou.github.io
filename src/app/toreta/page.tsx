import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { dummyCards } from "@/components/toreta/dummy-cards";
import { PhoneMockup } from "@/components/toreta/PhoneMockup";
import { ToretaIcon } from "@/components/toreta/ToretaIcon";
import { TradingCard } from "@/components/toreta/TradingCard";

/**
 * Toreta（iOS アプリ）の紹介ページ。
 * 権利の都合で、実在するカードゲームの名前・カード画像・ロゴは載せない。画面の例は架空カードで描く。
 * 機能の説明はアプリの実装（Toreta リポジトリ）に合わせる。機能を変えたらここも直す。
 */
export const metadata: Metadata = {
  title: "Toreta — 公式カードリストを、そのままコレクション帳に",
  description:
    "トレーディングカードゲームの公式カードリストの URL を貼るだけで、持っているカードとほしいカードを記録できる iPhone アプリ。",
  openGraph: {
    title: "Toreta",
    description: "公式カードリストを、そのままコレクション帳に。トレカの所持枚数を記録する iPhone アプリ。",
    url: "https://touyou.dev/toreta",
  },
};

const ACCENT = "#2F6BF2";

const steps = [
  {
    title: "URL を貼る",
    body: "カードゲームの公式サイトでカードリストのページを開き、URL をコピーして Toreta に貼り付けます。",
    visual: (
      <div className="flex flex-col gap-2 rounded-xl bg-white p-3 text-xs shadow-sm ring-1 ring-black/5">
        <span className="text-neutral-500">公式カードリストの URL</span>
        <span className="truncate rounded-lg bg-neutral-100 px-2 py-1.5 font-mono text-[11px]">https://example.com/cardlist/</span>
        <span className="self-end rounded-full px-3 py-1 font-semibold text-white" style={{ background: ACCENT }}>
          読み込む
        </span>
      </div>
    ),
  },
  {
    title: "自動で読み取る",
    body: "ページのつくりを調べて、カードの番号・名前・画像・レアリティがどこにあるかを見つけます。対応する iPhone では端末内の言語モデルも使って判断します。",
    visual: (
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 rounded-xl bg-white p-3 text-xs shadow-sm ring-1 ring-black/5">
        {[
          ["番号", "SC1-001"],
          ["名前", dummyCards[0].name],
          ["レアリティ", "N"],
          ["画像", "card/SC1-001.png"],
        ].map(([label, value]) => (
          <div key={label} className="contents">
            <span className="text-neutral-500">{label}</span>
            <span className="truncate font-medium">{value}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "確かめて追加",
    body: "最初の数枚を見て、正しく読み取れているかを確かめてから追加します。違っていたら、使う項目を自分で選び直せます。",
    visual: (
      <div className="flex gap-2 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
        {dummyCards.slice(0, 3).map((card) => (
          <TradingCard key={card.number} card={{ ...card, owned: 1 }} className="w-1/3" />
        ))}
      </div>
    ),
  },
];

const features: { icon: ReactNode; title: string; body: string }[] = [
  {
    icon: <IconPlus />,
    title: "タップで 1 枚追加",
    body: "クイック追加モードなら、カードをタップするたびに 1 枚ずつ増えます。長押しで細かく調整できます。",
  },
  {
    icon: <IconStar />,
    title: "ほしいカードに「ねらい」",
    body: "足りないカードに印を付けておけば、ねらいのカードだけを一覧にできます。足りない分をまとめて追加することも。",
  },
  {
    icon: <IconCamera />,
    title: "カメラで番号を読み取る",
    body: "手元のカードにカメラを向けると、カード番号を読み取って記録します。映像は保存せず、端末の外へも送りません。",
  },
  {
    icon: <IconStack />,
    title: "デッキを組む",
    body: "持っているカードからデッキを作り、必要な枚数と足りない枚数を確かめられます。",
  },
  {
    icon: <IconChart />,
    title: "そろい具合がひと目で",
    body: "弾ごと・レアリティごとに、何種中何種そろっているかを表示します。",
  },
  {
    icon: <IconLeaf />,
    title: "公式サイトにやさしく",
    body: "読み込みは少しずつ行い、画像は端末に一時保存します。同じシリーズの更新は 10 分に 1 回までです。",
  },
];

const plusFeatures = [
  ["好きな色を使う", "用意された色のほかに、自由な色をアクセントにできます。"],
  ["カードの絵から色を作る", "シリーズのカードの絵から、そのカードゲームに合う色を提案します。"],
  ["デッキをいくつでも", "無料では 3 個まで。Plus ならデッキを好きなだけ作れます。"],
  ["所持リストの書き出し", "所持枚数とねらいを CSV で書き出して、表計算アプリなどで使えます。"],
];

export default function ToretaPage() {
  return (
    <div className="min-h-screen bg-[#F7F8FC] text-neutral-900">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/toreta" className="flex items-center gap-2 font-bold">
          <ToretaIcon className="h-8 w-8 shadow-sm" />
          Toreta
        </Link>
        <nav className="flex gap-5 text-sm text-neutral-600">
          <Link href="/toreta/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/toreta/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </nav>
      </header>

      <main className="flex flex-col gap-28 pb-24">
        {/* ヒーロー */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-[520px] max-w-4xl rounded-full opacity-30 blur-3xl"
            style={{ background: `radial-gradient(closest-side, ${ACCENT}, transparent)` }}
          />
          <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 px-6 pt-10 md:grid-cols-[1fr_auto] md:pt-16">
            <div className="flex flex-col items-start gap-6">
              <ToretaIcon className="h-20 w-20" />
              {/* 狭い画面で語の途中で折り返さないよう、まとまりごとに inline-block にする */}
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
                <span className="inline-block">公式カードリストを、</span>
                <br />
                <span className="inline-block">そのまま</span>
                <span className="inline-block">
                  <span style={{ color: ACCENT }}>コレクション帳</span>に。
                </span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-neutral-600">
                Toreta は、トレーディングカードゲームの公式サイトのカードリストを取り込んで、持っているカードとほしいカードを記録する iPhone アプリです。
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white">
                  App Store で近日公開
                </span>
                <span className="text-sm text-neutral-500">無料 ・ iPhone（iOS 27 以降）</span>
              </div>
            </div>
            <PhoneMockup className="mx-auto" />
          </div>
        </section>

        {/* 使い方 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <SectionHeading eyebrow="How it works" title="URL を貼るだけで、カードの一覧ができる" />
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-4 rounded-3xl bg-[#EEF2FC] p-6">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: ACCENT }}
                >
                  {i + 1}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{step.body}</p>
                </div>
                <div className="mt-auto">{step.visual}</div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-neutral-500">
            特定の作品専用のアプリではありません。サイトのつくりによっては取り込めないこともあります。
          </p>
        </section>

        {/* 機能 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <SectionHeading eyebrow="Features" title="集める・数える・組む" />
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <span
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: ACCENT }}
                >
                  {feature.icon}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-neutral-600">{feature.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* プライバシー */}
        <section className="mx-auto w-full max-w-5xl px-6">
          <div className="flex flex-col gap-8 rounded-[32px] bg-neutral-900 p-8 text-white sm:p-12">
            <SectionHeading eyebrow="Privacy" title="記録は、あなたの iPhone の中だけに" dark />
            <ul className="grid gap-6 text-sm leading-relaxed text-neutral-300 sm:grid-cols-3">
              <li className="flex flex-col gap-1">
                <strong className="text-base text-white">アカウントなし</strong>
                ログインもサーバーもありません。記録は端末に保存され、開発者に送られることはありません。
              </li>
              <li className="flex flex-col gap-1">
                <strong className="text-base text-white">トラッキングなし</strong>
                広告やアクセス解析の SDK は入っていません。
              </li>
              <li className="flex flex-col gap-1">
                <strong className="text-base text-white">公式サイトと直接</strong>
                カードの情報と画像は、あなたの端末が公式サイトから直接読み込みます。開発者のサーバーは経由しません。
              </li>
            </ul>
            <Link href="/toreta/privacy" className="text-sm font-semibold text-white underline underline-offset-4">
              プライバシーポリシーを読む
            </Link>
          </div>
        </section>

        {/* Toreta Plus */}
        <section className="mx-auto grid w-full max-w-5xl items-start gap-10 px-6 md:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <SectionHeading eyebrow="Toreta Plus" title="基本はずっと無料。あると便利を、買い切りで" />
            <p className="leading-relaxed text-neutral-600">
              カードの記録・取り込み・カメラでの読み取りは無料で使えます。Toreta Plus は一度の購入で、同じ Apple アカウントのデバイスすべてで使えます。定期的な支払いはありません。
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {plusFeatures.map(([title, body]) => (
              <li key={title} className="flex flex-col gap-1 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <span className="flex items-center gap-2 font-bold">
                  {title}
                  <span className="rounded-full px-1.5 text-[10px] font-extrabold text-white" style={{ background: ACCENT }}>
                    PLUS
                  </span>
                </span>
                <span className="text-sm leading-relaxed text-neutral-600">{body}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-black/5">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 text-xs leading-relaxed text-neutral-500">
          <p>
            Toreta は個人が開発しているアプリで、各カードゲームの公式とは関係ありません。カードの名称・画像などの権利は、それぞれの権利者に帰属します。カードの情報と画像はアプリに含まれておらず、利用者が入力した公式サイトから、利用者の端末が読み込んで表示します。
          </p>
          <p>このページの画面やカードは説明のためのイメージで、カードはすべて架空のものです。</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/toreta/support" className="hover:text-neutral-900">
              サポート
            </Link>
            <Link href="/toreta/privacy" className="hover:text-neutral-900">
              プライバシーポリシー
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              touyou.dev
            </Link>
          </div>
          <p>Apple、iPhone、App Store は Apple Inc. の商標です。</p>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: dark ? "#8DB0FF" : ACCENT }}>
        {eyebrow}
      </span>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
    </div>
  );
}

/* アイコンは SF Symbols を使えないので、同じ意味の単純な線画で描く */

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

function IconPlus() {
  return (
    <Svg>
      <path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

function IconStar() {
  return (
    <Svg>
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
    </Svg>
  );
}

function IconCamera() {
  return (
    <Svg>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </Svg>
  );
}

function IconStack() {
  return (
    <Svg>
      <rect x="7" y="7" width="12" height="14" rx="2" />
      <path d="M5 17V5a2 2 0 0 1 2-2h8" />
    </Svg>
  );
}

function IconChart() {
  return (
    <Svg>
      <path d="M5 20V10M12 20V4M19 20v-7" />
    </Svg>
  );
}

function IconLeaf() {
  return (
    <Svg>
      <path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15" />
      <path d="M5 19l7-7" />
    </Svg>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

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
      <div className="flex flex-col gap-2 text-xs">
        <span className="text-neutral-500">公式カードリストの URL</span>
        <span className="truncate rounded-lg bg-white px-2.5 py-2 font-mono text-[11px] ring-1 ring-black/5">https://example.com/cardlist/</span>
        <span className="self-end rounded-full px-3 py-1 font-semibold text-white" style={{ background: ACCENT }}>
          読み込む
        </span>
      </div>
    ),
  },
  {
    title: "自動で読み取る",
    body: "ページのつくりを調べて、カードの番号・名前・画像・レアリティがどこにあるかを見つけます。対応する iPhone では、端末内の言語モデルも判断に使います。",
    visual: (
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-xs">
        {[
          ["番号", "SC1-001"],
          ["名前", dummyCards[0].name],
          ["レアリティ", "N"],
          ["画像", "card/SC1-001.png"],
        ].map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-neutral-500">{label}</dt>
            <dd className="truncate font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    title: "確かめて追加",
    body: "最初の数枚で、正しく読み取れているかを確かめてから追加します。違っていたら、使う項目を選び直せます。",
    visual: (
      <div className="flex gap-2">
        {dummyCards.slice(0, 3).map((card) => (
          <TradingCard key={card.number} card={{ ...card, owned: 1 }} className="w-1/3" />
        ))}
      </div>
    ),
  },
];

const features = [
  {
    title: "タップで 1 枚ずつ記録",
    body: "クイック追加モードでは、カードをタップするたびに所持枚数が 1 枚増えます。長押しで細かく調整できます。",
  },
  {
    title: "ほしいカードに「ねらい」の印",
    body: "印を付けたカードだけを一覧にできます。足りないカードをまとめて「ねらい」に入れることもできます。",
  },
  {
    title: "カメラで番号を読み取る",
    body: "手元のカードにカメラを向けると、カード番号を読み取って記録します。映像は保存せず、端末の外へも送りません。",
  },
  {
    title: "デッキを組む",
    body: "持っているカードからデッキを作り、必要な枚数と足りない枚数を確かめられます。",
  },
  {
    title: "そろい具合を見る",
    body: "弾ごと・レアリティごとに、何種のうち何種を持っているかを表示します。",
  },
  {
    title: "公式サイトに負担をかけない",
    body: "読み込みは少しずつ行い、画像は端末に一時保存します。同じシリーズの更新は 10 分に 1 回までです。",
  },
];

const privacyPoints = [
  ["アカウントはありません", "ログインも、開発者のサーバーもありません。記録は端末に保存され、開発者に送られることはありません。"],
  ["トラッキングはしません", "広告やアクセス解析の SDK は入っていません。"],
  ["公式サイトから直接読み込みます", "カードの情報と画像は、あなたの端末が公式サイトから直接読み込みます。開発者のサーバーは経由しません。"],
];

const plusFeatures = [
  ["好きな色を使う", "用意された色のほかに、自由な色をアクセントにできます。"],
  ["カードの絵から色を作る", "シリーズのカードの絵から、そのカードゲームに合う色を提案します。"],
  ["デッキをいくつでも", "無料では 3 個まで。Plus ならデッキを好きなだけ作れます。"],
  ["所持リストの書き出し", "所持枚数とねらいを CSV で書き出して、表計算アプリなどで使えます。"],
];

export default function ToretaPage() {
  return (
    // auto-phrase で日本語を文節の切れ目で折り返す（対応していないブラウザでは通常の折り返しになる）
    <div className="min-h-screen bg-white text-[#1d1d1f] [word-break:auto-phrase]">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/toreta" className="flex items-center gap-2 font-semibold">
          <ToretaIcon className="h-7 w-7 shadow-none" />
          Toreta
        </Link>
        <nav className="flex gap-5 text-sm text-neutral-500">
          <Link href="/toreta/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/toreta/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </nav>
      </header>

      <main className="flex flex-col gap-24 pb-24 sm:gap-32">
        {/* ヒーロー */}
        <section className="mx-auto grid w-full max-w-5xl items-center gap-16 px-6 pt-8 md:grid-cols-[1fr_auto] md:pt-16">
          <div className="flex flex-col items-start gap-6">
            <ToretaIcon className="h-16 w-16 shadow-md" />
            {/* 狭い画面でも語の途中で折り返さないよう、まとまりごとに inline-block にする */}
            <h1 className="text-[32px] font-bold leading-[1.3] tracking-tight [font-feature-settings:'palt'] sm:text-5xl sm:leading-[1.25]">
              <span className="inline-block">公式カードリストを、</span>
              <br />
              <span className="inline-block">そのまま</span>
              <span className="inline-block">コレクション帳に。</span>
            </h1>
            <p className="max-w-md text-[17px] leading-[1.9] text-neutral-600">
              Toreta は、カードゲームの公式サイトにあるカードリストを取り込んで、持っているカードとほしいカードを記録する iPhone アプリです。
            </p>
            <p className="text-sm leading-relaxed text-neutral-500">
              <span className="font-semibold text-neutral-900">App Store で近日公開</span>
              <br />
              無料（アプリ内課金あり）・ iOS 27 以降
            </p>
          </div>
          <div className="relative mx-auto">
            {/* アイコンと同じく、2 枚のカードを傾けて重ねる */}
            <TradingCard
              card={dummyCards[5]}
              size="lg"
              decorative
              className="absolute -left-20 top-16 hidden w-44 -rotate-[14deg] opacity-90 shadow-lg md:flex"
            />
            <TradingCard
              card={dummyCards[1]}
              size="lg"
              decorative
              className="absolute -right-16 bottom-20 hidden w-40 rotate-[9deg] shadow-lg md:flex"
            />
            <PhoneMockup className="relative" />
          </div>
        </section>

        {/* 使い方 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <SectionHeading title="URL を貼れば、カードの一覧ができる">
            作品ごとの専用アプリではありません。公式サイトのカードリストから、そのつど一覧を作ります。
          </SectionHeading>
          <ol className="grid gap-x-8 gap-y-12 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex flex-col gap-4">
                <div className="flex flex-col justify-center rounded-2xl bg-neutral-100 p-5 md:aspect-[4/3]">{step.visual}</div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold">
                    <span className="mr-2 tabular-nums text-neutral-400">{i + 1}</span>
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[1.8] text-neutral-600">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="text-sm text-neutral-500">サイトのつくりによっては、取り込めないこともあります。</p>
        </section>

        {/* 機能 */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <SectionHeading title="記録するための、ひととおりの道具" />
          <ul className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <li key={feature.title} className="flex flex-col gap-1.5 border-t border-neutral-200 py-6">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="text-sm leading-[1.8] text-neutral-600">{feature.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* プライバシー */}
        <section className="bg-neutral-50 py-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
            <SectionHeading title="記録は、端末の中だけに保存します" />
            <ul className="grid gap-x-10 sm:grid-cols-3">
              {privacyPoints.map(([title, body]) => (
                <li key={title} className="flex flex-col gap-1.5 border-t border-neutral-200 py-6">
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm leading-[1.8] text-neutral-600">{body}</p>
                </li>
              ))}
            </ul>
            <Link href="/toreta/privacy" className="text-sm font-semibold" style={{ color: ACCENT }}>
              プライバシーポリシー
            </Link>
          </div>
        </section>

        {/* Toreta Plus */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6">
          <SectionHeading title="Toreta Plus">
            カードの記録・取り込み・カメラでの読み取りは無料で使えます。Toreta Plus は買い切りで、同じ Apple アカウントのデバイスすべてで使えます。定期的な支払いはありません。
          </SectionHeading>
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {plusFeatures.map(([title, body]) => (
              <li key={title} className="flex flex-col gap-1.5 border-t border-neutral-200 py-6">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm leading-[1.8] text-neutral-600">{body}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-10 text-xs leading-[1.8] text-neutral-500">
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

function SectionHeading({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <h2 className="text-balance text-2xl font-bold leading-snug tracking-tight [font-feature-settings:'palt'] sm:text-[32px]">{title}</h2>
      {children && <p className="leading-[1.9] text-neutral-600">{children}</p>}
    </div>
  );
}

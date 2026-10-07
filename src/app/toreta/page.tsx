import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, AppPage, Band, Heading, Phrases, Tile } from "@/components/app-lp";
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
    description: "公式カードリストを、そのままコレクション帳に。トレーディングカードの所持枚数を記録する iPhone アプリ。",
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

const features: { title: string; body: string; visual?: ReactNode }[] = [
  {
    title: "タップで 1 枚ずつ記録",
    body: "クイック追加モードでは、カードをタップするたびに所持枚数が 1 枚増えます。長押しで細かく調整できます。",
    visual: (
      <div className="relative w-16">
        <TradingCard card={dummyCards[4]} />
        <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-[#2F6BF2] px-1.5 text-[11px] font-bold leading-[18px] text-white ring-2 ring-[#F5F5F7]">×3</span>
      </div>
    ),
  },
  {
    title: "ほしいカードに「ねらい」の印",
    body: "印を付けたカードだけを一覧で見られます。足りないカードをまとめて「ねらい」に入れることもできます。",
    visual: (
      <div className="flex gap-2">
        {[dummyCards[2], dummyCards[6]].map((card) => (
          <div key={card.number} className="relative w-14">
            <TradingCard card={{ ...card, owned: 0 }} />
            <span className="absolute -bottom-1.5 -right-1.5 rounded-full bg-amber-400 px-1.5 text-[11px] leading-[18px] text-white ring-2 ring-[#F5F5F7]">★</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "カメラで番号を読み取る",
    body: "手元のカードにカメラを向けると、カード番号を読み取って記録します。映像は保存せず、端末の外へも送りません。",
    visual: (
      <div className="relative flex h-24 w-40 items-center justify-center rounded-2xl bg-[#1d1d1f]">
        {/* ファインダーの四隅 */}
        <span className="absolute inset-3 rounded-lg border-2 border-dashed border-white/30" />
        <span className="rounded-md bg-[#2F6BF2] px-2 py-1 font-mono text-sm font-bold text-white">SC1-004</span>
      </div>
    ),
  },
  {
    title: "デッキを組む",
    body: "持っているカードからデッキを作り、必要な枚数と足りない枚数を確かめられます。",
  },
  {
    title: "そろい具合を見る",
    body: "弾ごと・レアリティごとに、何種のうち何種を持っているかを表示します。",
    visual: (
      <div className="flex w-44 flex-col gap-2 text-[11px]">
        {[
          ["N", 6, 6],
          ["R", 3, 4],
          ["SR", 1, 2],
        ].map(([rarity, owned, total]) => (
          <div key={rarity} className="flex items-center gap-2">
            <span className="w-5 font-bold">{rarity}</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-neutral-300">
              <div className="h-full rounded-full bg-[#2F6BF2]" style={{ width: `${(Number(owned) / Number(total)) * 100}%` }} />
            </div>
            <span className="w-8 text-right tabular-nums text-neutral-500">
              {owned}/{total}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "公式サイトに負担をかけない",
    body: "読み込みは少しずつ行い、画像は端末に一時保存します。同じシリーズの更新は 10 分に 1 回までです。",
  },
];

const privacyPoints = [
  ["アカウントはありません", "ログインも、開発者のサーバーもありません。記録は端末に保存され、開発者に送られることはありません。"],
  ["トラッキングはしません", "広告やアクセス解析の SDK は入っていません。"],
  ["公式サイトから直接読み込みます", "カードの情報と画像は、あなたの端末が読み込みます。開発者のサーバーは経由しません。"],
];

const plusFeatures = [
  ["好きな色を使う", "用意された色のほかに、自由な色をアクセントにできます。"],
  ["カードの絵から色を作る", "シリーズのカードの絵から、そのカードゲームに合う色を提案します。"],
  ["デッキをいくつでも", "無料では 3 個まで。Plus ならデッキを好きなだけ作れます。"],
  ["所持リストの書き出し", "所持枚数と「ねらい」を CSV で書き出して、表計算アプリなどで使えます。"],
];

export default function ToretaPage() {
  return (
    <AppPage>
      <AppNav icon={<ToretaIcon className="h-6 w-6 shadow-none" />} name="Toreta" home="/toreta">
        <Link href="/toreta/support" className="hidden hover:text-neutral-900 sm:inline">
          サポート
        </Link>
        <Link href="/toreta/privacy" className="hidden hover:text-neutral-900 sm:inline">
          プライバシー
        </Link>
        <span className="rounded-full bg-neutral-200 px-3 py-1 text-[12px] font-medium text-neutral-600">近日公開</span>
      </AppNav>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 overflow-hidden px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <ToretaIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">Toreta</p>
              <h1 className="text-[clamp(30px,8vw,64px)] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
                <Phrases phrases={["公式カードリストを、", "そのまま", "コレクション帳に。"]} />
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                Toreta は、カードゲームの公式サイトにあるカードリストを取り込んで、持っているカードとほしいカードを記録する iPhone アプリです。
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <span className="rounded-full bg-neutral-200 px-7 py-3 text-[17px] font-medium text-neutral-700">App Store で近日公開</span>
              <span className="text-[13px] text-neutral-500">無料（アプリ内課金あり）・iOS 27 以降</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-full max-w-[280px]">
              {/* アイコンと同じく、2 枚のカードを傾けて重ねる */}
              <TradingCard
                card={dummyCards[5]}
                size="lg"
                decorative
                className="absolute -left-36 top-20 hidden w-44 -rotate-[14deg] opacity-90 shadow-lg md:flex"
              />
              <TradingCard
                card={dummyCards[1]}
                size="lg"
                decorative
                className="absolute -right-32 bottom-24 hidden w-40 rotate-[9deg] shadow-lg md:flex"
              />
              <PhoneMockup className="relative w-full text-left" />
            </div>
            <span className="text-xs text-neutral-400">カードを押すと、1 枚ずつ増えます</span>
          </div>
        </section>

        <Band tone="gray">
          <Heading title={["URL を貼れば、", "カードの一覧ができる"]}>
            作品ごとの専用アプリではありません。公式サイトのカードリストから、そのつど一覧を作ります。
          </Heading>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.title} className="flex">
                <Tile
                  title={`${i + 1}. ${step.title}`}
                  body={step.body}
                  className="w-full bg-white"
                >
                  <div className="w-full rounded-2xl bg-[#F5F5F7] p-4">{step.visual}</div>
                </Tile>
              </li>
            ))}
          </ol>
          <p className="text-center text-sm text-neutral-500">サイトのつくりによっては、取り込めないこともあります。</p>
        </Band>

        <Band>
          <Heading title={["記録するための、", "ひととおりの道具"]} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Tile key={feature.title} title={feature.title} body={feature.body}>
                {feature.visual}
              </Tile>
            ))}
          </div>
        </Band>

        <Band tone="gray">
          <Heading title={["記録は、", "端末の中だけに", "保存します"]} />
          <ul className="grid gap-4 sm:grid-cols-3">
            {privacyPoints.map(([title, body]) => (
              <li key={title} className="flex">
                <Tile title={title} body={body} className="w-full bg-white" />
              </li>
            ))}
          </ul>
          <Link href="/toreta/privacy" className="self-center text-[15px] text-[#0066CC] hover:underline">
            プライバシーポリシー ›
          </Link>
        </Band>

        <Band>
          <Heading title={["Toreta Plus"]}>
            カードの記録・取り込み・カメラでの読み取りは無料で使えます。Toreta Plus は買い切りで、同じ Apple アカウントのデバイスすべてで使えます。定期的な支払いはありません。
          </Heading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {plusFeatures.map(([title, body]) => (
              <li key={title} className="flex">
                <Tile title={title} body={body} className="w-full" />
              </li>
            ))}
          </ul>
        </Band>

        <section className="flex flex-col items-center gap-6 bg-[#F5F5F7] px-6 py-24 text-center">
          <ToretaIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">Toreta は近日公開です</h2>
          <span className="text-[13px] text-neutral-500">無料（アプリ内課金あり）・iOS 27 以降</span>
        </section>
      </main>

      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-black/10 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
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
          <p>
            Toreta は個人が開発しているアプリで、各カードゲームの公式とは関係ありません。カードの名称・画像などの権利は、それぞれの権利者に帰属します。カードの情報と画像はアプリに含まれておらず、利用者が入力した公式サイトから、利用者の端末が読み込んで表示します。
          </p>
          <p>このページの画面やカードは説明のためのイメージで、カードはすべて架空のものです。</p>
          <p>Apple、iPhone、App Store は Apple Inc. の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </AppPage>
  );
}

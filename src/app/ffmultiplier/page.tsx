import type { Metadata } from "next";
import Link from "next/link";

import { AppNav, AppPage, Band, Heading, Phrases, PillLink, Tile } from "@/components/app-lp";
import { FFIcon } from "@/components/ffmultiplier/FFIcon";
import { GameDemo } from "@/components/ffmultiplier/GameDemo";
import { FTable, LocalScoreScreen, OnlineRankingScreen, PointChip, ResultCard, ShareMessage } from "@/components/ffmultiplier/Screens";

/**
 * FFMultiplier（FFMultiply リポジトリの iOS アプリ）の紹介ページ。
 * 遊び方・点数・ランキングの説明は、アプリの実装（GameViewModel.swift / RankingService.swift / ScoreStore.swift など）に合わせる。
 * 「FF」は 16 進数の 0xFF のこと。ゲームの決まりを変えたら、ここと components/ffmultiplier/hex.ts も直す。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/id1151801381";
const SUPPORT_URL = "/ffmultiplier/support";
const PRIVACY_URL = "/ffmultiplier/privacy";

export const metadata: Metadata = {
  title: "FFMultiplier — 16進数の掛け算ゲーム",
  description: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。16 進数での九九、覚えてみませんか？",
  openGraph: {
    title: "FFMultiplier",
    description: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。",
    url: "https://touyou.dev/ffmultiplier",
  },
};

export default function FFMultiplierPage() {
  return (
    <AppPage>
      <AppNav icon={<FFIcon className="h-6 w-6 shadow-none" />} name="FFMultiplier" home="/ffmultiplier">
        <a href={SUPPORT_URL} className="hidden hover:text-neutral-900 sm:inline">
          サポート
        </a>
        <a href={PRIVACY_URL} className="hidden hover:text-neutral-900 sm:inline">
          プライバシー
        </a>
        <PillLink href={APP_STORE_URL} size="sm">
          入手
        </PillLink>
      </AppNav>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <FFIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">FFMultiplier</p>
              <h1 className="text-[clamp(32px,7vw,60px)] font-bold leading-[1.2] tracking-[-0.02em] [font-feature-settings:'palt']">
                <Phrases phrases={["九九を、", "F の段まで。"]} />
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                16&nbsp;進数の掛け算に、60&nbsp;秒で何問答えられるかを競うゲームです。16&nbsp;進数での九九、覚えてみませんか？
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
              <span className="text-[13px] text-neutral-500">無料（広告あり）・iOS 18 以降</span>
            </div>
          </div>
          <GameDemo />
        </section>

        <Band tone="gray">
          <Heading title={["0 から F までの、", "掛け算です。"]}>
            問題は 0〜9 と A〜F の 2 つの数の掛け算です。答えも 16&nbsp;進数で、16 個のキーで入力します。C&nbsp;×&nbsp;5 なら 3C、F&nbsp;×&nbsp;F なら E1 です。
          </Heading>
          <div className="flex flex-col items-center gap-4">
            <FTable />
            <p className="text-[13px] text-neutral-500">上は F の段です。いちばん大きい答えは F&nbsp;×&nbsp;F&nbsp;=&nbsp;E1 です。</p>
          </div>
          <p className="mx-auto max-w-2xl text-center text-[15px] leading-[1.8] text-neutral-500">
            作ったきっかけは、ある教授の「九九じゃなくて FF を覚えましょう」というひとことでした。
          </p>
        </Band>

        <Band>
          <Heading title={["60 秒で、", "何問解けるか。"]}>
            答えを入れて DONE を押すと、すぐに次の問題が出ます。間違えると点が減るので、速さと正確さの両方が必要です。
          </Heading>
          <div className="grid gap-4 sm:grid-cols-3">
            <Tile title="正解で 10 点" body="答えが合っていれば 10 点入ります。">
              <PointChip text="10" label="プラス 10 点" tone="green" />
            </Tile>
            <Tile title="間違えると 5 点減る" body="答えが違っていると 5 点減り、続けて正解した数も 0 に戻ります。">
              <PointChip text="-5" label="マイナス 5 点" tone="red" />
            </Tile>
            <Tile title="続けて正解すると増える" body="5 問続けて正解するごとに、1 問の点が 5 点ずつ増えます。いちばん多くて 1 問 25 点です。">
              <PointChip text="25" label="最大 プラス 25 点" tone="green" />
            </Tile>
          </div>
        </Band>

        <Band tone="gray">
          <Heading title={["自分の記録も、", "みんなの記録も。"]}>
            遊んだ結果は日付と一緒に iPhone に残ります。ユーザー名を決めておくと、ハイスコアを出したときにオンラインランキングへ登録されます。
          </Heading>
          <div className="grid gap-4 md:grid-cols-2">
            <Tile className="bg-white" title="Local Score" body="これまでの点数を、高い順に 50 件まで見られます。">
              <LocalScoreScreen />
            </Tile>
            <Tile className="bg-white" title="Online Ranking" body="上位 50 人と、自分の前後の順位を切り替えて見られます。">
              <OnlineRankingScreen />
            </Tile>
          </div>
        </Band>

        <Band>
          <Heading title={["点数も順位も、", "そのまま送れる。"]}>
            ゲームが終わると結果が表示され、SHARE から点数を送れます。ランキングの画面からは、自分の順位を送れます。
          </Heading>
          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-end">
            <ResultCard />
            <ShareMessage />
          </div>
        </Band>

        <section className="flex flex-col items-center gap-6 bg-[#F5F5F7] px-6 py-24 text-center">
          <FFIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">
            <Phrases phrases={["FFMultiplier は", "無料です。"]} />
          </h2>
          <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
          <span className="text-[13px] text-neutral-500">広告が表示されます・iOS 18 以降</span>
        </section>
      </main>

      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-black/10 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SUPPORT_URL} className="hover:text-neutral-900">
              サポート
            </a>
            <a href={PRIVACY_URL} className="hover:text-neutral-900">
              プライバシーポリシー
            </a>
            <Link href="/" className="hover:text-neutral-900">
              touyou.dev
            </Link>
          </div>
          <p>このページの画面は、説明のために描き直したイメージです。ランキングの名前と点数は架空のものです。</p>
          <p>Apple、iPhone、App Store は Apple Inc. の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </AppPage>
  );
}

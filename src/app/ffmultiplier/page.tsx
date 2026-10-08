import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Phrases } from "@/components/app-lp";
import { FFIcon } from "@/components/ffmultiplier/FFIcon";
import { GameDemo } from "@/components/ffmultiplier/GameDemo";
import { FFCard, FFHeading, FFNav, FFPage, HEADING_FONT, PRIVACY_URL, Section, StoreButton, SUPPORT_URL } from "@/components/ffmultiplier/lp";
import { FTable, LocalScoreScreen, OnlineRankingScreen, PointChip, ResultCard, ShareMessage } from "@/components/ffmultiplier/Screens";
import { cn } from "@/lib/utils";

/**
 * FFMultiplier（FFMultiply リポジトリの iOS アプリ）の紹介ページ。
 * 見た目はアプリに寄せる（FFGreen の地、ゲーム画面の黒、白い地、Futura の見出し、7 セグメントの数字）。
 * 遊び方・点数・ランキングの説明は、アプリの実装（GameViewModel.swift / RankingService.swift / ScoreStore.swift など）に合わせる。
 * 「FF」は 16 進数の 0xFF のこと。ゲームの決まりを変えたら、ここと components/ffmultiplier/hex.ts も直す。
 */

export const metadata: Metadata = {
  title: "FFMultiplier — 16進数の掛け算ゲーム",
  description: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。16 進数での九九、覚えてみませんか？",
  // 紹介画像は public/og/ffmultiplier.png（ページの絵を 1200×630 で撮ったもの）
  openGraph: {
    title: "FFMultiplier",
    description: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。",
    url: "https://www.touyou.dev/ffmultiplier",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/ffmultiplier.png", width: 1200, height: 630, alt: "FFMultiplier の紹介画像" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "FFMultiplier",
    description: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。",
    images: ["https://www.touyou.dev/og/ffmultiplier.png"],
  },
};

export default function FFMultiplierPage() {
  return (
    <FFPage>
      <FFNav icon={<FFIcon className="h-6 w-6 shadow-none" />}>
        <a href={SUPPORT_URL} className="hidden hover:text-[#111111] sm:inline">
          サポート
        </a>
        <a href={PRIVACY_URL} className="hidden hover:text-[#111111] sm:inline">
          プライバシー
        </a>
        <StoreButton size="sm">入手</StoreButton>
      </FFNav>

      <main className="flex flex-col">
        {/* ヒーロー。App Store のスクリーンショットと同じ FFGreen の地にする */}
        <section className="bg-[#85BF5D] text-[#111111]">
          <div className="mx-auto grid w-full max-w-5xl items-center gap-14 px-6 pb-20 pt-14 sm:pt-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
            <div className="flex min-w-0 flex-col items-center gap-7 text-center lg:items-start lg:text-left">
              <div className="flex items-center gap-4">
                <FFIcon className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
                {/* アプリ名のロゴ。App Store のスクリーンショットに合わせて白で書く */}
                <p className={cn("text-[clamp(30px,6vw,44px)] leading-none tracking-wide text-[#F9F8F5]", HEADING_FONT)}>FFMultiplier</p>
              </div>
              <h1 className={cn("text-[clamp(36px,6.5vw,58px)] font-bold leading-[1.2]", HEADING_FONT)}>
                {/* PC 幅でも 1 行に詰めず、文節ごとに 2 行で見せる */}
                <span className="inline-block">九九を、</span>
                <br />
                <span className="inline-block">F の段まで。</span>
              </h1>
              <p className="max-w-xl text-[clamp(17px,2.2vw,20px)] leading-[1.8] text-[#111111]/80">
                16&nbsp;進数の掛け算に、60&nbsp;秒で何問答えられるかを競うゲームです。16&nbsp;進数での九九、覚えてみませんか？
              </p>
              <div className="flex flex-col items-center gap-3 lg:items-start">
                <StoreButton>App Store で入手</StoreButton>
                <span className="text-[13px] text-[#111111]/70">無料（広告あり）・iOS 18 以降</span>
              </div>
            </div>
            <GameDemo />
          </div>
        </section>

        <Section>
          <FFHeading title={["0 から F までの、", "掛け算です。"]}>
            問題は 0〜9 と A〜F の 2 つの数の掛け算です。答えも 16&nbsp;進数で、16 個のキーで入力します。C&nbsp;×&nbsp;5 なら 3C、F&nbsp;×&nbsp;F なら E1 です。
          </FFHeading>
          <div className="flex flex-col items-center gap-4">
            <FTable />
            <p className="text-center text-[13px] text-neutral-500">上は F の段です。いちばん大きい答えは F&nbsp;×&nbsp;F&nbsp;=&nbsp;E1 です。</p>
          </div>
          <div className="flex flex-col items-center gap-5 text-center">
            <Image src="/ffmultiplier/key-visual.png" alt="FFMultiplier のロゴ" width={431} height={199} className="h-auto w-full max-w-[300px]" />
            <p className="max-w-xl text-[15px] leading-[1.8] text-neutral-600">
              作ったきっかけは、ある教授の「九九じゃなくて FF を覚えましょう」というひとことでした。
            </p>
          </div>
        </Section>

        <Section tone="dark">
          <FFHeading tone="dark" title={["60 秒で、", "何問解けるか。"]}>
            答えを入れて DONE を押すと、すぐに次の問題が出ます。間違えると点が減るので、速さと正確さの両方が必要です。
          </FFHeading>
          <div className="grid gap-4 md:grid-cols-3">
            <FFCard tone="dark" title="正解で 10 点" body="答えが合っていれば 10 点入ります。">
              <PointChip text="10" label="プラス 10 点" tone="green" />
            </FFCard>
            <FFCard tone="dark" title="間違えると 5 点減る" body="答えが違っていると 5 点減り、続けて正解した数も 0 に戻ります。">
              <PointChip text="-5" label="マイナス 5 点" tone="red" />
            </FFCard>
            <FFCard tone="dark" title="続けて正解すると増える" body="5 問続けて正解するごとに、1 問の点が 5 点ずつ増えます。いちばん多くて 1 問 25 点です。">
              <PointChip text="25" label="最大 プラス 25 点" tone="green" />
            </FFCard>
          </div>
        </Section>

        <Section>
          <FFHeading title={["ハイスコアは、", "ランキングへ。"]}>
            遊んだ結果は日付と一緒に iPhone に残ります。ユーザー名を決めておくと、ハイスコアを出したときにオンラインランキングへ登録されます。
          </FFHeading>
          <div className="grid gap-4 md:grid-cols-2">
            <FFCard title="Local Score" body="これまでの点数を、高い順に 50 件まで見られます。" figureClassName="h-[330px]">
              <LocalScoreScreen />
            </FFCard>
            <FFCard title="Online Ranking" body="上位 50 人と、自分の前後の順位を切り替えて見られます。" figureClassName="h-[330px]">
              <OnlineRankingScreen />
            </FFCard>
          </div>
        </Section>

        <Section tone="green">
          <FFHeading tone="green" title={["点数は、", "SHARE で", "送れます。"]}>
            ゲームが終わると結果が表示され、SHARE から点数を送れます。オンラインランキングの画面からは、自分の順位を送れます。
          </FFHeading>
          <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:items-end">
            <ResultCard />
            <ShareMessage />
          </div>
        </Section>

        <section className="flex flex-col items-center gap-6 bg-[#111111] px-6 py-24 text-center text-[#F9F8F5]">
          <FFIcon className="h-20 w-20" />
          <h2 className={cn("text-[clamp(28px,5vw,40px)] font-bold", HEADING_FONT)}>
            <Phrases phrases={["FFMultiplier は", "無料です。"]} />
          </h2>
          <StoreButton variant="green">App Store で入手</StoreButton>
          <span className="text-[13px] text-neutral-400">広告が表示されます・iOS 18 以降</span>
        </section>
      </main>

      <footer className="bg-[#111111]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-white/10 px-6 py-8 text-xs leading-[1.8] text-neutral-400">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SUPPORT_URL} className="hover:text-white">
              サポート
            </a>
            <a href={PRIVACY_URL} className="hover:text-white">
              プライバシーポリシー
            </a>
            <Link href="/" className="hover:text-white">
              touyou.dev
            </Link>
          </div>
          <p>このページの画面は、説明のために描き直したイメージです。ランキングの名前と点数は架空のものです。</p>
          <p>Apple、iPhone、App Store は Apple Inc. の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </FFPage>
  );
}

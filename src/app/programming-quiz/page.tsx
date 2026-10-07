import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Phrases } from "@/components/app-lp";
import { Card, IconBadge, QuizNav, QuizPage, Section, SectionHeading, StoreButton } from "@/components/programming-quiz/lp";
import { QuizDemo } from "@/components/programming-quiz/QuizDemo";
import { QuizIcon } from "@/components/programming-quiz/QuizIcon";
import {
  CATEGORIES,
  type CategoryId,
  CategoryGlyph,
  CategoryRow,
  INDIGO,
  IpadGlyph,
  MicGlyph,
  PURPLE,
  Sparkles,
} from "@/components/programming-quiz/quiz-ui";
import { AiProgress, AiSection, IpadHome, ShortcutTiles } from "@/components/programming-quiz/Screens";

/**
 * Programming Quiz（QuizLiT リポジトリの iOS / iPadOS アプリ）の紹介ページ。
 * 見た目はアプリに寄せる（グレーの地・白い角丸カード・インディゴのボタン・AI は紫・カテゴリごとの色）。
 * 機能と文言はアプリの実装（Quiz/Models・Quiz/Views・Quiz/Intents）に合わせる。機能を変えたらここも直す。
 * 問題はオリジナルだが、ページに載せるのは体験版の 3 問だけにする。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/id1089599534";
const SUPPORT_URL = "/programming-quiz/support";
const PRIVACY_URL = "/programming-quiz/privacy";

export const metadata: Metadata = {
  title: "Programming Quiz — 3 択で試す、プログラミングの知識",
  description:
    "プログラミング言語の由来、iPhone アプリ開発、アルゴリズムの 3 つのジャンルから、全 27 問の 3 択クイズに挑戦できる iPhone・iPad アプリ。好きなテーマでオンデバイス AI に問題をつくってもらうこともできます。",
  openGraph: {
    title: "Programming Quiz",
    description: "3 択で試す、プログラミングの知識。",
    url: "https://touyou.dev/programming-quiz",
  },
};

const CATEGORY_TEXT: Record<CategoryId, string> = {
  basic: "言語の名前の由来や、言語をつくった人など、プログラミング言語にまつわる問題です。",
  iphone: "Swift の書き方や開発環境など、iPhone アプリをつくるときの基本を問います。",
  algorithm: "探索や動的計画法など、アルゴリズムと競技プログラミングにまつわる問題です。",
};

const SIRI_PHRASES = ["Programming Quizでクイズを始める", "Programming Quizでアルゴリズム編のクイズを始める", "Programming QuizでAIクイズを始める"];

export default function ProgrammingQuizPage() {
  return (
    <QuizPage>
      <QuizNav>
        <a href={SUPPORT_URL} className="hidden hover:text-neutral-900 sm:inline">
          サポート
        </a>
        <a href={PRIVACY_URL} className="hidden hover:text-neutral-900 sm:inline">
          プライバシー
        </a>
        <StoreButton href={APP_STORE_URL} size="sm">
          入手
        </StoreButton>
      </QuizNav>

      <main className="flex flex-col">
        {/* ヒーロー。右（スマートフォンでは下）の iPhone はその場で解ける体験版 */}
        <section className="mx-auto grid w-full max-w-5xl items-center gap-14 px-5 pb-16 pt-12 sm:pt-16 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10 lg:pb-24">
          <div className="flex flex-col items-center gap-7 text-center lg:items-start lg:text-left">
            <Image
              src="/programming-quiz/wordmark.png"
              alt="Programming Quiz"
              width={800}
              height={230}
              priority
              className="h-auto w-[min(280px,80%)]"
            />
            <h1 className="text-[clamp(32px,6.4vw,50px)] font-extrabold leading-[1.25] tracking-[-0.02em] [font-feature-settings:'palt']">
              <Phrases phrases={["3 択で試す、"]} />
              <br />
              <Phrases phrases={["プログラミングの", "知識。"]} />
            </h1>
            <p className="max-w-xl text-[clamp(16px,2vw,19px)] leading-[1.8] text-neutral-600">
              プログラミング言語の由来、iPhone アプリ開発、アルゴリズムの 3 つのジャンルから、全 27 問の 3 択クイズに挑戦できます。好きなテーマを入れて、オンデバイス AI に新しい問題をつくってもらうこともできます。
            </p>
            <div className="flex flex-col items-center gap-3 lg:items-start">
              <StoreButton href={APP_STORE_URL}>App Store で入手</StoreButton>
              <span className="text-[13px] text-neutral-500">無料（広告あり）・iOS 26 以降</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <QuizDemo />
            <span className="text-xs text-neutral-500">選択肢を押して、そのまま解けます</span>
          </div>
        </section>

        <Section>
          <SectionHeading
            title={["挑戦するジャンルを", "選んでスタート"]}
            icon={
              <span className="flex gap-2" aria-hidden>
                {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => (
                  <span key={id} className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-white shadow-sm">
                    <CategoryGlyph id={id} className="h-6 w-6" />
                  </span>
                ))}
              </span>
            }
          >
            ジャンルはいくつでも組み合わせられます。問題の順番は毎回入れ替わります。
          </SectionHeading>
          <ul className="grid gap-4 md:grid-cols-3">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => (
              <li key={id}>
                <Card
                  title={CATEGORIES[id].title}
                  badge={
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[12px] font-bold"
                      style={{ color: CATEGORIES[id].color, background: `${CATEGORIES[id].color}1F` }}
                    >
                      {CATEGORIES[id].count} 問
                    </span>
                  }
                  body={CATEGORY_TEXT[id]}
                  figure={<CategoryRow id={id} selected className="w-full bg-[#F2F2F7]" />}
                />
              </li>
            ))}
          </ul>
        </Section>

        <Section>
          <SectionHeading
            title={["テーマを入れると、", "AI が 5 問つくります"]}
            icon={
              <IconBadge color={PURPLE}>
                <Sparkles className="h-6 w-6" color="white" />
              </IconBadge>
            }
          >
            「AIにおまかせ出題」にテーマを入れると、端末の中で動く Apple の言語モデルが、そのテーマの 3 択問題を 5 問つくります。
          </SectionHeading>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-4 rounded-[28px] bg-white p-4 sm:p-6 md:grid-cols-2">
            <AiSection />
            <div className="flex flex-col gap-4">
              <AiProgress />
              <div className="flex flex-col gap-2 rounded-[24px] p-5 ring-1 ring-inset ring-black/10">
                <h3 className="text-[15px] font-bold">AI の問題についてのご注意</h3>
                <p className="text-[14px] leading-[1.8] text-neutral-600">
                  問題文・選択肢・正誤は自動で生成されるため、誤りを含むことがあります。正しさは保証されません。AI の問題を解いている間は、画面にも同じ注意が出ます。
                </p>
                <p className="text-[14px] leading-[1.8] text-neutral-600">
                  Apple Intelligence に対応した端末で使えます。使えない端末では、ホーム画面にその旨が表示されます。
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <SectionHeading
            title={["Siri からも", "始められます"]}
            icon={
              <IconBadge color={INDIGO}>
                <MicGlyph className="h-6 w-6" />
              </IconBadge>
            }
          >
            ジャンルを指定して始めるときと、AI の問題で始めるときに使えます。ショートカット App には「カテゴリを指定してクイズを開始」と「AIクイズを開始」のアクションがあります。
          </SectionHeading>
          <div className="flex flex-col items-center gap-6">
            <ul className="flex max-w-full flex-wrap justify-center gap-3">
              {SIRI_PHRASES.map((phrase) => (
                <li key={phrase} className="max-w-full rounded-[18px] bg-white px-5 py-2.5 text-center text-[15px] shadow-sm">
                  「{phrase}」
                </li>
              ))}
            </ul>
            <ShortcutTiles />
          </div>
        </Section>

        <Section>
          <SectionHeading
            title={["iPad でも", "遊べます"]}
            icon={
              <IconBadge color="#1C1C1E">
                <IpadGlyph className="h-6 w-6" />
              </IconBadge>
            }
          >
            iPhone と iPad に対応しています。iPad では、ジャンルの選択や問題を読みやすい幅にまとめて表示します。
          </SectionHeading>
          <IpadHome />
        </Section>

        <Section>
          <SectionHeading title={["アカウント登録なしで、", "すぐに遊べます"]}>ホーム画面の下に広告が表示されます。アプリ内課金はありません。</SectionHeading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["アカウント登録なし", "サインインも、メールアドレスの入力もいりません。"],
              ["トラッキングは選べます", "初めて開いたときに確認します。許可しなくても、すべての機能を使えます。"],
              ["AI の問題は端末の中で", "入れたテーマと AI がつくった問題は、開発者に送られません。"],
            ].map(([title, body]) => (
              <li key={title}>
                <Card title={title} body={body} />
              </li>
            ))}
          </ul>
          <a href={PRIVACY_URL} className="self-center text-[15px] font-semibold hover:underline" style={{ color: INDIGO }}>
            プライバシーポリシー ›
          </a>
        </Section>

        <section className="px-5 pb-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 rounded-[32px] bg-white px-6 py-16 text-center">
            <QuizIcon className="h-20 w-20" />
            <h2 className="text-[clamp(22px,4.6vw,40px)] font-extrabold tracking-tight">
              <Phrases phrases={["Programming Quiz は", "無料です"]} />
            </h2>
            <StoreButton href={APP_STORE_URL}>App Store で入手</StoreButton>
            <span className="text-[13px] text-neutral-500">iOS 26・iPadOS 26 以降</span>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-5 py-8 text-xs leading-[1.8] text-neutral-500">
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
          <p>このページの画面は、説明のために描き直したイメージです。</p>
          <p>Programming Quiz は個人が開発したアプリで、Apple Inc. とは関係ありません。</p>
          <p>
            Apple、iPhone、iPad、App Store、Siri、Swift、Xcode、Apple Intelligence は Apple Inc. の商標です。その他の名称は各社の商標です。
          </p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </QuizPage>
  );
}

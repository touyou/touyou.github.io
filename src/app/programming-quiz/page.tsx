import type { Metadata } from "next";
import Link from "next/link";

import { AppNav, AppPage, Band, Heading, Phrases, PillLink, TapHint, Tile } from "@/components/app-lp";
import { QuizDemo } from "@/components/programming-quiz/QuizDemo";
import { QuizIcon } from "@/components/programming-quiz/QuizIcon";
import { CATEGORIES, type CategoryId, CategoryRow } from "@/components/programming-quiz/quiz-ui";
import { AiProgress, AiSection, IpadHome } from "@/components/programming-quiz/Screens";

/**
 * Programming Quiz（QuizLiT リポジトリの iOS / iPadOS アプリ）の紹介ページ。
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
  basic: "言語の名前の由来や、言語をつくった人など、プログラミング言語にまつわる 10 問です。",
  iphone: "Swift の書き方や開発環境など、iPhone アプリをつくるときの基本を問う 10 問です。",
  algorithm: "探索や動的計画法など、アルゴリズムと競技プログラミングにまつわる 7 問です。",
};

export default function ProgrammingQuizPage() {
  return (
    <AppPage>
      <AppNav icon={<QuizIcon className="h-6 w-6 shadow-none" />} name="Programming Quiz" home="/programming-quiz">
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
        {/* ヒーロー。下の iPhone はその場で解ける体験版 */}
        <section className="flex flex-col items-center gap-14 px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <QuizIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">Programming Quiz</p>
              <h1 className="text-[clamp(32px,7vw,60px)] font-bold leading-[1.2] tracking-[-0.02em] [font-feature-settings:'palt']">
                <Phrases phrases={["3 択で試す、"]} />
                <br />
                <Phrases phrases={["プログラミングの", "知識。"]} />
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                プログラミング言語の由来、iPhone アプリ開発、アルゴリズムの 3 つのジャンルから、全 27 問の 3 択クイズに挑戦できます。好きなテーマを入れて、オンデバイス AI に新しい問題をつくってもらうこともできます。
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
              <span className="text-[13px] text-neutral-500">無料（広告あり）・iOS 26 以降</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <QuizDemo />
            <TapHint />
          </div>
        </section>

        <Band tone="gray">
          <Heading title={["3 つのジャンルから、", "選んで始める。"]}>
            挑戦したいジャンルを選んで「スタート」を押すと始まります。いくつでも組み合わせられて、問題の順番は毎回入れ替わります。
          </Heading>
          <ul className="grid gap-4 md:grid-cols-3">
            {(Object.keys(CATEGORIES) as CategoryId[]).map((id) => (
              <li key={id} className="flex">
                <Tile
                  title={CATEGORIES[id].title}
                  body={CATEGORY_TEXT[id]}
                  className="w-full bg-white"
                >
                  <CategoryRow id={id} selected className="w-full bg-[#F2F2F7]" />
                </Tile>
              </li>
            ))}
          </ul>
        </Band>

        <Band>
          <Heading title={["テーマを入れると、", "AI が 5 問つくります。"]}>
            「AIにおまかせ出題」にテーマを入れると、端末の中で動く Apple の言語モデルが、そのテーマの 3 択問題を 5 問つくります。
          </Heading>
          <div className="mx-auto grid w-full max-w-3xl items-start gap-4 md:grid-cols-2">
            <AiSection />
            <div className="flex flex-col gap-4">
              <AiProgress />
              <div className="flex flex-col gap-2 rounded-[28px] border border-black/10 p-5 text-left sm:p-6">
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
        </Band>

        <Band tone="gray">
          <Heading title={["Siri に話しかけて、", "すぐに始める。"]}>
            ジャンルを指定して始めることも、AI の問題で始めることもできます。ショートカット App には「カテゴリを指定してクイズを開始」と「AIクイズを開始」のアクションがあります。
          </Heading>
          <ul className="flex flex-wrap justify-center gap-3">
            {["Programming Quizでクイズを始める", "Programming Quizでアルゴリズム編のクイズを始める", "Programming QuizでAIクイズを始める"].map((phrase) => (
              <li key={phrase} className="rounded-full bg-white px-5 py-2.5 text-[15px] shadow-sm ring-1 ring-black/5">
                「{phrase}」
              </li>
            ))}
          </ul>
        </Band>

        <Band>
          <Heading title={["iPhone でも、", "iPad でも。"]}>
            iPhone と iPad の両方に対応しています。iPad では縦向きでも横向きでも、問題と選択肢が読みやすい幅に収まります。
          </Heading>
          <IpadHome />
        </Band>

        <Band tone="gray">
          <Heading title={["アカウント登録なしで、", "すぐに遊べます。"]}>
            ホーム画面の下に広告が表示されます。アプリ内課金はありません。
          </Heading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["アカウント登録なし", "サインインも、メールアドレスの入力もいりません。"],
              ["トラッキングは選べます", "初めて開いたときに確認します。許可しなくても、すべての機能を使えます。"],
              ["AI の問題は端末の中で", "入れたテーマと AI がつくった問題は、開発者に送られません。"],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 rounded-[28px] bg-white p-7">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-[15px] leading-[1.8] text-neutral-600">{body}</p>
              </li>
            ))}
          </ul>
          <a href={PRIVACY_URL} className="self-center text-[15px] text-[#0066CC] hover:underline">
            プライバシーポリシー ›
          </a>
        </Band>

        <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
          <QuizIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">
            <Phrases phrases={["Programming Quiz は", "無料です。"]} />
          </h2>
          <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
          <span className="text-[13px] text-neutral-500">iOS 26・iPadOS 26 以降</span>
        </section>
      </main>

      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
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
    </AppPage>
  );
}

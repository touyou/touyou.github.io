import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { Surfaces } from "@/components/intento/Surfaces";
import { VoiceDemo } from "@/components/intento/VoiceDemo";

/**
 * Intento（IntentTodo リポジトリの iOS / iPadOS / macOS / watchOS / visionOS アプリ）の紹介ページ。
 * 文言は App Store の説明文（IntentTodo/metadata/ios/version/<バージョン>/ja.json）とアプリのローカライズに合わせる。
 * ネイティブの見た目を大事にしているアプリなので、ページも Apple の製品ページに近い書体・余白・色にそろえる。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/intento/id6788623037";
const SUPPORT_URL = "https://github.com/touyou/IntentTodo/issues";
const PRIVACY_URL = "https://github.com/touyou/IntentTodo/blob/main/PRIVACY.md";

export const metadata: Metadata = {
  title: "Intento — 開かなくても、片づくやることリスト",
  description:
    "Siri、ウィジェット、コントロールセンター、ロック画面、Apple Watch、Spotlight から使えるやることリスト。iPhone、iPad、Mac、Apple Watch、Apple Vision Pro に対応。",
  openGraph: {
    title: "Intento",
    description: "開かなくても、片づく。どこからでも使えるやることリスト。",
    url: "https://touyou.dev/intento",
  },
};

export default function IntentoPage() {
  return (
    <div className="min-h-screen bg-white font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [word-break:auto-phrase]">
      {/* ナビゲーション */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-6">
          <Link href="/intento" className="flex items-center gap-2 text-[15px] font-semibold">
            <IntentoIcon className="h-6 w-6 shadow-none" />
            Intento
          </Link>
          <nav className="flex items-center gap-5 text-[13px] text-neutral-600">
            <a href={SUPPORT_URL} className="hidden hover:text-neutral-900 sm:inline">
              サポート
            </a>
            <a href={PRIVACY_URL} className="hidden hover:text-neutral-900 sm:inline">
              プライバシー
            </a>
            <a href={APP_STORE_URL} className="rounded-full bg-[#0071E3] px-3 py-1 text-[12px] font-medium text-white hover:bg-[#0077ED]">
              入手
            </a>
          </nav>
        </div>
      </header>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <IntentoIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">Intento</p>
              <h1 className="text-[clamp(40px,11vw,80px)] font-bold leading-[1.1] tracking-[-0.02em] [font-feature-settings:'palt']">
                <span className="inline-block">開かなくても、</span>
                <span className="inline-block">片づく。</span>
              </h1>
              <p className="max-w-2xl text-balance text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                Siri に話しかけても、ウィジェットを押しても、Apple Watch を見ても。どこから触っても同じように動く、やることリストです。
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <a
                href={APP_STORE_URL}
                className="rounded-full bg-[#0071E3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ED]"
              >
                App Store で入手
              </a>
              <span className="text-[13px] text-neutral-500">無料・アプリ内課金なし</span>
            </div>
          </div>
          <VoiceDemo />
        </section>

        {/* 声 */}
        <Band tone="gray">
          <Heading title={["Siri に話しかければ、", "それで終わり。"]}>
            「Intento でやることを追加」「Intento で〇〇を完了」。やることの名前をそのまま文に混ぜられるので、あとから選び直す手間がありません。
          </Heading>
          <ul className="flex flex-wrap justify-center gap-3">
            {[
              "Intento でやることを追加",
              "Intento で〇〇を完了",
              "Intento の〇〇をスヌーズ",
              "Intento のやることは何件",
              "Intento で一番急ぎのやることを完了",
            ].map((phrase) => (
              <li key={phrase} className="rounded-full bg-white px-5 py-2.5 text-[15px] shadow-sm ring-1 ring-black/5">
                「{phrase}」
              </li>
            ))}
          </ul>
        </Band>

        {/* どこからでも */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32">
          <Heading title={["アプリを開くのは、", "見直したいときだけ。"]}>
            ホーム画面からも、ロック画面からも、手首の上からも。どこから触っても、同じ操作が同じように動きます。
          </Heading>
          <Surfaces />
        </section>

        {/* すべてのデバイス */}
        <Band tone="gray">
          <Heading title={["iPhone でも、", "iPad でも、", "Mac でも。"]}>
            iPhone、iPad、Mac、Apple Watch、Apple Vision Pro に対応しています。iCloud で同期するので、どこで足しても、どこでも見えます。
          </Heading>
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="overflow-hidden rounded-[36px] border-[12px] border-[#1d1d1f] bg-[#1d1d1f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
              <Image src="/intento/ipad-list.jpg" alt="iPad の Intento の一覧画面" width={750} height={1000} className="w-full rounded-[24px]" />
            </div>
            <div className="absolute -bottom-6 -left-4 w-[38%] overflow-hidden rounded-[30px] border-[7px] border-[#1d1d1f] bg-[#1d1d1f] shadow-2xl sm:-left-20">
              <Image src="/intento/iphone-list.jpg" alt="iPhone の Intento の一覧画面" width={460} height={1000} className="w-full rounded-[23px]" />
            </div>
          </div>
        </Band>

        {/* プライバシー */}
        <section className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32">
          <Heading title={["データは、", "あなたの iCloud の", "中だけに。"]}>
            開発者がやることの中身を受け取ることはありません。
          </Heading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["アカウント登録なし", "サインインも、メールアドレスの入力もいりません。"],
              ["広告もトラッキングもなし", "広告やアクセス解析の仕組みは入っていません。"],
              ["自分の iCloud で同期", "やることは端末と、あなた自身の iCloud にだけ保存されます。"],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 rounded-[28px] bg-[#F5F5F7] p-7">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-[15px] leading-[1.8] text-neutral-600">{body}</p>
              </li>
            ))}
          </ul>
          <a href={PRIVACY_URL} className="self-center text-[15px] text-[#0066CC] hover:underline">
            プライバシーポリシー ›
          </a>
        </section>

        {/* 最後の入手 */}
        <section className="flex flex-col items-center gap-6 bg-[#F5F5F7] px-6 py-24 text-center">
          <IntentoIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">Intento を、どこからでも。</h2>
          <a href={APP_STORE_URL} className="rounded-full bg-[#0071E3] px-7 py-3 text-[17px] font-medium text-white transition hover:bg-[#0077ED]">
            App Store で入手
          </a>
          <span className="text-[13px] text-neutral-500">iOS 27・iPadOS 27・macOS 27・watchOS 27・visionOS 27 以降</span>
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
          <p>このページの一部の画面は、説明のために描き直したイメージです。</p>
          <p>
            Apple、iPhone、iPad、Mac、Apple Watch、Apple Vision Pro、Siri、Spotlight、iCloud、App Store は Apple Inc. の商標です。
          </p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </div>
  );
}

function Band({ tone, children }: { tone: "gray"; children: ReactNode }) {
  return (
    <section className={tone === "gray" ? "bg-[#F5F5F7]" : undefined}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32">{children}</div>
    </section>
  );
}

/** 見出しは文節ごとに渡し、まとまりの途中で折り返さないようにする */
function Heading({ title, children }: { title: string[]; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <h2 className="text-[clamp(28px,5vw,48px)] font-bold leading-[1.2] tracking-[-0.015em] [font-feature-settings:'palt']">
        {title.map((phrase) => (
          <span key={phrase} className="inline-block">
            {phrase}
          </span>
        ))}
      </h2>
      {children && <p className="text-[clamp(16px,2vw,19px)] leading-[1.8] text-neutral-600">{children}</p>}
    </div>
  );
}

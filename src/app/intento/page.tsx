import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { AppNav, AppPage, Band, Heading, Phrases, PillLink } from "@/components/app-lp";
import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { Surfaces } from "@/components/intento/Surfaces";
import { VoiceDemo } from "@/components/intento/VoiceDemo";

/**
 * Intento（IntentTodo リポジトリの iOS / iPadOS / macOS / watchOS / visionOS アプリ）の紹介ページ。
 * 文言は App Store の説明文（IntentTodo/metadata/ios/version/<バージョン>/ja.json）とアプリのローカライズに合わせる。
 * 見出しも説明文の小見出し（声で操作する・開かずに済ませる など）をそのまま使う。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/intento/id6788623037";
const SUPPORT_URL = "/intento/support";
const PRIVACY_URL = "/intento/privacy";

export const metadata: Metadata = {
  title: "Intento — アプリを開かなくても使えるやることリスト",
  description:
    "やることの追加も、完了も、あと回しも、Siri に話しかければ終わります。ウィジェット、コントロールセンター、ロック画面、Apple Watch、Spotlight からも使えるやることリスト。",
  // 紹介画像は public/og/intento.png（ページの絵を 1200×630 で撮ったもの）
  openGraph: {
    title: "Intento",
    description: "アプリを開かなくても使える、やることリスト。",
    url: "https://www.touyou.dev/intento",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/intento.png", width: 1200, height: 630, alt: "Intento の紹介画像" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intento",
    description: "アプリを開かなくても使える、やることリスト。",
    images: ["https://www.touyou.dev/og/intento.png"],
  },
};

export default function IntentoPage() {
  return (
    <AppPage>
      <AppNav icon={<IntentoIcon className="h-6 w-6 shadow-none" />} name="Intento" home="/intento">
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
            <IntentoIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">Intento</p>
              <h1 className="text-[clamp(32px,7vw,60px)] font-bold leading-[1.2] tracking-[-0.02em] [font-feature-settings:'palt']">
                <Phrases phrases={["アプリを開かなくても", "使える、"]} />
                <br />
                やることリスト。
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                やることの追加も、完了も、あと回しも、Siri に話しかければ終わります。アプリを開くのは、じっくり見直したいときだけで構いません。
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
              <span className="text-[13px] text-neutral-500">無料・アプリ内課金なし</span>
            </div>
          </div>
          <VoiceDemo />
        </section>

        <Band tone="gray">
          <Heading title={["話しかけるだけで、", "追加も完了も。"]}>
            「Intento で〇〇を完了」のように、やることの名前をそのまま話しかけられます。あとから選び直す手間はありません。
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

        <Band>
          <Heading title={["ホーム画面からも、", "ロック画面からも。"]}>
            ウィジェット、コントロールセンター、ライブアクティビティ、Apple Watch、Spotlight。どこから触っても、同じ操作が同じように動きます。
          </Heading>
          <Surfaces />
        </Band>

        <Band tone="gray">
          <Heading title={["iPhone で足して、", "Mac で片づける。"]}>
            iPhone、iPad、Mac、Apple Watch、Apple Vision Pro に対応しています。iCloud で同期するので、どのデバイスにも同じリストがあります。
          </Heading>
          <div className="relative mx-auto w-full max-w-[440px]">
            {/* 画面の角丸は実機に近い小さめの値にして、ステータスバーが欠けないようにする */}
            <div className="rounded-[26px] bg-[#1d1d1f] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
              <Image src="/intento/ipad-list.jpg" alt="iPad の Intento の一覧画面" width={750} height={1000} className="w-full rounded-[12px]" />
            </div>
            <div className="absolute -bottom-6 -left-4 w-[38%] rounded-[28px] bg-[#1d1d1f] p-[6px] shadow-2xl sm:-left-20">
              <Image src="/intento/iphone-list.jpg" alt="iPhone の Intento の一覧画面" width={460} height={1000} className="w-full rounded-[22px]" />
            </div>
          </div>
        </Band>

        <Band>
          <Heading title={["データは、", "あなたの iCloud の", "中だけに。"]}>アカウント登録はありません。広告もトラッキングもありません。</Heading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["アカウント登録なし", "サインインも、メールアドレスの入力もいりません。"],
              ["広告もトラッキングもなし", "広告やアクセス解析の仕組みは入っていません。"],
              ["自分の iCloud で同期", "やることは端末と、あなた自身の iCloud にだけ保存されます。開発者が中身を受け取ることはありません。"],
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
        </Band>

        <section className="flex flex-col items-center gap-6 bg-[#F5F5F7] px-6 py-24 text-center">
          <IntentoIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">Intento は無料です。</h2>
          <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
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
    </AppPage>
  );
}

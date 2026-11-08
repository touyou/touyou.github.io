import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  AppNav,
  AppPage,
  Band,
  Heading,
  Phrases,
  PillLink,
  Tile,
} from "@/components/app-lp";
import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";

/**
 * Patchday（iOS / iPadOS / macOS アプリ）の紹介ページ。
 * 機能の説明はアプリの実装（Patchday リポジトリの docs/PLAN.md）に合わせる。機能を変えたらここも直す。
 */
export const metadata: Metadata = {
  title: "Patchday — 脆弱性の対応期限を、チームの手元に",
  description:
    "CISA KEV・JVN・NVD の脆弱性を対応期限のカレンダーで見て、アナウンスした・話し合えた、を記録できる iPhone・iPad・Mac アプリ。",
  // 紹介画像は public/og/patchday.png（/store/patchday-og の絵を 1200×630 で撮ったもの）
  openGraph: {
    title: "Patchday",
    description: "脆弱性の対応期限を、チームの手元に。",
    url: "https://www.touyou.dev/patchday",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "https://www.touyou.dev/og/patchday.png",
        width: 1200,
        height: 630,
        alt: "Patchday の紹介画像",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patchday",
    description: "脆弱性の対応期限を、チームの手元に。",
    images: ["https://www.touyou.dev/og/patchday.png"],
  },
};

const features = [
  {
    title: "期限のカレンダー",
    body: "KEV は CISA の期限、JVN は深刻度ごとの日数で期限を決め、カレンダーと一覧に並べます。",
  },
  {
    title: "関係あるものだけ",
    body: "ベンダーや製品をウォッチ・ミュート。詳細からその場で切り替えられます。深刻度や分類でも絞り込めます。",
  },
  {
    title: "チームの進み具合",
    body: "アナウンス済み・対応協議済みなどの状態と、日付つきのメモ。iCloud で iPhone・iPad・Mac に同期します。",
  },
  {
    title: "PC のソフトと Apple の OS も",
    body: "Chrome・Firefox・Acrobat Reader・Java、iOS・macOS・Xcode、Node.js・Git・OpenSSL などを NVD から。1 日に数十件出る製品も、製品と日ごとにまとめます。",
  },
  {
    title: "英語は端末内で日本語に",
    body: "英語の概要と求められる対応を、端末内で日本語に訳せます。機械翻訳と示し、原文にもすぐ戻せます。",
  },
  {
    title: "リリースの予定も",
    body: "Node.js のセキュリティリリースの予告、Patch Tuesday、Oracle の CPU の日を、期限とは別の印でカレンダーに出します。",
  },
  {
    title: "ウィジェットと Siri",
    body: "ホーム画面とロック画面に今週の件数。「Patchday で今週の期限」と聞けば答えます。",
  },
];

const APP_STORE_URL = "https://apps.apple.com/jp/app/id6831397385";
const MAC_APP_STORE_URL = `${APP_STORE_URL}?platform=mac`;

export default function PatchdayPage() {
  return (
    <AppPage>
      <AppNav
        icon={<PatchdayIcon className="h-6 w-6 shadow-none" />}
        name="Patchday"
        home="/patchday"
      >
        <Link href="/patchday/support" className="hover:text-neutral-900">
          サポート
        </Link>
        <Link href="/patchday/privacy" className="hover:text-neutral-900">
          プライバシー
        </Link>
        <PillLink href={APP_STORE_URL} size="sm">
          入手
        </PillLink>
      </AppNav>
      <main>
        <Band className="items-center text-center">
          <PatchdayIcon className="h-28 w-28" />
          <h1 className="text-[clamp(36px,7vw,64px)] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
            <Phrases
              phrases={["脆弱性の", "対応期限を、", "チームの手元に。"]}
            />
          </h1>
          <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.8] text-neutral-600">
            CISA KEV・JVN・NVD
            の脆弱性を、対応期限のカレンダーで。関係のある製品だけをウォッチして、アナウンスした・話し合えた、を記録できます。
          </p>
          <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
          <p className="text-sm text-neutral-500">
            iPhone・iPad・Mac 向けを配信中です（
            <a
              href={MAC_APP_STORE_URL}
              className="text-[#0066CC] underline-offset-4 hover:underline"
            >
              Mac App Store で見る
            </a>
            ）。
          </p>
        </Band>
        <Band tone="gray">
          <Heading title={["見るべきものを、", "期限の順に。"]} />
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <Tile
                key={feature.title}
                title={feature.title}
                body={feature.body}
                className="bg-white"
              />
            ))}
          </div>
        </Band>
        <Band>
          <Heading title={["カレンダーで見て、", "詳細は横に。"]}>
            iPhone ではタブで、iPad の横や Mac、開いた iPhone Duo
            ではカレンダーを広く使い、選んだ脆弱性の詳細を右に出します。
          </Heading>
          <div className="relative mx-auto w-full max-w-[760px]">
            <div className="overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
              <Image
                src="/patchday/mac-calendar.jpg"
                alt="Mac の Patchday のカレンダーと詳細"
                width={1600}
                height={993}
                className="w-full"
              />
            </div>
            <div className="absolute -bottom-8 -left-4 w-[28%] rounded-[28px] bg-[#1d1d1f] p-[6px] shadow-2xl sm:-left-16">
              <Image
                src="/patchday/iphone-calendar.jpg"
                alt="iPhone の Patchday のカレンダー"
                width={920}
                height={1998}
                className="w-full rounded-[22px]"
              />
            </div>
          </div>
        </Band>
        <Band tone="gray">
          <Heading title={["サーバーなし、", "アカウントなし。"]}>
            情報を取りに行くのは CISA・JVN・NVD と、Node.js
            のリリース予告だけ。記録はあなたの iCloud
            に保存され、開発者には送られません。
          </Heading>
          <p className="text-center text-sm text-neutral-500">
            出典: CISA Known Exploited Vulnerabilities Catalog ／ JVN・JVN
            iPedia（IPA・JPCERT/CC）／ NIST National Vulnerability Database ／
            Node.js Security Releases。Patchday は
            CISA・IPA・JPCERT/CC・NIST・OpenJS Foundation
            とは関係のない個人のアプリです。This product uses data from the NVD
            API but is not endorsed or certified by the NVD.
          </p>
        </Band>
      </main>
    </AppPage>
  );
}

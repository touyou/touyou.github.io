import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppPage, SafeAreaColor } from "@/components/app-lp";
import { CheckitoutIcon } from "@/components/checkitout/CheckitoutIcon";
import { FFIcon } from "@/components/ffmultiplier/FFIcon";
import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";
import { QuizIcon } from "@/components/programming-quiz/QuizIcon";
import { ToretaIcon } from "@/components/toreta/ToretaIcon";
import { TsukibyobuIcon } from "@/components/tsukibyobu/TsukibyobuIcon";

/**
 * 紹介記事や登壇で使える素材をまとめたページ。日本語と英語を並べ、どちらの読み手もこの 1 枚で済むようにする。
 * 紹介文は各アプリの紹介ページの説明に合わせる。MiaIdolActivity は載せない。
 */

type PressApp = {
  name: string;
  nameEn?: string;
  icon: ReactNode;
  ja: string;
  en: string;
  platforms: string;
  page: string;
  pageEn?: string;
  appStore?: string;
  googlePlay?: string;
  keyVisual: { src: string; width: number; height: number };
  appIcon?: string;
  screens?: { src: string; label: string }[];
};

const iconClass = "h-16 w-16";

/** GRAPHICA の 2 つはここにアイコンの絵を置いていないので、公式のアイコンと取り違えない頭文字の印で代える */
function InitialBadge({ letter }: { letter: string }) {
  return (
    <span aria-hidden="true" className="flex h-16 w-16 items-center justify-center rounded-[22%] bg-[#1d1d1f] text-2xl font-bold text-white">
      {letter}
    </span>
  );
}
const og = (id: string) => ({ src: `/og/${id}.png`, width: 1200, height: 630 });
/** files は [ファイル名, 画面の名前] の組。名前はダウンロードのリンクの読み上げに使う */
const shots = (dir: string, files: [string, string][]) => files.map(([f, label]) => ({ src: `/${dir}/screens/${f}.webp`, label }));

const apps: PressApp[] = [
  {
    name: "月屏風",
    nameEn: "Tsukibyobu",
    icon: <TsukibyobuIcon className={iconClass} />,
    ja: "折りたたみの iPhone をひらく角度が、そのまま月の満ち欠けになる屏風絵のアプリ。",
    en: "A folding-screen painting for iPhone. The angle you open an iPhone Duo to becomes the phase of the moon.",
    platforms: "iPhone（iOS 27 以降）",
    page: "/tsukibyobu",
    appStore: "https://apps.apple.com/jp/app/id6826440511",
    keyVisual: og("tsukibyobu"),
    appIcon: "/tsukibyobu/icon.png",
  },
  {
    name: "Patchday",
    icon: <PatchdayIcon className={iconClass} />,
    ja: "CISA KEV・JVN・NVD の脆弱性を対応期限のカレンダーで見て、CSIRT の進み具合を記録できるアプリ。",
    en: "See CISA KEV, JVN and NVD vulnerabilities on a deadline calendar, and record what your CSIRT announced and discussed.",
    platforms: "iPhone・iPad・Mac（iOS / iPadOS / macOS 27 以降）",
    page: "/patchday",
    pageEn: "/patchday/en",
    appStore: "https://apps.apple.com/jp/app/id6831397385",
    keyVisual: og("patchday"),
    appIcon: "/patchday/icon.png",
    screens: shots("patchday", [
      ["en-01-calendar", "カレンダー（英語）"],
      ["en-02-deadlines", "期限（英語）"],
      ["en-03-detail", "詳細（英語）"],
      ["ja-01-calendar", "カレンダー（日本語）"],
      ["ja-02-deadlines", "期限（日本語）"],
      ["ja-03-detail", "詳細（日本語）"],
    ]),
  },
  {
    name: "Intento",
    icon: <IntentoIcon className={iconClass} />,
    ja: "追加も完了もあと回しも、Siri に話しかければ終わる、アプリを開かなくても使えるやることリスト。",
    en: "A todo list you don't have to open. Add, complete and snooze from Siri, widgets, Control Center, Apple Watch and Spotlight.",
    platforms: "iPhone・iPad・Mac・Apple Watch・Apple Vision Pro（27 以降）",
    page: "/intento",
    pageEn: "/intento/en",
    appStore: "https://apps.apple.com/jp/app/intento/id6788623037",
    keyVisual: og("intento"),
    screens: shots("intento", [
      ["en-01-list", "一覧（英語）"],
      ["en-02-detail", "詳細（英語）"],
      ["en-03-add", "追加（英語）"],
      ["ja-01-list", "一覧（日本語）"],
      ["ja-02-detail", "詳細（日本語）"],
      ["ja-03-add", "追加（日本語）"],
    ]),
  },
  {
    name: "Toreta",
    icon: <ToretaIcon className={iconClass} />,
    ja: "トレーディングカードゲームの公式カードリストの URL を貼るだけで、持っているカードとほしいカードを記録できるアプリ。",
    en: "Paste the URL of an official trading card game card list, and keep track of the cards you have and the ones you want. The app is in Japanese.",
    platforms: "iPhone（iOS 27 以降）",
    page: "/toreta",
    appStore: "https://apps.apple.com/jp/app/id6820005190",
    keyVisual: og("toreta"),
    screens: shots("toreta", [
      ["ja-01-series", "シリーズ"],
      ["ja-02-collection", "コレクション"],
      ["ja-03-card-detail", "カードの詳細"],
      ["ja-04-trade", "トレード"],
      ["ja-05-deck", "デッキ"],
    ]),
  },
  {
    name: "GRAPHICA",
    icon: <InitialBadge letter="G" />,
    ja: "描きたい風景や質感を文章で書くと、AI がシェーダーにして作品になる、ジェネラティブアートの共有ギャラリー。",
    en: "A gallery of generative art made from words. Describe a scene or a texture, and AI turns it into a shader.",
    platforms: "Web・iPhone・iPad・Mac・Apple Vision Pro・Android",
    page: "https://graphica.touyou.dev/app",
    keyVisual: { src: "/apps/graphica-art.jpg", width: 800, height: 200 },
  },
  {
    name: "Graphica Playground",
    icon: <InitialBadge letter="P" />,
    ja: "一文から Metal シェーダーを作り、その場で調整して、SwiftUI に貼れるコードとして持ち出せるアプリ。",
    en: "Describe it. Ship it. Make a Metal shader from a sentence, tune it, and take it out as code you can paste into SwiftUI.",
    platforms: "iPhone・iPad",
    page: "https://graphica.touyou.dev/playground",
    keyVisual: { src: "/apps/playground-preview.jpg", width: 240, height: 240 },
  },
  {
    name: "チェケラ",
    nameEn: "CheckItOut",
    icon: <CheckitoutIcon className={iconClass} />,
    ja: "声や身の回りの音を録音して、16 個のパッドで鳴らせる音楽アプリ。",
    en: "Record your voice or any sound around you, and play it on 16 pads.",
    platforms: "iPhone・iPad・Android",
    page: "/checkitout",
    appStore: "https://apps.apple.com/jp/app/id1209866956",
    googlePlay: "https://play.google.com/store/apps/details?id=dev.touyou.checkitoutandroid",
    keyVisual: og("checkitout"),
    appIcon: "/checkitout/icon.png",
    screens: shots("checkitout", [
      ["ja-01-play", "演奏"],
      ["ja-02-edit", "編集"],
      ["ja-03-record", "録音"],
    ]),
  },
  {
    name: "Programming Quiz",
    icon: <QuizIcon className={iconClass} />,
    ja: "プログラミング言語の由来、iPhone アプリ開発、アルゴリズムの 3 択クイズ。好きなテーマでオンデバイス AI に問題をつくってもらうこともできます。",
    en: "Three-choice quizzes on where programming languages got their names, iPhone app development and algorithms, plus questions made by on-device AI.",
    platforms: "iPhone・iPad（iOS / iPadOS 26 以降）",
    page: "/programming-quiz",
    appStore: "https://apps.apple.com/jp/app/id1089599534",
    keyVisual: og("programming-quiz"),
    screens: shots("programming-quiz", [
      ["ja-01-home", "ジャンルを選ぶ"],
      ["ja-02-question", "問題"],
      ["ja-03-answered", "答え合わせ"],
      ["ja-04-result", "結果"],
    ]),
  },
  {
    name: "FFMultiplier",
    icon: <FFIcon className={iconClass} />,
    ja: "16 進数の掛け算に 60 秒で答えていくタイムアタックゲーム。",
    en: "A 60-second time attack of hexadecimal multiplication.",
    platforms: "iPhone（iOS 18 以降）・Android（7.0 以降）",
    page: "/ffmultiplier",
    appStore: "https://apps.apple.com/jp/app/id1151801381",
    googlePlay: "https://play.google.com/store/apps/details?id=com.dev.touyou.ffmultiplier",
    keyVisual: og("ffmultiplier"),
    appIcon: "/ffmultiplier/icon.png",
  },
];

export const viewport: Viewport = { themeColor: "#ffffff" };

export const metadata: Metadata = {
  title: "プレスキット / Press kit — touyou.dev",
  openGraph: {
    title: "プレスキット / Press kit — touyou.dev",
    description: "touyou が個人で作っているアプリの紹介文・画像・リンク。",
    url: "https://www.touyou.dev/press",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
  },
  description: "touyou が個人で作っているアプリの紹介文・画像・リンクをまとめたページです。Descriptions, images and links for apps made by touyou.",
};

const link = "text-[#0066CC] underline-offset-4 hover:underline";

function En({ children }: { children: ReactNode }) {
  return (
    <span lang="en" className="text-neutral-500">
      {children}
    </span>
  );
}

function AppEntry({ app }: { app: PressApp }) {
  const external = app.page.startsWith("http");
  return (
    <li className="flex flex-col gap-6 rounded-[28px] bg-[#F5F5F7] p-7 sm:p-8">
      <div className="flex items-start gap-5">
        <div className="shrink-0">{app.icon}</div>
        <div className="flex min-w-0 flex-col gap-1">
          <h2 className="flex flex-wrap items-baseline gap-x-2 text-2xl font-bold tracking-tight">
            {app.name}
            {app.nameEn && (
              <span lang="en" className="text-base font-medium text-neutral-500">
                {app.nameEn}
              </span>
            )}
          </h2>
          <p className="text-[13px] text-neutral-500">{app.platforms}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 text-[15px] leading-[1.8]">
        <p>{app.ja}</p>
        <p>
          <En>{app.en}</En>
        </p>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
        {external ? (
          <a href={app.page} className={link}>
            紹介ページ ›
          </a>
        ) : (
          <Link href={app.page as "/"} className={link}>
            紹介ページ ›
          </Link>
        )}
        {app.pageEn && (
          <Link href={app.pageEn as "/"} lang="en" hrefLang="en" className={link}>
            English page ›
          </Link>
        )}
        {app.appStore && (
          <a href={app.appStore} className={link}>
            App Store ›
          </a>
        )}
        {app.googlePlay && (
          <a href={app.googlePlay} className={link}>
            Google Play ›
          </a>
        )}
      </div>
      <div className="flex flex-col gap-3 border-t border-black/10 pt-5">
        <p className="text-[13px] font-semibold text-neutral-500">
          素材 <En>Assets</En>
        </p>
        <div className="flex flex-wrap items-end gap-4">
          <a href={app.keyVisual.src} download className="group flex flex-col gap-1.5">
            <Image
              src={app.keyVisual.src}
              alt={`${app.name} のキービジュアル`}
              width={app.keyVisual.width}
              height={app.keyVisual.height}
              className="h-20 w-auto rounded-lg ring-1 ring-black/10 transition group-hover:opacity-80"
            />
            <span className="text-[12px] text-neutral-500">
              キービジュアル {app.keyVisual.width}×{app.keyVisual.height}
            </span>
          </a>
          {app.appIcon && (
            <a href={app.appIcon} download className="group flex flex-col gap-1.5">
              <Image src={app.appIcon} alt={`${app.name} のアイコン`} width={80} height={80} className="h-20 w-20 rounded-[22%] transition group-hover:opacity-80" />
              <span className="text-[12px] text-neutral-500">アイコン</span>
            </a>
          )}
        </div>
        {app.screens && (
          <ul className="flex flex-wrap gap-2" aria-label={`${app.name} の画面`}>
            {app.screens.map(({ src, label }) => (
              <li key={src}>
                <a href={src} download className="block transition hover:opacity-80">
                  <Image src={src} alt={`${app.name} の画面：${label}`} width={600} height={1224} className="h-[100px] w-auto" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function PressPage() {
  return (
    <AppPage>
      <SafeAreaColor top="#ffffff" />
      <main id="main" tabIndex={-1} className="mx-auto flex w-full max-w-3xl flex-col gap-14 px-6 py-16 outline-none sm:py-24">
        <header className="flex flex-col gap-5">
          <p className="text-[13px] tracking-[0.1em] text-neutral-500">touyou.dev</p>
          <h1 className="text-[clamp(34px,6vw,48px)] font-bold leading-tight tracking-tight">
            プレスキット{" "}
            <span lang="en" className="inline-block text-neutral-500">
              Press kit
            </span>
          </h1>
          <div className="flex flex-col gap-2 text-[17px] leading-[1.8] text-neutral-700">
            <p>個人で作っているアプリの紹介文・画像・リンクをまとめました。記事や登壇での紹介に、そのまま使ってください。</p>
            <p>
              <En>Descriptions, images and links for my apps. Feel free to use them as they are when you write or talk about the apps.</En>
            </p>
          </div>
        </header>

        <section className="flex flex-col gap-5 rounded-[28px] border border-black/10 p-7 sm:flex-row sm:items-center">
          <Image src="/avatar.jpg" alt="" width={72} height={72} className="h-[72px] w-[72px] shrink-0 rounded-full" />
          <div className="flex flex-col gap-1 text-[15px] leading-[1.8]">
            <p className="text-lg font-semibold">
              touyou <span className="inline-block text-[15px] font-normal text-neutral-500">藤井陽介 / Fujii Yosuke</span>
            </p>
            <p>日本のソフトウェアエンジニア。iPhone・iPad・Mac・Android のアプリと Web サービスを個人で作っています。</p>
            <p>
              <En>An independent developer in Japan, making apps for iPhone, iPad, Mac and Android, and web services.</En>
            </p>
          </div>
        </section>

        <ul className="flex flex-col gap-6">
          {apps.map((app) => (
            <AppEntry key={app.name} app={app} />
          ))}
        </ul>

        <section className="flex flex-col gap-3 text-[15px] leading-[1.9] text-neutral-700">
          <h2 className="text-xl font-bold text-[#1d1d1f]">
            使うときのお願い <En>Guidelines</En>
          </h2>
          <ul className="list-disc pl-6">
            <li>
              画像は切り抜きや縮小をしてかまいません。アイコンの色や形は変えないでください。<En>You may crop or resize the images. Please don&apos;t change the icons.</En>
            </li>
            <li>
              高い解像度の画像や、ここにない素材が必要なときは、各アプリのサポートページからご連絡ください。
              <En>For higher-resolution images or anything else, please get in touch through each app&apos;s support page.</En>
            </li>
            <li>
              Apple、iPhone、iPad、Mac、Apple Watch、Apple Vision Pro、App Store は Apple Inc. の商標です。Google Play と Android は Google LLC の商標です。
              <En>
                Apple, iPhone, iPad, Mac, Apple Watch, Apple Vision Pro and App Store are trademarks of Apple Inc. Google Play and Android are trademarks of Google LLC.
              </En>
            </li>
          </ul>
        </section>

        <Link href="/" className={`self-start text-[15px] ${link}`}>
          touyou.dev ›
        </Link>
      </main>
    </AppPage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Phrases } from "@/components/app-lp";
import { CheckitoutIcon } from "@/components/checkitout/CheckitoutIcon";
import { CkBand, CkHeading, CkNav, CkPage, CkPillLink, CkTile, ColorBars } from "@/components/checkitout/lp";
import { DarkScreen, MiniModeControls, MiniPad, MiniPadGrid, MiniRecordPanel, SoundRow } from "@/components/checkitout/mini-ui";
import { PadDemo } from "@/components/checkitout/PadDemo";
import type { PadColor } from "@/components/checkitout/pads";
import { cn } from "@/lib/utils";

/**
 * チェケラ（CheckItOut リポジトリの iOS / iPadOS アプリ。Android 版もある）の紹介ページ。
 * 見た目はアプリに合わせる（ほぼ黒の地、光る 4 色のパッド、白い文字）。Apple の製品ページ風の app-lp の部品は使わない。
 * 機能の説明は iOS 版の実装（Checkitout/Views/ContentView.swift・RecordPanelView.swift）に合わせる。機能を変えたらここも直す。
 * Android 版のソースは手元にないので、Android 版については「ある」ことだけを書き、機能が同じとは書かない。
 * 権利の都合で、アプリに入っている声のサンプルとロゴの書体・ロゴ画像は使わない。画面はすべて HTML で描き直す。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/id1209866956";
const GOOGLE_PLAY_URL = "https://play.google.com/store/apps/details?id=dev.touyou.checkitoutandroid";
const SUPPORT_URL = "/checkitout/support";
const PRIVACY_URL = "/checkitout/privacy";

export const metadata: Metadata = {
  title: "チェケラ — すべての音が楽器になる音楽アプリ",
  description:
    "声や身の回りの音を録音して、16 個のパッドで鳴らせる音楽アプリ。みんなでつくって、みんなで楽しめます。iPhone・iPad・Android に対応。",
  // 紹介画像は public/og/checkitout.png（ページの絵を 1200×630 で撮ったもの）
  openGraph: {
    title: "チェケラ",
    description: "すべての音が、楽器になる。録音した音を 16 個のパッドで鳴らせる音楽アプリ。",
    url: "https://www.touyou.dev/checkitout",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/checkitout.png", width: 1200, height: 630, alt: "チェケラの紹介画像" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "チェケラ",
    description: "すべての音が、楽器になる。録音した音を 16 個のパッドで鳴らせる音楽アプリ。",
    images: ["https://www.touyou.dev/og/checkitout.png"],
  },
};

type Item = { title: string | string[]; body: string; color: PadColor; visual?: ReactNode };

const steps: Item[] = [
  {
    title: "1. 録音する",
    body: "「録音」を押すとパネルが開きます。REC で録り始め、STOP で止めて、PLAY で聞き直せます。名前を付けて SAVE を押すと、一覧に加わります。",
    color: "red",
    visual: <MiniRecordPanel />,
  },
  {
    title: "2. 割り当てる",
    body: "「編集」に切り替えて、一覧から音を選び、パッドを押します。そのパッドに別の音があったときは、前の音の割り当てが外れます。",
    color: "yellow",
    visual: (
      <DarkScreen className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-1">
          <SoundRow name="手拍子" pad={null} selected />
          <SoundRow name="コップ" pad={1} />
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <MiniPad
              key={i}
              color="red"
              className={i === 0 ? "border-2 ring-2 ring-white ring-offset-1 ring-offset-black" : "border-2"}
              label={i === 1 ? "コップ" : undefined}
            />
          ))}
        </div>
        <MiniModeControls mode="edit" />
      </DarkScreen>
    ),
  },
  {
    title: "3. 鳴らす",
    body: "「再生」に戻して、パッドを押せば鳴ります。パッドには、割り当てた音の名前が出ます。",
    color: "green",
    visual: (
      <DarkScreen className="w-52">
        <MiniPadGrid pressed={[0]} labels={{ 0: "手拍子", 1: "コップ" }} />
      </DarkScreen>
    ),
  },
];

const playFeatures: Item[] = [
  {
    title: ["4 色・", "16 個のパッド"],
    body: "赤・黄・緑・青の 4 色が、1 行に 4 個ずつ並びます。行ごとにリズムや声を分けておくと、どこに何があるか覚えやすくなります。",
    color: "red",
    visual: <MiniPadGrid className="w-32" />,
  },
  {
    title: ["続けて押すと、", "頭から鳴り直す"],
    body: "鳴っている途中で同じパッドを押すと、最初から鳴り直します。短い音を刻むように鳴らせます。",
    color: "yellow",
    visual: (
      <div className="flex gap-3">
        {[true, false, true].map((pressed, i) => (
          <MiniPad key={i} color="yellow" pressed={pressed} className="w-12" />
        ))}
      </div>
    ),
  },
  {
    title: ["別々のパッドは、", "重ねて鳴る"],
    body: "違うパッドを同時に押すと、音が重なって鳴ります。リズムの上に声を乗せられます。",
    color: "green",
    visual: (
      <div className="flex gap-3">
        <MiniPad color="red" pressed className="w-12" />
        <MiniPad color="green" className="w-12" />
        <MiniPad color="blue" pressed className="w-12" />
      </div>
    ),
  },
  {
    title: "スワイプで削除",
    body: "一覧の音を左にスワイプすると削除できます。録音した音は、ファイルごと端末から消えます。",
    color: "blue",
    visual: (
      <div className="flex w-48 overflow-hidden rounded-md bg-black text-[11px] ring-1 ring-white/10">
        <span className="flex flex-1 items-center justify-between gap-2 px-2 py-1.5">
          <span className="font-semibold">コップ</span>
          <span className="text-[10px] text-white/70">PAD 2</span>
        </span>
        <span className="flex items-center bg-[#FF3B30] px-3 font-semibold">削除</span>
      </div>
    ),
  },
];

const privacyPoints: Item[] = [
  { title: ["アカウント登録は", "ありません"], body: "サインインも、メールアドレスの入力もいりません。", color: "red" },
  { title: ["録音は", "端末の中に"], body: "録った音と一覧は、お使いの端末の中に保存されます。開発者に送られることはありません。", color: "green" },
  { title: ["広告も解析も", "ありません"], body: "広告やアクセス解析の仕組みは入っていません。", color: "blue" },
];

/** 端末の枠。画面の角丸は「外側の角丸 − ベゼルの太さ」にする */
function DeviceFrame({ radius, bezel, children, className }: { radius: number; bezel: number; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("w-full overflow-hidden bg-[#2A2A2C] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_30px_80px_-30px_rgba(0,0,0,0.9)]", className)}
      style={{ borderRadius: radius, padding: bezel }}
    >
      <div className="h-full overflow-hidden" style={{ borderRadius: radius - bezel }}>
        {children}
      </div>
    </div>
  );
}

export default function CheckitoutPage() {
  return (
    <CkPage>
      <CkNav icon={<CheckitoutIcon className="h-6 w-6 shadow-none" />} name="チェケラ" home="/checkitout">
        <Link href={SUPPORT_URL} className="hidden sm:inline">
          サポート
        </Link>
        <Link href={PRIVACY_URL} className="hidden sm:inline">
          プライバシー
        </Link>
        <CkPillLink href="#get" size="sm">
          入手
        </CkPillLink>
      </CkNav>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 overflow-hidden px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <CheckitoutIcon className="h-24 w-24 ring-1 ring-white/15 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-white/60">チェケラ</p>
              {/* PC 幅でも 1 行に詰めず、文節ごとに 2 行に分ける */}
              <h1 className="text-[clamp(34px,8vw,64px)] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
                <span className="block">すべての音が、</span>
                <span className="block">楽器になる。</span>
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-white/65">
                <Phrases phrases={["チェケラは、", "声や身の回りの音を", "録音して、", "16 個のパッドで", "鳴らせる音楽アプリです。"]} />
                <Phrases phrases={["みんなでつくって、", "みんなで楽しめます。"]} />
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-3">
                <CkPillLink href={APP_STORE_URL} color="blue">
                  App Store で入手
                </CkPillLink>
                <CkPillLink href={GOOGLE_PLAY_URL} color="green">
                  Google Play で入手
                </CkPillLink>
              </div>
              <span className="text-[13px] text-white/55">無料・iOS 26 以降 / Android</span>
            </div>
          </div>
          <PadDemo />
        </section>

        <CkBand tone="raised">
          <CkHeading title={["録音して、", "パッドに", "割り当てる。"]}>
            録った音は一覧に並びます。好きなパッドに割り当てれば、押すだけで鳴らせます。
          </CkHeading>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.color} className="flex">
                <CkTile title={step.title} body={step.body} color={step.color} visualHeight="h-56">
                  <div className="flex w-full max-w-[260px] justify-center">{step.visual}</div>
                </CkTile>
              </li>
            ))}
          </ol>
        </CkBand>

        <CkBand>
          <CkHeading title={["みんなで録って、", "みんなで鳴らす。"]}>
            その場にいる人の声や、机をたたく音を録って、パッドに並べれば、すぐに演奏できます。
          </CkHeading>
          <div className="grid gap-4 sm:grid-cols-2">
            {playFeatures.map((feature) => (
              <CkTile key={feature.color} title={feature.title} body={feature.body} color={feature.color} visualHeight="h-32">
                {feature.visual}
              </CkTile>
            ))}
          </div>
        </CkBand>

        <CkBand tone="raised">
          <CkHeading title={["画面の形に合わせて、", "並びが変わる。"]}>
            横長ではパッドが左に、一覧とボタンが右に並びます。縦長では上から順に並びます。iPad でウィンドウの大きさを変えたときも、その形に合わせて並べ直します。
          </CkHeading>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-end">
            <figure className="flex w-full max-w-[440px] flex-col items-center gap-3">
              <DeviceFrame radius={26} bezel={10}>
                <DarkScreen className="flex aspect-[4/3] items-center gap-3 rounded-none p-4 ring-0">
                  <MiniPadGrid className="w-1/2 shrink-0" pressed={[5]} />
                  <div className="flex min-w-0 flex-1 flex-col gap-2 self-stretch">
                    <p className="text-center text-[13px] font-bold">チェケラ</p>
                    <div className="flex flex-1 flex-col gap-1 rounded-lg bg-white/[0.06] p-1 ring-1 ring-white/10">
                      <SoundRow name="手拍子" pad={0} />
                      <SoundRow name="コップ" pad={1} />
                      <SoundRow name="おはよう" pad={null} />
                    </div>
                    <MiniModeControls mode="play" />
                  </div>
                </DarkScreen>
              </DeviceFrame>
              <figcaption className="text-sm text-white/55">横長の画面</figcaption>
            </figure>
            <figure className="flex w-[180px] flex-col items-center gap-3">
              <DeviceFrame radius={30} bezel={7}>
                {/* 下端の操作は、ホームインジケータの分だけ離す（この大きさでは 24px） */}
                <DarkScreen className="flex aspect-[9/19.5] flex-col gap-2 rounded-none px-2.5 pb-6 pt-7 ring-0">
                  <p className="text-center text-[12px] font-bold">チェケラ</p>
                  {/* 小さい図なので、パッドの名前は省く */}
                  <MiniPadGrid pressed={[5]} />
                  <div className="flex flex-col gap-1 rounded-lg bg-white/[0.06] p-1 ring-1 ring-white/10">
                    <SoundRow name="手拍子" pad={0} />
                    <SoundRow name="コップ" pad={1} />
                  </div>
                  <div className="mt-auto">
                    <MiniModeControls mode="play" />
                  </div>
                </DarkScreen>
              </DeviceFrame>
              <figcaption className="text-sm text-white/55">縦長の画面</figcaption>
            </figure>
          </div>
        </CkBand>

        <CkBand>
          <CkHeading title={["Android でも", "使えます。"]}>Google Play で Android 版を公開しています。</CkHeading>
          <div className="self-center">
            <CkPillLink href={GOOGLE_PLAY_URL} color="green">
              Google Play で入手
            </CkPillLink>
          </div>
        </CkBand>

        <CkBand tone="raised">
          <CkHeading title={["録音は、", "端末の中だけに。"]}>iPhone・iPad 版も Android 版も、録った音を端末の外へ送りません。</CkHeading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {privacyPoints.map((point) => (
              <li key={point.color} className="flex">
                <CkTile title={point.title} body={point.body} color={point.color} />
              </li>
            ))}
          </ul>
          <Link href={PRIVACY_URL} className="self-center text-[15px] text-[#4FC3F7] hover:underline">
            プライバシーポリシー ›
          </Link>
        </CkBand>

        <section id="get" className="flex scroll-mt-12 flex-col items-center gap-6 border-t border-white/[0.06] px-6 py-24 text-center">
          <CheckitoutIcon className="h-20 w-20 ring-1 ring-white/15" />
          <ColorBars />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">チェケラは無料です。</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <CkPillLink href={APP_STORE_URL} color="blue">
              App Store で入手
            </CkPillLink>
            <CkPillLink href={GOOGLE_PLAY_URL} color="green">
              Google Play で入手
            </CkPillLink>
          </div>
          <span className="text-[13px] text-white/55">
            <Phrases phrases={["iPhone・iPad", "（iOS 26・iPadOS 26 以降）", "/ Android"]} />
          </span>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-xs leading-[1.8] text-white/55">
          <div className="flex flex-wrap gap-x-5 gap-y-2 [&_a:hover]:text-white">
            <Link href={SUPPORT_URL}>サポート</Link>
            <Link href={PRIVACY_URL}>プライバシーポリシー</Link>
            <Link href="/">touyou.dev</Link>
          </div>
          <p>このページの画面は、説明のために描き直したイメージです。パッドで鳴る音はブラウザで合成したもので、アプリに入っている音とは違います。</p>
          <p>Apple、iPhone、iPad、App Store は Apple Inc. の商標です。Google Play および Google Play ロゴは Google LLC の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </CkPage>
  );
}

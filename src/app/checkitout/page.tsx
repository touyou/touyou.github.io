import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, AppPage, Band, Heading, Phrases, PillLink, Tile } from "@/components/app-lp";
import { CheckitoutIcon } from "@/components/checkitout/CheckitoutIcon";
import { DarkScreen, MiniModeControls, MiniPad, MiniPadGrid, MiniRecordPanel, SoundRow } from "@/components/checkitout/mini-ui";
import { PadDemo } from "@/components/checkitout/PadDemo";

/**
 * チェケラ（CheckItOut リポジトリの iOS / iPadOS アプリ。Android 版もある）の紹介ページ。
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
  openGraph: {
    title: "チェケラ",
    description: "すべての音が、楽器になる。録音した音を 16 個のパッドで鳴らせる音楽アプリ。",
    url: "https://touyou.dev/checkitout",
  },
};

/** 白い地のタイルの中に、アプリの暗い画面の見本を置くための枠。高さをそろえて並びの中でずれないようにする */
function Visual({ children }: { children: ReactNode }) {
  return <div className="flex h-56 w-full max-w-[260px] items-center justify-center">{children}</div>;
}

const steps: { title: string; body: string; visual: ReactNode }[] = [
  {
    title: "1. 録音する",
    body: "「録音」を押すとパネルが開きます。REC で録り始め、STOP で止めて、PLAY で聞き直せます。名前を付けて SAVE を押すと、一覧に加わります。",
    visual: <MiniRecordPanel />,
  },
  {
    title: "2. 割り当てる",
    body: "「編集」に切り替えて、一覧から音を選び、パッドを押します。そのパッドに別の音があったときは、前の音の割り当てが外れます。",
    visual: (
      <DarkScreen className="flex w-full flex-col gap-2">
        <div className="flex flex-col gap-1">
          <SoundRow name="手拍子" pad={null} selected />
          <SoundRow name="コップ" pad={1} />
        </div>
        <div className="grid grid-cols-4 gap-1">
          {(["red", "red", "red", "red"] as const).map((color, i) => (
            <MiniPad
              key={i}
              color={color}
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
    visual: (
      <DarkScreen className="w-52">
        <MiniPadGrid pressed={[0]} labels={{ 0: "手拍子", 1: "コップ" }} />
      </DarkScreen>
    ),
  },
];

const playFeatures: { title: string; body: string; visual: ReactNode }[] = [
  {
    title: "4 色・16 個のパッド",
    body: "赤・黄・緑・青の 4 色が、1 行に 4 個ずつ並びます。行ごとにリズムや声を分けておくと、どこに何があるか覚えやすくなります。",
    visual: <MiniPadGrid className="w-32" />,
  },
  {
    title: "続けて押すと、頭から",
    body: "鳴っている途中で同じパッドを押すと、最初から鳴り直します。短い音を刻むように鳴らせます。",
    visual: (
      <div className="flex gap-2">
        {[true, false, true].map((pressed, i) => (
          <MiniPad key={i} color="yellow" pressed={pressed} className="w-12" />
        ))}
      </div>
    ),
  },
  {
    title: "別々のパッドは、重ねて",
    body: "違うパッドを同時に押すと、音が重なって鳴ります。リズムの上に声を乗せられます。",
    visual: (
      <div className="flex gap-2">
        <MiniPad color="red" pressed className="w-12" />
        <MiniPad color="green" className="w-12" />
        <MiniPad color="blue" pressed className="w-12" />
      </div>
    ),
  },
  {
    title: "スワイプで削除",
    body: "一覧の音を左にスワイプすると削除できます。録音した音は、ファイルごと端末から消えます。",
    visual: (
      <div className="flex w-48 overflow-hidden rounded-md text-[11px] text-white" style={{ background: "#0B0B0B" }}>
        <span className="flex flex-1 items-center justify-between gap-2 px-2 py-1.5">
          <span className="font-semibold">コップ</span>
          <span className="text-[10px] text-white/70">PAD 2</span>
        </span>
        <span className="flex items-center bg-[#FF3B30] px-3 font-semibold">削除</span>
      </div>
    ),
  },
];

const privacyPoints = [
  ["アカウント登録はありません", "サインインも、メールアドレスの入力もいりません。"],
  ["録音は端末の中に", "録った音と一覧は iPhone・iPad の中に保存されます。開発者に送られることはありません。"],
  ["広告も解析もありません", "広告やアクセス解析の仕組みは入っていません。"],
];

export default function CheckitoutPage() {
  return (
    <AppPage>
      <AppNav icon={<CheckitoutIcon className="h-6 w-6 shadow-none" />} name="チェケラ" home="/checkitout">
        <Link href={SUPPORT_URL} className="hidden hover:text-neutral-900 sm:inline">
          サポート
        </Link>
        <Link href={PRIVACY_URL} className="hidden hover:text-neutral-900 sm:inline">
          プライバシー
        </Link>
        <PillLink href="#get" size="sm">
          入手
        </PillLink>
      </AppNav>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 overflow-hidden px-6 pb-24 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <CheckitoutIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-4">
              <p className="text-xl font-semibold text-neutral-500">チェケラ</p>
              <h1 className="text-[clamp(34px,8vw,64px)] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
                <Phrases phrases={["すべての音が、", "楽器になる。"]} />
              </h1>
              <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.7] text-neutral-600">
                チェケラは、声や身の回りの音を録音して、16 個のパッドで鳴らせる音楽アプリです。みんなでつくって、みんなで楽しめます。
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-3">
                <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
                <PillLink href={GOOGLE_PLAY_URL}>Google Play で入手</PillLink>
              </div>
              <span className="text-[13px] text-neutral-500">無料・iOS 26 以降 / Android</span>
            </div>
          </div>
          <PadDemo />
        </section>

        <Band tone="gray">
          <Heading title={["録音して、", "パッドに", "割り当てる。"]}>
            録った音は一覧に並びます。好きなパッドに割り当てれば、押すだけで鳴らせます。
          </Heading>
          <ol className="grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.title} className="flex">
                <Tile title={step.title} body={step.body} className="w-full bg-white">
                  <Visual>{step.visual}</Visual>
                </Tile>
              </li>
            ))}
          </ol>
        </Band>

        <Band>
          <Heading title={["みんなで録って、", "みんなで鳴らす。"]}>
            その場にいる人の声や、机をたたく音、コップを鳴らす音。録った音をパッドに並べれば、すぐに演奏できます。
          </Heading>
          <div className="grid gap-4 sm:grid-cols-2">
            {playFeatures.map((feature) => (
              <Tile key={feature.title} title={feature.title} body={feature.body}>
                {/* 図の高さをそろえて、並びの中で上下にずれないようにする */}
                <div className="flex h-32 items-center justify-center">{feature.visual}</div>
              </Tile>
            ))}
          </div>
        </Band>

        <Band tone="gray">
          <Heading title={["縦でも横でも、", "iPad でも。"]}>
            画面の形に合わせて、並び方が変わります。横長ではパッドが左、一覧とボタンが右に。縦長では上から順に並びます。iPad でウィンドウの大きさを変えたときも、その形に合わせて並べ直します。
          </Heading>
          <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-end">
            <figure className="flex w-full max-w-[440px] flex-col items-center gap-3">
              <div className="w-full rounded-[26px] bg-[#1d1d1f] p-2.5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
                <DarkScreen className="flex aspect-[4/3] items-center gap-3 rounded-[16px] p-4">
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
              </div>
              <figcaption className="text-sm text-neutral-500">横長の画面</figcaption>
            </figure>
            <figure className="flex w-[180px] flex-col items-center gap-3">
              <div className="w-full rounded-[30px] bg-[#1d1d1f] p-[7px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]">
                <DarkScreen className="flex aspect-[9/19.5] flex-col gap-2 rounded-[23px] px-2.5 pb-4 pt-7">
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
              </div>
              <figcaption className="text-sm text-neutral-500">縦長の画面</figcaption>
            </figure>
          </div>
        </Band>

        <Band>
          <Heading title={["Android でも", "使えます。"]}>Google Play で Android 版を公開しています。</Heading>
          <div className="self-center">
            <PillLink href={GOOGLE_PLAY_URL}>Google Play で入手</PillLink>
          </div>
        </Band>

        <Band tone="gray">
          <Heading title={["録音は、", "端末の中だけに。"]}>iPhone・iPad 版は、録った音を端末の外へ送りません。</Heading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {privacyPoints.map(([title, body]) => (
              <li key={title} className="flex">
                <Tile title={title} body={body} className="w-full bg-white" />
              </li>
            ))}
          </ul>
          <Link href={PRIVACY_URL} className="self-center text-[15px] text-[#0066CC] hover:underline">
            プライバシーポリシー ›
          </Link>
        </Band>

        <section id="get" className="flex scroll-mt-12 flex-col items-center gap-6 px-6 py-24 text-center">
          <CheckitoutIcon className="h-20 w-20" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">チェケラは無料です。</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <PillLink href={APP_STORE_URL}>App Store で入手</PillLink>
            <PillLink href={GOOGLE_PLAY_URL}>Google Play で入手</PillLink>
          </div>
          <span className="text-[13px] text-neutral-500">iPhone・iPad（iOS 26・iPadOS 26 以降）/ Android</span>
        </section>
      </main>

      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={SUPPORT_URL} className="hover:text-neutral-900">
              サポート
            </Link>
            <Link href={PRIVACY_URL} className="hover:text-neutral-900">
              プライバシーポリシー
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              touyou.dev
            </Link>
          </div>
          <p>このページの画面は、説明のために描き直したイメージです。パッドで鳴る音はブラウザで合成したもので、アプリに入っている音とは違います。</p>
          <p>Apple、iPhone、iPad、App Store は Apple Inc. の商標です。Google Play および Google Play ロゴは Google LLC の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </AppPage>
  );
}

"use client";

import type { CSSProperties, ReactNode } from "react";

import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { ControlPad, LockScreen, SHORTCUT_ACTIONS, ShortcutsCount, WatchFace, WidgetCard } from "@/components/intento/Surfaces";
import { SiriBubble } from "@/components/intento/VoiceDemo";

import { cn } from "@/lib/utils";

/**
 * App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 紹介ページと同じ部品を使い、ストアで横に並べたときに帯や部品が隣の画像へ流れて見えるようにする。
 * 撮って 1 枚ずつに切るのは scripts/store-screenshots.sh。iPhone は 1 枚 440×956 を 3 倍で 1320×2868（6.9"）、
 * iPad は 1 枚 1032×1376 を 2 倍で 2064×2752（13"）。iPad は横に広いので配置を別に持つ。
 * アプリの画面は実機のスクショだけを使い、手で描くのはウィジェットや吹き出しなどの部品に限る。
 */

const FRAMES = 6;
// Duo は iPad と同じ幅で描き、撮るときの倍率で 2007×2853（内画面）/ 1398×2034（外画面）に合わせる
const FRAME = {
  iphone: { w: 440, h: 956 },
  ipad: { w: 1032, h: 1376 },
  duoInner: { w: 1032, h: 1467 },
  duoOuter: { w: 1032, h: 1501 },
} as const;
export type StoreDevice = keyof typeof FRAME;

export type Lang = "ja" | "en";

/** 実機のスクショ（IntentTodo の scripts/capture_screenshots.sh の出力）の公開パス */
export type Shots = { iphoneList: string; iphoneDetail: string; ipadList: string; ipadDetail: string; watchList: string; duoList?: string; duoDetail?: string };

const COPY: Record<Lang, { titles: string[][]; phrases: string[]; widgetTodos: string[]; widgetHeader: string; left: (n: number) => string; remaining: string; actionsNote: string; actions: string[]; quote: (text: string) => string }> = {
  ja: {
    titles: [
      ["アプリを開かなくても", "使える、やることリスト。"],
      ["話しかけるだけで、", "追加も完了も。"],
      ["ホーム画面からも、", "ロック画面からも。"],
      ["コントロールセンターや", "Apple Watch からも。"],
      ["25 のアクションで、", "ショートカットに。"],
      ["iPhone でも iPad でも、", "同じリストで。"],
    ],
    phrases: ["Intento でやることを追加", "Intento で歯医者を予約するを完了", "Intento の会場からのメールに返信するにスターを付ける", "Intento のやることは何件"],
    widgetTodos: ["登壇のリハーサルをする", "1.0 のビルドを提出する", "歯医者を予約する"],
    widgetHeader: "やること",
    left: (n) => `残り ${n}`,
    remaining: "未完了",
    actionsNote: "ほかのアプリと組み合わせて自動化",
    actions: SHORTCUT_ACTIONS,
    quote: (text) => `「${text}」`,
  },
  en: {
    titles: [
      ["The to-do list", "you don't have to open."],
      ["Just say it.", "Add it, check it off."],
      ["On your Home Screen.", "On your Lock Screen."],
      ["From Control Center", "and Apple Watch."],
      ["25 actions,", "ready for Shortcuts."],
      ["iPhone or iPad,", "the same list."],
    ],
    phrases: ["Add a todo in Intento", "Complete Book the dentist in Intento", "Star Reply to the venue in Intento", "How many todos in Intento"],
    widgetTodos: ["Rehearse the talk", "Submit the 1.0 build", "Book the dentist"],
    widgetHeader: "To Do",
    left: (n) => `${n} left`,
    remaining: "Remaining",
    actionsNote: "Automate with any other app",
    // アプリの英語ローカライズ（ショートカット App に出る名前）に合わせる
    actions: [
      "Add Todo",
      "Toggle Todo Completion",
      "Snooze Todo",
      "Toggle Favorite",
      "Show Todos",
      "Search Todos and Categories",
      "Complete Todos",
      "Show Todo Count",
      "Get Todo Summary",
      "Update Todo",
      "Reorder Todos",
      "Create List",
    ],
    quote: (text) => `“${text}”`,
  },
};

/** 帯の中のある位置に置く。x は帯の左端からの距離なので、画像の境目をまたいで置ける */
// zoom は iPad で iPhone 用の部品を大きく見せるため。位置と幅は zoom 前の値で書く
export function At({ x, y, w, rotate = 0, z, zoom, children, className }: { x: number; y: number; w?: number; rotate?: number; z?: number; zoom?: number; children: ReactNode; className?: string }) {
  const k = zoom ?? 1;
  const style: CSSProperties = { left: x / k, top: y / k, width: w && w / k, transform: rotate ? `rotate(${rotate}deg)` : undefined, zIndex: z, zoom };
  return (
    <div className={cn("absolute", className)} style={style}>
      {children}
    </div>
  );
}

/** 実機のスクショを端末の枠に入れる。縮小で潰れないよう next/image を通さない。角丸は幅に比例させる */
export function Device({ src, kind, width }: { src: string; kind: "iphone" | "ipad"; width: number }) {
  // 実機の画面の角丸は iPhone で幅の約 12%、iPad で約 4%
  const pad = kind === "iphone" ? Math.max(4, width * 0.022) : width * 0.035;
  const inner = width * (kind === "iphone" ? 0.12 : 0.04);
  return (
    <div className="bg-[#1d1d1f] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]" style={{ width, padding: pad, borderRadius: inner + pad }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="block w-full" style={{ borderRadius: inner }} />
    </div>
  );
}

const IPAD_TITLE = { size: 64, top: 150, inset: 72 };
const TITLE = { iphone: { size: 34, top: 92, inset: 28 }, ipad: IPAD_TITLE, duoInner: IPAD_TITLE, duoOuter: IPAD_TITLE } as const;

function Title({ device, index, lines }: { device: StoreDevice; index: number; lines: string[] }) {
  const { size, top, inset } = TITLE[device];
  const { w } = FRAME[device];
  return (
    <h2
      className="absolute z-30 font-bold leading-[1.2] tracking-[-0.015em] [font-feature-settings:'palt']"
      style={{ left: index * w + inset, top, width: w - inset * 2, fontSize: size }}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

/** Siri の色をぼかして帯全体に流す。どの画像にも少しずつかかるので、並べると 1 本の流れに見える */
function Aurora({ device }: { device: StoreDevice }) {
  // 位置は iPhone の帯で決めたものを、端末の帯の大きさに引き伸ばす
  const sx = FRAME[device].w / FRAME.iphone.w;
  const sy = FRAME[device].h / FRAME.iphone.h;
  const blobs = [
    { x: 260, y: 640, r: 260, c: "#5AC8FA" },
    { x: 760, y: 520, r: 240, c: "#AF52DE" },
    { x: 1180, y: 700, r: 260, c: "#FF9500" },
    { x: 1640, y: 560, r: 250, c: "#5AC8FA" },
    { x: 2100, y: 700, r: 260, c: "#FF2D55" },
    { x: 2520, y: 560, r: 240, c: "#AF52DE" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b) => (
        <span
          key={b.x}
          className="absolute rounded-full opacity-[0.22] blur-[70px]"
          style={{ left: (b.x - b.r) * sx, top: (b.y - b.r * 0.6) * sy, width: b.r * 2 * sx, height: b.r * 1.2 * sy, background: b.c }}
        />
      ))}
    </div>
  );
}

export function IntentoStoreStrip({ device, lang, shots }: { device: StoreDevice; lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  const { w, h } = FRAME[device];
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang={lang}
      className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFD] to-[#EDEDF2] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w * FRAMES, height: h }}
    >
      {/* 開発サーバーのインジケータを写さない */}
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <Aurora device={device} />
      {device === "iphone" ? <IphoneScene lang={lang} shots={shots} /> : <IpadScene device={device} lang={lang} shots={shots} />}
      {t.titles.map((lines, i) => (
        <Title key={i} device={device} index={i} lines={lines} />
      ))}
    </div>
  );
}

/** ショートカットのアクション名を斜めの列にして、その画像の中だけに流す */
function ActionRows({ actions, left, device, top, zoom = 1 }: { actions: string[]; left: number; device: StoreDevice; top: number; zoom?: number }) {
  const { w, h } = FRAME[device];
  return (
    <div className="absolute overflow-hidden" style={{ left, top: 0, width: w, height: h }}>
      <div className="absolute flex flex-col gap-3" style={{ left: -120 / zoom, top: top / zoom, width: (w + 320) / zoom, transform: "rotate(-8deg)", zoom }}>
        {[0, 4, 8, 2].map((offset, row) => (
          <div key={row} className="flex gap-2" style={{ marginLeft: row * -46 }}>
            {[...actions.slice(offset), ...actions.slice(0, offset)].slice(0, 6).map((action) => (
              <span key={action} className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-[14px] font-medium shadow-sm ring-1 ring-black/5">
                {action}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function IphoneScene({ lang, shots }: { lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  return (
    <>

      {/* 1. 表紙: アイコンとアプリ名は 1 枚目だけ */}
      <At x={28} y={40} className="flex items-center gap-2.5">
        <IntentoIcon className="h-9 w-9 shadow-none" />
        <span className="text-[17px] font-semibold text-neutral-500">Intento</span>
      </At>
      <At x={96} y={262} w={316} rotate={-3} z={10}>
        <Device src={shots.iphoneList} kind="iphone" width={316} />
      </At>
      <At x={22} y={300} z={20} rotate={-4}>
        <SiriBubble className="max-w-[250px] shadow-xl">{t.quote(t.phrases[0])}</SiriBubble>
      </At>

      {/* 2. 声: 話しかけた言葉が、ジグザグに流れていく */}
      <At x={440 + 24} y={250} rotate={-3} z={10}>
        <SiriBubble className="max-w-[370px]">{t.quote(t.phrases[1])}</SiriBubble>
      </At>
      <At x={440 + 118} y={360} w={290} rotate={4} z={9}>
        <WidgetCard todos={t.widgetTodos} done={[false, false, true]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none" />
      </At>
      <At x={440 + 30} y={560} rotate={2} z={10}>
        <SiriBubble className="max-w-[330px]">{t.quote(t.phrases[2])}</SiriBubble>
      </At>
      <At x={440 + 104} y={680} w={316} rotate={-2} z={8}>
        <Device src={shots.iphoneDetail} kind="iphone" width={316} />
      </At>

      {/* 3. ホーム画面とロック画面。ロック画面は次の画像へはみ出す */}
      <At x={880 + 24} y={262} w={330} rotate={-4} z={10}>
        <WidgetCard todos={t.widgetTodos} done={[false, true, false]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]" />
      </At>
      <At x={880 + 96} y={480} w={316} rotate={6} z={9}>
        <LockScreen state="active" lang={lang} className="max-w-none pb-6 pt-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]" />
      </At>

      {/* 4. コントロールセンターと Apple Watch */}
      <At x={1320 + 50} y={300} rotate={-5} z={9} className="rounded-[40px] bg-[#1d1d1f]/90 p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]">
        <ControlPad count={2} remainingLabel={t.remaining} />
      </At>
      <At x={1320 + 200} y={560} rotate={6} z={10}>
        <WatchFace src={shots.watchList} className="scale-[1.15]" />
      </At>

      {/* 5. 25 のアクション。名前の列を斜めに流す */}
      <At x={1760 + 24} y={190} z={10}>
        <ShortcutsCount className="text-[190px]" />
      </At>
      <At x={1760 + 32} y={430} z={10} className="text-[16px] text-neutral-500">
        {t.actionsNote}
      </At>
      <ActionRows actions={t.actions} left={1760} device="iphone" top={500} />

      {/* 6. iPad と iPhone */}
      <At x={2200 + 70} y={280} w={340} rotate={3} z={9}>
        <Device src={shots.ipadList} kind="ipad" width={340} />
      </At>
      <At x={2200 + 30} y={520} w={170} rotate={-5} z={10}>
        <Device src={shots.iphoneList} kind="iphone" width={170} />
      </At>
    </>
  );
}

/** iPad の 6 枚。iPhone と同じ流れで、部品は zoom で大きくし、画面は iPad の実機スクショを使う */
// Duo も縦横比が iPad に近いので同じ配置を使い、主役の画面だけ Duo のスクショに替える
function IpadScene({ device, lang, shots }: { device: Exclude<StoreDevice, "iphone">; lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  const list = device === "ipad" ? shots.ipadList : shots.duoList!;
  const detail = device === "ipad" ? shots.ipadDetail : shots.duoDetail!;
  const W = FRAME.ipad.w;
  return (
    <>
      {/* 1. 表紙 */}
      <At x={72} y={64} className="flex items-center gap-4">
        <IntentoIcon className="h-14 w-14 shadow-none" />
        <span className="text-[28px] font-semibold text-neutral-500">Intento</span>
      </At>
      <At x={160} y={420} w={800} rotate={-3} z={10}>
        <Device src={list} kind="ipad" width={800} />
      </At>
      <At x={56} y={480} z={20} rotate={-4} zoom={1.8}>
        <SiriBubble className="max-w-[250px] shadow-xl">{t.quote(t.phrases[0])}</SiriBubble>
      </At>

      {/* 2. 声 */}
      <At x={W + 64} y={380} rotate={-3} z={10} zoom={1.8}>
        <SiriBubble className="max-w-[420px]">{t.quote(t.phrases[1])}</SiriBubble>
      </At>
      <At x={W + 480} y={520} w={470} rotate={4} z={9} zoom={1.6}>
        <WidgetCard todos={t.widgetTodos} done={[false, false, true]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none" />
      </At>
      <At x={W + 72} y={780} rotate={2} z={10} zoom={1.8}>
        <SiriBubble className="max-w-[300px]">{t.quote(t.phrases[2])}</SiriBubble>
      </At>
      <At x={W + 300} y={960} w={680} rotate={-2} z={8}>
        <Device src={detail} kind="ipad" width={680} />
      </At>

      {/* 3. ホーム画面とロック画面 */}
      <At x={2 * W + 80} y={400} w={560} rotate={-4} z={10} zoom={1.7}>
        <WidgetCard todos={t.widgetTodos} done={[false, true, false]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]" />
      </At>
      <At x={2 * W + 440} y={700} w={520} rotate={6} z={9} zoom={1.65}>
        <LockScreen state="active" lang={lang} className="max-w-none pb-6 pt-14 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]" />
      </At>

      {/* 4. コントロールセンターと Apple Watch */}
      <At x={3 * W + 110} y={440} rotate={-5} z={9} zoom={1.7} className="rounded-[40px] bg-[#1d1d1f]/90 p-7 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.5)]">
        <ControlPad count={2} remainingLabel={t.remaining} />
      </At>
      <At x={3 * W + 540} y={760} rotate={6} z={10} zoom={1.8}>
        <WatchFace src={shots.watchList} className="scale-[1.15]" />
      </At>

      {/* 5. 25 のアクション */}
      <At x={4 * W + 64} y={330} z={10}>
        <ShortcutsCount className="text-[360px]" />
      </At>
      <At x={4 * W + 80} y={770} z={10} className="text-[28px] text-neutral-500">
        {t.actionsNote}
      </At>
      <ActionRows actions={t.actions} left={4 * W} device={device} top={900} zoom={1.7} />

      {/* 6. iPad と iPhone */}
      <At x={5 * W + 210} y={430} w={720} rotate={3} z={9}>
        <Device src={shots.ipadList} kind="ipad" width={720} />
      </At>
      <At x={5 * W + 70} y={720} w={300} rotate={-5} z={10}>
        <Device src={shots.iphoneList} kind="iphone" width={300} />
      </At>
    </>
  );
}

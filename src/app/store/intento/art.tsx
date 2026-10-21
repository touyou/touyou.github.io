"use client";

import { WidgetCard } from "@/components/intento/Surfaces";
import { SiriBubble } from "@/components/intento/VoiceDemo";

import { At, Device, type Lang, type Shots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * 安全領域が公開されていないので、見せたいものは中央に寄せ、端は背景だけにする。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;

const COPY: Record<Lang, { phrase: string; quote: string; widgetTodos: string[]; widgetHeader: string; left: (n: number) => string }> = {
  ja: {
    phrase: "話しかけるだけで、片づく。",
    quote: "「Intento でやることを追加」",
    widgetTodos: ["登壇のリハーサルをする", "1.0 のビルドを提出する", "歯医者を予約する"],
    widgetHeader: "やること",
    left: (n) => `残り ${n}`,
  },
  en: {
    phrase: "Just say it. It's done.",
    quote: "“Add a todo in Intento”",
    widgetTodos: ["Rehearse the talk", "Submit the 1.0 build", "Book the dentist"],
    widgetHeader: "To Do",
    left: (n) => `${n} left`,
  },
};

function Glow({ w, h }: { w: number; h: number }) {
  const blobs = [
    { x: 0.22, y: 0.7, c: "#5AC8FA" },
    { x: 0.5, y: 0.55, c: "#AF52DE" },
    { x: 0.78, y: 0.72, c: "#FF9500" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b) => (
        <span
          key={b.x}
          className="absolute rounded-full opacity-[0.24] blur-[110px]"
          style={{ left: (b.x - 0.2) * w, top: (b.y - 0.25) * h, width: 0.4 * w, height: 0.5 * h, background: b.c }}
        />
      ))}
    </div>
  );
}

export function IntentoStoreArt({ kind, lang, shots }: { kind: ArtKind; lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang={lang}
      className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFD] to-[#EDEDF2] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w, height: h }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <Glow w={w} h={h} />
      {kind === "header" ? <HeaderScene t={t} shots={shots} /> : <SearchScene t={t} shots={shots} />}
    </div>
  );
}

/** ヘッダー: 見出しを上に置き、iPad・iPhone・吹き出し・ウィジェットを中央に寄せて下へはみ出させる */
function HeaderScene({ t, shots }: { t: (typeof COPY)[Lang]; shots: Shots }) {
  return (
    <>
      <At x={0} y={84} w={1920} z={30} className="text-center text-[64px] font-bold leading-none tracking-[-0.015em] [font-feature-settings:'palt']">
        {t.phrase}
      </At>
      <At x={700} y={230} w={600} rotate={-2} z={9}>
        <Device src={shots.ipadList} kind="ipad" width={600} />
      </At>
      <At x={520} y={300} w={250} rotate={-6} z={10}>
        <Device src={shots.iphoneList} kind="iphone" width={250} />
      </At>
      <At x={430} y={330} z={20} rotate={-4} zoom={1.4}>
        <SiriBubble className="max-w-[260px] shadow-xl">{t.quote}</SiriBubble>
      </At>
      <At x={1180} y={420} w={420} rotate={5} z={11} zoom={1.3}>
        <WidgetCard todos={t.widgetTodos} done={[false, true, false]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]" />
      </At>
    </>
  );
}

/** 検索結果: 左に見出し、右に画面。アイコンとアプリ名はストアが横に出すので描かない */
function SearchScene({ t, shots }: { t: (typeof COPY)[Lang]; shots: Shots }) {
  return (
    <>
      <At x={150} y={260} w={760} z={30} className="text-[88px] font-bold leading-[1.15] tracking-[-0.015em] [font-feature-settings:'palt']">
        {t.phrase}
      </At>
      <At x={150} y={600} z={20} rotate={-3} zoom={1.7}>
        <SiriBubble className="max-w-[300px] shadow-xl">{t.quote}</SiriBubble>
      </At>
      <At x={1020} y={200} w={430} rotate={-4} z={10}>
        <Device src={shots.iphoneList} kind="iphone" width={430} />
      </At>
      <At x={1380} y={520} w={420} rotate={5} z={11} zoom={1.3}>
        <WidgetCard todos={t.widgetTodos} done={[false, true, false]} header={t.widgetHeader} leftLabel={t.left} className="max-w-none shadow-[0_30px_60px_-20px_rgba(0,0,0,0.3)]" />
      </At>
    </>
  );
}

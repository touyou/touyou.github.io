"use client";

import { SiriBubble } from "@/components/intento/VoiceDemo";
import { CheckCircle } from "@/components/intento/todo-ui";

import { At, type Lang } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * アプリの画面はスクショ欄で見られるので、ここは LP の見出しと Siri の言葉で絵を作り、画面は使わない。
 * 安全領域が公開されていないので、見出しは中央に寄せ、端は背景と飾りだけにする。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;

type Copy = { headline: string[]; voice: string[]; sub: string; phrases: string[] };

const COPY: Record<Lang, Copy> = {
  ja: {
    headline: ["アプリを開かなくても", "使える、やることリスト。"],
    voice: ["話しかけるだけで、", "片づく。"],
    sub: "追加も、完了も、あと回しも。",
    phrases: [
      "Intento でやることを追加",
      "Intento で歯医者を予約するを完了",
      "Intento の登壇のリハーサルをスヌーズ",
      "Intento のやることは何件",
      "Intento で一番急ぎのやることを完了",
      "Intento の会場からのメールに返信するにスターを付ける",
    ],
  },
  en: {
    headline: ["A to-do list you can use", "without opening the app."],
    voice: ["Just say it.", "It's done."],
    sub: "Add, complete, or snooze.",
    phrases: [
      "Add a todo in Intento",
      "Complete Book the dentist in Intento",
      "Snooze Rehearse the talk in Intento",
      "How many todos in Intento",
      "Complete the most urgent todo in Intento",
      "Star Reply to the venue in Intento",
    ],
  },
};

const quote = (lang: Lang, text: string) => (lang === "ja" ? `「${text}」` : `“${text}”`);

/** Siri の色をぼかした光と、その色の大きな輪。輪が画面の中央をくくり、言葉がそこへ集まって見える */
function SiriField({ w, h, cx, cy, r }: { w: number; h: number; cx: number; cy: number; r: number }) {
  const blobs = [
    { x: cx - r * 0.9, y: cy + r * 0.2, c: "#5AC8FA" },
    { x: cx, y: cy - r * 0.3, c: "#AF52DE" },
    { x: cx + r * 0.9, y: cy + r * 0.25, c: "#FF9500" },
    { x: cx + r * 0.3, y: cy + r * 0.7, c: "#FF2D55" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden style={{ width: w, height: h }}>
      {blobs.map((b) => (
        <span
          key={b.c}
          className="absolute rounded-full opacity-[0.28] blur-[120px]"
          style={{ left: b.x - r * 0.6, top: b.y - r * 0.5, width: r * 1.2, height: r, background: b.c }}
        />
      ))}
      <span
        className="absolute rounded-full opacity-70 blur-[1px]"
        style={{
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          background: "conic-gradient(from 200deg, #5AC8FA, #AF52DE, #FF2D55, #FF9500, #5AC8FA)",
          mask: "radial-gradient(circle closest-side, transparent 0, transparent calc(100% - 10px), #000 calc(100% - 9px))",
          WebkitMask: "radial-gradient(circle closest-side, transparent 0, transparent calc(100% - 10px), #000 calc(100% - 9px))",
        }}
      />
    </div>
  );
}

/** 話しかけた言葉。終わったものには緑のチェックが付く */
function Phrase({ lang, text, done, zoom }: { lang: Lang; text: string; done?: boolean; zoom: number }) {
  return (
    <div className="flex items-center gap-3" style={{ zoom }}>
      <SiriBubble className="max-w-none whitespace-nowrap shadow-xl [&>div]:line-clamp-none">{quote(lang, text)}</SiriBubble>
      {done && <CheckCircle done className="h-9 w-9 shadow-lg" />}
    </div>
  );
}

function Headline({ lines, size, className }: { lines: string[]; size: number; className?: string }) {
  return (
    <h1 className={`font-bold leading-[1.18] tracking-[-0.02em] [font-feature-settings:'palt'] ${className ?? ""}`} style={{ fontSize: size }}>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h1>
  );
}

export function IntentoStoreArt({ kind, lang }: { kind: ArtKind; lang: Lang }) {
  const t = COPY[lang];
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang={lang}
      className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFD] to-[#EEEEF3] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w, height: h }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      {kind === "header" ? <HeaderScene t={t} lang={lang} /> : <SearchScene t={t} lang={lang} />}
    </div>
  );
}

/** ヘッダー: 中央に LP と同じ見出し、それを輪がくくり、左右から話しかけた言葉が流れ込む */
function HeaderScene({ t, lang }: { t: Copy; lang: Lang }) {
  const { w, h } = ART.header;
  const ja = lang === "ja";
  return (
    <>
      <SiriField w={w} h={h} cx={w / 2} cy={h / 2 + 10} r={330} />
      <At x={0} y={ja ? 300 : 305} w={w} z={30} className="text-center">
        <Headline lines={t.headline} size={ja ? 84 : 76} />
      </At>
      {/* 左右の言葉は端で切れてよい。中央の見出しには掛けない */}
      <At x={-60} y={110} rotate={-6} z={20}>
        <Phrase lang={lang} text={t.phrases[0]} zoom={1.5} />
      </At>
      <At x={90} y={560} rotate={4} z={20}>
        <Phrase lang={lang} text={t.phrases[1]} done zoom={1.4} />
      </At>
      <At x={1330} y={130} rotate={5} z={20}>
        <Phrase lang={lang} text={t.phrases[2]} zoom={1.4} />
      </At>
      <At x={1290} y={590} rotate={-4} z={20}>
        <Phrase lang={lang} text={t.phrases[4]} done zoom={1.5} />
      </At>
    </>
  );
}

/** 検索結果: 左に声の見出し、右に言葉が上から順に片づいていく列 */
function SearchScene({ t, lang }: { t: Copy; lang: Lang }) {
  const { w, h } = ART.search;
  const ja = lang === "ja";
  const column = [
    { text: t.phrases[0], done: true, x: 1010, rotate: -3 },
    { text: t.phrases[1], done: true, x: 1080, rotate: 2 },
    { text: t.phrases[2], done: true, x: 990, rotate: -2 },
    { text: t.phrases[3], done: false, x: 1110, rotate: 3 },
  ];
  return (
    <>
      <SiriField w={w} h={h} cx={1380} cy={640} r={470} />
      <At x={120} y={ja ? 420 : 400} w={960} z={30}>
        <Headline lines={t.voice} size={ja ? 102 : 124} />
        <p className="mt-8 text-[40px] font-semibold text-neutral-500">{t.sub}</p>
      </At>
      {column.map((p, i) => (
        <At key={p.text} x={p.x} y={250 + i * 210} rotate={p.rotate} z={20 - i}>
          <Phrase lang={lang} text={p.text} done={p.done} zoom={1.6} />
        </At>
      ))}
    </>
  );
}

"use client";

import type { ReactNode } from "react";

import { AiProgress } from "@/components/programming-quiz/Screens";
import { QuizIcon } from "@/components/programming-quiz/QuizIcon";
import { CATEGORIES, type CategoryId, CategoryGlyph, ResultMark, Sparkles } from "@/components/programming-quiz/quiz-ui";
import { SiriBubble } from "@/components/intento/VoiceDemo";

import { cn } from "@/lib/utils";

import { At, type Bezels, Device } from "../intento/strip";

/**
 * QuizLiT（Programming Quiz）の App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く。
 * 枠の大きさと撮り方は Intento と同じ（iPhone 440×956×3、iPad 1032×1376×2、開いた Duo 1467×1032×1.94477）。
 * 意匠はアイコンのワードマーク（programming //Quiz）から取る。// のコメント、等幅の文字、カーソル、
 * ティール・グリーン・マゼンタの 3 色（Xcode の構文の色に近い）。アプリの画面は実機のスクショだけを使う。
 * 端末と部品の傾きは、左から順に左右を交互にする。
 */

const FRAMES = 6;
export const FRAME = {
  iphone: { w: 440, h: 956 },
  ipad: { w: 1032, h: 1376 },
  duoInner: { w: 1467, h: 1032 },
} as const;
export type QuizDevice = keyof typeof FRAME;

/** アイコンのワードマークの色（AppIcon.icon の前景から測った値） */
export const BRAND = { teal: "#00A0BE", green: "#41B645", magenta: "#B21889", bg: "#F5F5F9", ink: "#1C1C1E" } as const;

type ScreenKey = "home" | "question" | "answered" | "result";
type ShotSet = Record<ScreenKey, string>;
export type QuizShots = { iphone: ShotSet; ipad: ShotSet; duoOpen?: ShotSet; duoClosed?: ShotSet };

export const FONT = "font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]";
export const MONO = "font-[ui-monospace,'SF_Mono',Menlo,'Hiragino_Sans',monospace]";
// 部品はどれも同じ長い影で浮かせる。影の向きと長さをそろえると、ばらばらの部品が 1 枚の絵になる
// box-shadow の大きなぼかしは Chrome で四角く切れて写るので、filter の drop-shadow にする
export const FLOAT = "[filter:drop-shadow(0_28px_32px_rgba(20,30,50,0.22))_drop-shadow(0_6px_8px_rgba(20,30,50,0.12))]";

const COPY = {
  eyebrows: ["3 択クイズ", "3 ジャンル・全 27 問", "答え合わせ", "AI におまかせ出題", "結果発表", "iPad・Siri"],
  titles: [
    ["3 択で腕だめし、", "プログラミングの知識。"],
    ["3 つのジャンルを、", "組み合わせて出題。"],
    ["答えたら、", "その場で答え合わせ。"],
    ["好きなテーマで、", "AI が問題をつくる。"],
    ["全問正解なら、", "プログラミング博士。"],
    ["iPhone でも iPad でも、", "Siri からでも。"],
  ],
  aiNote: "Apple Intelligence に対応した端末で",
  siri: "「Programming Quiz でアルゴリズム編のクイズを始める」",
};

const TITLE = {
  iphone: { size: 33, eyebrow: 15, top: 96, inset: 28, width: 384 },
  ipad: { size: 64, eyebrow: 26, top: 150, inset: 72, width: 888 },
  duoInner: { size: 56, eyebrow: 24, top: 96, inset: 84, width: 760 },
} as const;

/** 見出しの終わりに置くカーソル。ワードマークの右端の縦線と i のマゼンタから */
export function Caret() {
  return <span className="ml-[0.08em] inline-block h-[0.92em] w-[0.09em] translate-y-[0.12em] rounded-[1px]" style={{ background: BRAND.magenta }} aria-hidden />;
}

/** // で始まる小見出し。ワードマークの //Quiz の緑 */
export function Eyebrow({ children, size }: { children: ReactNode; size: number }) {
  return (
    <span className="flex items-baseline font-bold tracking-[0.01em]" style={{ fontSize: size, color: BRAND.green, gap: size * 0.4 }}>
      <span className={cn(MONO, "font-bold")}>{"//"}</span>
      {children}
    </span>
  );
}

function Title({ device, index }: { device: QuizDevice; index: number }) {
  const { size, eyebrow, top, inset, width } = TITLE[device];
  const lines = COPY.titles[index];
  return (
    <div className="absolute z-30 flex flex-col" style={{ left: index * FRAME[device].w + inset, top, width, gap: size * 0.32 }}>
      <Eyebrow size={eyebrow}>{COPY.eyebrows[index]}</Eyebrow>
      <h2 className="font-bold leading-[1.22] tracking-[-0.015em] [font-feature-settings:'palt']" style={{ fontSize: size, color: BRAND.ink }}>
        {lines.map((line, i) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
            {i === lines.length - 1 && <Caret />}
          </span>
        ))}
      </h2>
    </div>
  );
}

/**
 * 地。アイコンと同じ薄いグレーに、ワードマークの 3 色を大きくぼかして流し、
 * 等幅の記号（? // { } ✓）を薄く大きく置く。どれも画像の境目をまたぐので、並べると 1 本につながる
 */
export function Backdrop({
  blobs,
  glyphs,
}: {
  blobs: { x: number; y: number; r: number; c: string; o?: number }[];
  glyphs: { x: number; y: number; size: number; text: string; rotate: number; c: string }[];
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b) => (
        <span
          key={`${b.x}-${b.y}`}
          className="absolute"
          // filter: blur は傾けた部品の下で四角く欠けて写るので、ぼかしは放射グラデーションで描く
          style={{ left: b.x - b.r * 1.6, top: b.y - b.r * 1.6, width: b.r * 3.2, height: b.r * 3.2, background: `radial-gradient(closest-side, ${b.c}, ${b.c}99 35%, transparent)`, opacity: b.o ?? 0.28 }}
        />
      ))}
      {glyphs.map((g) => (
        <span
          key={`${g.x}-${g.y}`}
          className={cn(MONO, "absolute whitespace-nowrap font-bold leading-none")}
          style={{
            left: g.x,
            top: g.y,
            fontSize: g.size,
            transform: `rotate(${g.rotate}deg)`,
            color: "transparent",
            WebkitTextStroke: `${Math.max(2, g.size / 110)}px ${g.c}`,
            opacity: 0.22,
          }}
        >
          {g.text}
        </span>
      ))}
    </div>
  );
}

/**
 * 帯の中のある位置に置く（Intento の At の代わり）。大きくするのは zoom ではなく transform の scale にする。
 * zoom と rotate と長い影を重ねると、Chrome が影を部品の四角で切って写すため
 */
export function Place({ x, y, w, rotate = 0, scale = 1, z, children, className }: { x: number; y: number; w?: number; rotate?: number; scale?: number; z?: number; children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("absolute", className)}
      style={{ left: x, top: y, width: w && w / scale, zIndex: z, transform: `rotate(${rotate}deg) scale(${scale})`, transformOrigin: "top left" }}
    >
      {children}
    </div>
  );
}

/**
 * 結果画面の王冠。アプリは SF Symbols の crown.fill（indigo）なので、描き直さずに iPhone の結果画面のスクショから切り抜く。
 * 地のグレー（#F2F2F7）を透明に、王冠の色（#6155F5）を不透明にする色の行列をかける
 */
const CROWN_BOX = { x: 519, y: 803, w: 282, h: 218 }; // 1320×2868 のスクショの中の位置
function ResultCrown({ src, width, className }: { src: string; width: number; className?: string }) {
  const b = CROWN_BOX;
  return (
    <svg viewBox={`${b.x} ${b.y} ${b.w} ${b.h}`} width={width} height={(width * b.h) / b.w} className={cn("overflow-hidden", className)} aria-hidden>
      <filter id="quiz-crown" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0.38  0 0 0 0 0.333  0 0 0 0 0.961  -0.839 -0.839 -0.839 0 2.405" />
      </filter>
      <image href={src} x={0} y={0} width={1320} height={2868} filter="url(#quiz-crown)" />
    </svg>
  );
}

/** 3 つのジャンルの札。アイコンの色でホーム画面のカードと対応させ、問題数を添える */
function CategoryTiles({ className }: { className?: string }) {
  const ids: CategoryId[] = ["basic", "iphone", "algorithm"];
  return (
    <div className={cn("flex flex-col items-start gap-3.5", className)}>
      {ids.map((id, i) => (
        <span
          key={id}
          className={cn("flex items-center gap-2.5 rounded-[18px] bg-white py-2.5 pl-3 pr-4", FLOAT)}
          style={{ marginLeft: i % 2 === 1 ? 24 : 0 }}
        >
          <CategoryGlyph id={id} className="h-7 w-7" />
          <span className={cn(MONO, "whitespace-nowrap text-[22px] font-bold")} style={{ color: CATEGORIES[id].color }}>
            {CATEGORIES[id].count}
            <span className="text-[13px]"> 問</span>
          </span>
        </span>
      ))}
    </div>
  );
}

/** AI に渡すテーマの例。アプリの入力欄の例（SwiftUI、再帰、正規表現）と同じ */
export function ThemeChips({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start gap-3", className)}>
      {["SwiftUI", "再帰", "正規表現"].map((theme, i) => (
        <span
          key={theme}
          className={cn(MONO, "rounded-full bg-white px-4 py-2 text-[16px] font-semibold", FLOAT)}
          style={{ marginLeft: [40, 0, 70][i], color: theme === "再帰" ? BRAND.magenta : BRAND.teal }}
        >
          &quot;{theme}&quot;
        </span>
      ))}
    </div>
  );
}

/** エディタ風のカード。テーマを入れると AI が問題をつくる、をコードの形で言う（アプリの画面ではない） */
export function EditorCard({ className }: { className?: string }) {
  const lines: ReactNode[] = [
    <span key="c1" style={{ color: BRAND.green }}>{"// テーマを入れると"}</span>,
    <span key="l2">
      <span style={{ color: BRAND.magenta }}>let</span> theme = <span style={{ color: BRAND.teal }}>&quot;再帰&quot;</span>
      <Caret />
    </span>,
    <span key="c3" style={{ color: BRAND.green }}>{"// AI が 3 択を 5 問つくる"}</span>,
  ];
  return (
    <div className={cn("overflow-hidden rounded-[22px] bg-white/95 ring-1 ring-black/5", FLOAT, className)}>
      <div className="flex items-center gap-2 border-b border-black/5 px-4 py-2.5">
        <Sparkles className="h-4 w-4" />
        <span className="text-[12px] font-bold text-neutral-500">AIにおまかせ出題</span>
      </div>
      <div className={cn(MONO, "flex flex-col gap-1.5 px-4 py-4 text-[14px] font-medium text-neutral-800")}>
        {lines.map((line, i) => (
          <div key={i} className="flex gap-3 whitespace-nowrap">
            <span className="w-3 text-right text-neutral-300">{i + 1}</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuizStoreStrip({ device, shots, bezels = {} }: { device: QuizDevice; shots: QuizShots; bezels?: Bezels }) {
  const { w, h } = FRAME[device];
  const sx = w / FRAME.iphone.w;
  const sy = h / FRAME.iphone.h;
  // 位置は iPhone の帯で決め、ほかの端末の帯の大きさに引き伸ばす
  const blobs = [
    { x: 60, y: 820, r: 230, c: BRAND.teal },
    { x: 700, y: 900, r: 220, c: BRAND.green, o: 0.22 },
    { x: 1250, y: 820, r: 230, c: BRAND.magenta, o: 0.18 },
    { x: 1700, y: 900, r: 220, c: BRAND.teal },
    { x: 2200, y: 820, r: 230, c: BRAND.green, o: 0.22 },
    { x: 2620, y: 900, r: 200, c: BRAND.magenta, o: 0.18 },
  ].map((b) => ({ ...b, x: b.x * sx, y: b.y * sy, r: b.r * Math.min(sx, sy) * 1.2 }));
  const k = Math.min(sx, sy);
  const glyphs = [
    { x: -30, y: 520, size: 420, text: "?", rotate: 8, c: BRAND.teal },
    { x: 760, y: 640, size: 220, text: "//", rotate: -8, c: BRAND.green },
    { x: 1190, y: 600, size: 300, text: "{", rotate: 8, c: BRAND.magenta },
    { x: 1590, y: 600, size: 300, text: "}", rotate: -8, c: BRAND.teal },
    { x: 2090, y: 640, size: 260, text: "✓", rotate: 8, c: BRAND.green },
  ].map((g) => ({ ...g, x: g.x * sx, y: g.y * sy, size: g.size * k * 1.15 }));
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang="ja"
      className={cn("relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none", FONT)}
      style={{ width: w * FRAMES, height: h, background: `linear-gradient(180deg, #FBFBFD 0%, ${BRAND.bg} 60%, #ECEDF2 100%)`, color: BRAND.ink }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <Backdrop blobs={blobs} glyphs={glyphs} />
      {device === "iphone" && <IphoneScene shots={shots} />}
      {device === "ipad" && <IpadScene shots={shots} />}
      {device === "duoInner" && <DuoScene shots={shots} bezels={bezels} />}
      {COPY.titles.map((_, i) => (
        <Title key={i} device={device} index={i} />
      ))}
    </div>
  );
}

function Icon({ x, y, size, text }: { x: number; y: number; size: number; text: number }) {
  return (
    <At x={x} y={y} z={30} className="flex items-center">
      <span className="flex items-center" style={{ gap: size * 0.3 }}>
        <span style={{ width: size, height: size }} className="block">
          <QuizIcon className="h-full w-full shadow-none" />
        </span>
        <span className="font-semibold text-neutral-500" style={{ fontSize: text }}>
          Programming Quiz
        </span>
      </span>
    </At>
  );
}

function IphoneScene({ shots }: { shots: QuizShots }) {
  const s = shots.iphone;
  return (
    <>
      {/* 1. 表紙: 問題の画面 */}
      <Icon x={28} y={34} size={40} text={16} />
      <At x={100} y={262} w={316} rotate={-4} z={10}>
        <Device src={s.question} kind="iphone" width={316} />
      </At>

      {/* 2. ジャンル: ホーム画面に 3 つのジャンルのカードを重ねる */}
      <At x={440 + 128} y={262} w={296} rotate={4} z={9}>
        <Device src={s.home} kind="iphone" width={296} />
      </At>
      <At x={440 + 20} y={600} z={12}>
        <CategoryTiles />
      </At>

      {/* 3. 答え合わせ */}
      <At x={880 + 64} y={262} w={316} rotate={-3} z={10}>
        <Device src={s.answered} kind="iphone" width={316} />
      </At>
      <At x={880 + 300} y={436} rotate={8} z={12} className="rounded-full">
        <ResultMark correct className="h-[92px] w-[92px] drop-shadow-[0_24px_24px_rgba(20,80,40,0.35)]" />
      </At>

      {/* 4. AI 出題: エディタ風のカードと、AI の問題を解いているときの進み具合 */}
      <Place x={1320 + 30} y={280} w={380} rotate={-3} z={11} scale={1.1}>
        <EditorCard />
      </Place>
      <Place x={1320 + 50} y={480} w={360} rotate={3} z={10} scale={1.25} className={cn("rounded-[24px]", FLOAT)}>
        <AiProgress />
      </Place>
      <At x={1320 + 40} y={660} z={10}>
        <ThemeChips />
      </At>
      <At x={1320 + 28} y={890} z={10} className={cn(MONO, "text-[13px] text-neutral-500")}>
        {`// ${COPY.aiNote}`}
      </At>

      {/* 5. 結果発表 */}
      <At x={1760 + 100} y={262} w={316} rotate={3} z={10}>
        <Device src={s.result} kind="iphone" width={316} />
      </At>
      <At x={1760 + 4} y={560} rotate={-10} z={12}>
        <ResultCrown src={s.result} width={110} className="drop-shadow-[0_24px_24px_rgba(40,30,120,0.35)]" />
      </At>

      {/* 6. iPad と iPhone と Siri */}
      <At x={2200 + 76} y={262} w={340} rotate={3} z={9}>
        <Device src={shots.ipad.home} kind="ipad" width={340} />
      </At>
      <At x={2200 + 30} y={540} w={170} rotate={-5} z={10}>
        <Device src={s.question} kind="iphone" width={170} />
      </At>
      <At x={2200 + 40} y={820} rotate={-2} z={20}>
        <SiriBubble className={cn("max-w-[360px] [&>div]:line-clamp-none", FLOAT)}>{COPY.siri}</SiriBubble>
      </At>
    </>
  );
}

function IpadScene({ shots }: { shots: QuizShots }) {
  const s = shots.ipad;
  const W = FRAME.ipad.w;
  return (
    <>
      <Icon x={72} y={56} size={60} text={28} />
      <At x={150} y={430} w={800} rotate={-3} z={10}>
        <Device src={s.question} kind="ipad" width={800} />
      </At>

      <At x={W + 300} y={430} w={680} rotate={3} z={9}>
        <Device src={s.home} kind="ipad" width={680} />
      </At>
      <Place x={W + 60} y={850} z={12} scale={1.9}>
        <CategoryTiles />
      </Place>

      <At x={2 * W + 150} y={430} w={800} rotate={-3} z={10}>
        <Device src={s.answered} kind="ipad" width={800} />
      </At>
      <At x={2 * W + 760} y={600} rotate={8} z={12}>
        <ResultMark correct className="h-[190px] w-[190px] drop-shadow-[0_30px_30px_rgba(20,80,40,0.35)]" />
      </At>

      <Place x={3 * W + 90} y={440} w={820} rotate={-3} z={11} scale={2.1}>
        <EditorCard />
      </Place>
      <Place x={3 * W + 150} y={820} w={760} rotate={3} z={10} scale={2.1} className={cn("rounded-[24px]", FLOAT)}>
        <AiProgress />
      </Place>
      <Place x={3 * W + 560} y={1080} z={12} scale={1.6}>
        <ThemeChips />
      </Place>
      <At x={3 * W + 72} y={1300} z={10} className={cn(MONO, "text-[24px] text-neutral-500")}>
        {`// ${COPY.aiNote}`}
      </At>

      <At x={4 * W + 170} y={430} w={780} rotate={3} z={10}>
        <Device src={s.result} kind="ipad" width={780} />
      </At>
      <At x={4 * W + 24} y={820} rotate={-10} z={12}>
        <ResultCrown src={shots.iphone.result} width={190} className="drop-shadow-[0_30px_30px_rgba(40,30,120,0.35)]" />
      </At>

      <At x={5 * W + 270} y={430} w={700} rotate={3} z={9}>
        <Device src={s.home} kind="ipad" width={700} />
      </At>
      <At x={5 * W + 60} y={720} w={300} rotate={-5} z={10}>
        <Device src={shots.iphone.question} kind="iphone" width={300} />
      </At>
      <Place x={5 * W + 90} y={1200} rotate={-2} z={20} scale={1.8}>
        <SiriBubble className={cn("max-w-[440px] whitespace-nowrap [&>div]:line-clamp-none", FLOAT)}>{COPY.siri}</SiriBubble>
      </Place>
    </>
  );
}

/**
 * 開いた Duo（横向き）の 6 枚。見出しは左上、端末は右下。開いた形は 1・3 枚目、閉じた形は 2・5・6 枚目に出す。
 * 開いた形の問題の画面は、問題と選択肢が左右に分かれる
 */
function DuoScene({ shots, bezels }: { shots: QuizShots; bezels: Bezels }) {
  const open = shots.duoOpen!;
  const closed = shots.duoClosed!;
  const W = FRAME.duoInner.w;
  return (
    <>
      <Icon x={84} y={36} size={44} text={22} />
      <At x={520} y={340} w={900} rotate={-3} z={10}>
        <Device src={open.question} kind="duoOpen" width={880} bezel={bezels.open} />
      </At>

      <At x={W + 900} y={150} w={430} rotate={4} z={9}>
        <Device src={closed.home} kind="duoClosed" width={430} bezel={bezels.closed} />
      </At>
      <Place x={W + 90} y={470} z={12} scale={1.7}>
        <CategoryTiles />
      </Place>

      <At x={2 * W + 540} y={360} w={880} rotate={-3} z={10}>
        <Device src={open.answered} kind="duoOpen" width={880} bezel={bezels.open} />
      </At>
      <At x={2 * W + 1300} y={380} rotate={8} z={12}>
        <ResultMark correct className="h-[130px] w-[130px] drop-shadow-[0_30px_30px_rgba(20,80,40,0.35)]" />
      </At>

      <Place x={3 * W + 100} y={500} w={620} rotate={-3} z={10} scale={1.6} className={cn("rounded-[24px]", FLOAT)}>
        <AiProgress />
      </Place>
      <Place x={3 * W + 800} y={200} w={600} rotate={3} z={11} scale={1.6}>
        <EditorCard />
      </Place>
      <Place x={3 * W + 900} y={620} z={12} scale={1.5}>
        <ThemeChips />
      </Place>
      <At x={3 * W + 84} y={960} z={10} className={cn(MONO, "text-[22px] text-neutral-500")}>
        {`// ${COPY.aiNote}`}
      </At>

      <At x={4 * W + 600} y={340} rotate={-8} z={12}>
        <ResultCrown src={shots.iphone.result} width={200} className="drop-shadow-[0_30px_30px_rgba(40,30,120,0.35)]" />
      </At>
      <At x={4 * W + 860} y={140} w={430} rotate={4} z={10}>
        <Device src={closed.result} kind="duoClosed" width={430} bezel={bezels.closed} />
      </At>

      <At x={5 * W + 160} y={430} w={330} rotate={-4} z={10}>
        <Device src={closed.question} kind="duoClosed" width={330} bezel={bezels.closed} />
      </At>
      <At x={5 * W + 620} y={250} w={600} rotate={3} z={9}>
        <Device src={shots.ipad.home} kind="ipad" width={600} />
      </At>
      <Place x={5 * W + 520} y={900} rotate={2} z={20} scale={1.5}>
        <SiriBubble className={cn("whitespace-nowrap [&>div]:line-clamp-none", FLOAT)}>{COPY.siri}</SiriBubble>
      </Place>
    </>
  );
}

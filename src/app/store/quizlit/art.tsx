"use client";

import { ResultMark } from "@/components/programming-quiz/quiz-ui";

import { cn } from "@/lib/utils";

import { At, Device } from "../intento/strip";

import { BRAND, Backdrop, Caret, EditorCard, Eyebrow, FONT, Place, type QuizShots, ThemeChips } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残るので、見出しは Apple のテンプレートの安全領域（1920×823 で中央の 824×331）に
 * 中央揃えで収め、外側には iPad や Mac で見える部品だけを置く。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824, h: 331 };

const COPY = {
  header: "3 択で腕だめし。",
  headerSub: "プログラミング知識・iPhone アプリ開発・アルゴリズム",
  search: ["好きなテーマで、", "AI が出題。"],
  searchSub: "全 27 問の 3 択クイズに、AI のオリジナル問題も。",
};

export function QuizStoreArt({ kind, shots }: { kind: ArtKind; shots: QuizShots }) {
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang="ja"
      className={cn("relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none", FONT)}
      style={{ width: w, height: h, background: `linear-gradient(180deg, #FBFBFD 0%, ${BRAND.bg} 100%)`, color: BRAND.ink }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      {kind === "header" ? <HeaderScene shots={shots} /> : <SearchScene shots={shots} />}
    </div>
  );
}

function HeaderScene({ shots }: { shots: QuizShots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <Backdrop
        blobs={[
          { x: 160, y: 700, r: 380, c: BRAND.teal, o: 0.3 },
          { x: 960, y: 900, r: 360, c: BRAND.green, o: 0.16 },
          { x: 1780, y: 640, r: 380, c: BRAND.magenta, o: 0.2 },
        ]}
        glyphs={[
          { x: 520, y: -150, size: 520, text: "?", rotate: 8, c: BRAND.teal },
          { x: 1240, y: 120, size: 420, text: "//", rotate: -8, c: BRAND.green },
        ]}
      />
      <At x={s.x} y={s.y} w={s.w} z={30} className="text-center">
        <div className="flex flex-col items-center gap-5" style={{ height: s.h, justifyContent: "center" }}>
          <Eyebrow size={26}>Programming Quiz</Eyebrow>
          <h1 className="whitespace-nowrap text-[96px] font-bold leading-none tracking-[-0.02em] [font-feature-settings:'palt']">
            {COPY.header}
            <Caret />
          </h1>
          <p className="text-[26px] font-semibold text-neutral-500">{COPY.headerSub}</p>
        </div>
      </At>

      {/* 左: 問題の画面と正解のマーク */}
      <At x={150} y={90} w={300} rotate={-5} z={10}>
        <Device src={shots.iphone.question} kind="iphone" width={300} />
      </At>
      <At x={390} y={430} rotate={8} z={12}>
        <ResultMark correct className="h-[110px] w-[110px] drop-shadow-[0_24px_24px_rgba(20,80,40,0.35)]" />
      </At>

      {/* 右: AI 出題 */}
      <Place x={1430} y={250} w={460} rotate={4} z={10} scale={1.3}>
        <EditorCard />
      </Place>
    </>
  );
}

function SearchScene({ shots }: { shots: QuizShots }) {
  return (
    <>
      <Backdrop
        blobs={[
          { x: 1500, y: 260, r: 440, c: BRAND.teal, o: 0.26 },
          { x: 1800, y: 1000, r: 420, c: BRAND.magenta, o: 0.18 },
          { x: 300, y: 1180, r: 420, c: BRAND.green, o: 0.18 },
        ]}
        glyphs={[{ x: 60, y: -10, size: 340, text: "{ }", rotate: -6, c: BRAND.teal }]}
      />
      <At x={150} y={400} w={900} z={30} className="flex flex-col gap-8">
        <Eyebrow size={34}>AI におまかせ出題</Eyebrow>
        <h1 className="text-[104px] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
          {COPY.search.map((line, i) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
              {i === COPY.search.length - 1 && <Caret />}
            </span>
          ))}
        </h1>
        <p className="text-[36px] font-semibold text-neutral-500">{COPY.searchSub}</p>
      </At>
      <At x={1260} y={150} w={470} rotate={5} z={10}>
        <Device src={shots.iphone.home} kind="iphone" width={470} />
      </At>
      <Place x={1010} y={880} z={20} scale={2}>
        <ThemeChips />
      </Place>
    </>
  );
}

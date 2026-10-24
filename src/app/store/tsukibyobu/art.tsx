"use client";

import { cn } from "@/lib/utils";

import { At, COLOR, GoldDust, Kasumi, type Lang, LEAD, MINCHO, MoonPhases, Screen, type Shots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残り、上の角に戻る・共有のボタンが重なる。Apple のテンプレートの安全領域
 * （3840×1646 で中央の 1646×661）に見出しと月相の列を収め、外側は iPad や Mac で見える飾りだけにする。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824 }; // 高さ 331 は見出しの枠の h-[331px]

/** 見出しの文言は strip.tsx の LEAD。ヘッダーは日本語なら 1 行、英語は 2 行で安全領域に収める */
type Copy = (typeof LEAD)[Lang] & { headerLines: string[]; headerSize: number };

const COPY: Record<Lang, Copy> = {
  ja: { ...LEAD.ja, headerLines: [LEAD.ja.lines.join("")], headerSize: 54 },
  en: { ...LEAD.en, headerLines: LEAD.en.lines, headerSize: 50 },
};

export function TsukibyobuStoreArt({ kind, lang, shots }: { kind: ArtKind; lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang={lang}
      className="relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w, height: h, background: COLOR.night }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <GoldDust width={w} height={h} count={kind === "header" ? 140 : 170} unit={1.8} seed={11} />
      {kind === "header" ? <HeaderScene t={t} shots={shots} /> : <SearchScene t={t} shots={shots} />}
    </div>
  );
}

/** ヘッダー: 見出しと月相の列を安全領域の中央に置き、左右に開いた Duo と iPhone の画面、霞を外側に置く */
function HeaderScene({ t, shots }: { t: Copy; shots: Shots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <Kasumi x={-80} y={130} w={520} h={30} />
      <Kasumi x={1500} y={660} w={500} h={28} opacity={0.75} />
      <At x={-60} y={250} rotate={-4} z={10}>
        <Screen src={shots.duoOpen[0]} width={560} kind="duoOpen" />
      </At>
      <At x={1560} y={140} rotate={4} z={10}>
        <Screen src={shots.iphone[1]} width={250} kind="iphone" />
      </At>
      <At x={s.x} y={s.y} w={s.w} z={30} className="flex h-[331px] flex-col items-center justify-center gap-6 text-center">
        <h1 className={cn(MINCHO, "whitespace-nowrap font-semibold leading-[1.25] [font-feature-settings:'palt']")} style={{ fontSize: t.headerSize, color: COLOR.ink }}>
          {t.headerLines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className={cn(MINCHO, "leading-[1.7] [font-feature-settings:'palt']")} style={{ fontSize: 24, color: COLOR.sub }}>
          {t.sub}
        </p>
        <MoonPhases size={40} gap={24} />
      </At>
    </>
  );
}

/** 検索結果: 左に見出し（左端をそろえる）、右に iPhone の画面を 1 枚だけ置く */
function SearchScene({ t, shots }: { t: Copy; shots: Shots }) {
  return (
    <>
      <Kasumi x={-100} y={300} w={760} h={40} />
      <Kasumi x={1380} y={1130} w={640} h={36} opacity={0.75} />
      <At x={150} y={430} w={1020} z={30} className="flex flex-col gap-10">
        <h1 className={cn(MINCHO, "font-semibold leading-[1.3] [font-feature-settings:'palt']")} style={{ fontSize: 96, color: COLOR.ink }}>
          {t.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className={cn(MINCHO, "leading-[1.7] [font-feature-settings:'palt']")} style={{ fontSize: 38, color: COLOR.sub }}>
          {t.sub}
        </p>
        <MoonPhases size={48} gap={28} />
      </At>
      <At x={1280} y={130} rotate={4} z={10}>
        <Screen src={shots.iphone[0]} width={460} kind="iphone" />
      </At>
    </>
  );
}

"use client";

import { At, Device } from "../intento/strip";
import { Backlight, INK, NightSky, TCard, ToretaIcon } from "./parts";
import type { ToretaShots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残るので、見出しは中央の安全領域（3840×1646 で中央の 1646×661）に収め、
 * 外側にはカードと端末の飾りだけを置く。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824, h: 331 };

const COPY = {
  header: "集めたカードを、ひと目で。",
  headerSub: "公式カードリストから取り込んで、所持枚数を記録",
  search: ["持っているカードを、", "シリーズごとに。"],
  searchSub: "取り込み・読み取り・トレード・デッキまで",
};

export function ToretaStoreArt({ kind, shots }: { kind: ArtKind; shots: ToretaShots }) {
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang="ja"
      className="relative overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w, height: h, background: `linear-gradient(180deg, ${INK.top}, ${INK.bottom})`, color: INK.text }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      {kind === "header" ? <HeaderScene shots={shots} /> : <SearchScene shots={shots} />}
    </div>
  );
}

/** ヘッダー: 見出しは中央に中央揃え。左はカードの扇、右は端末。傾きは左右で逆にする */
function HeaderScene({ shots }: { shots: ToretaShots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <NightSky
        id="toreta-grain-header"
        glows={[
          { x: 260, y: 560, rx: 380, ry: 300, c: "#5146D9", o: 0.65 },
          { x: 960, y: 420, rx: 420, ry: 200, c: "#2F6BF2", o: 0.3 },
          { x: 1660, y: 300, rx: 380, ry: 300, c: "#8A3FD1", o: 0.55 },
        ]}
      />
      <At x={s.x} y={s.y} w={s.w} z={30} className="flex flex-col items-center justify-center gap-6 text-center" >
        <div className="flex flex-col items-center justify-center gap-6" style={{ height: s.h }}>
          <ToretaIcon size={64} />
          <h1 className="whitespace-nowrap text-[62px] font-bold leading-none tracking-[-0.01em] [font-feature-settings:'palt']">{COPY.header}</h1>
          <p className="text-[24px] font-semibold" style={{ color: INK.sub }}>
            {COPY.headerSub}
          </p>
        </div>
      </At>

      {/* 左: 扇に開いたカード（手前ほどくっきり） */}
      <At x={30} y={250} rotate={-20} z={4}>
        <TCard card="mina" width={190} blur={3} />
      </At>
      <At x={170} y={170} rotate={-9} z={5}>
        <TCard card="kai" width={210} />
      </At>
      <At x={330} y={150} rotate={4} z={6}>
        <TCard card="bell" width={230} />
      </At>

      {/* 右: コレクションの画面 */}
      <Backlight color="#7B6BEA" style={{ left: 1500, top: 140, width: 300, height: 600 }} />
      <At x={1490} y={110} w={300} rotate={-6} z={10}>
        <Device src={shots.collection} kind="iphone" width={300} />
      </At>
      <At x={1760} y={430} rotate={12} z={8}>
        <TCard card="luka" width={170} blur={4} />
      </At>
    </>
  );
}

/** 検索結果: 左に見出し（左端をそろえる）、右に端末 1 台と、その後ろにカードの扇 */
function SearchScene({ shots }: { shots: ToretaShots }) {
  return (
    <>
      <NightSky
        id="toreta-grain-search"
        glows={[
          { x: 1450, y: 380, rx: 460, ry: 420, c: "#5146D9", o: 0.7 },
          { x: 1700, y: 1050, rx: 420, ry: 300, c: "#11847E", o: 0.45 },
          { x: 300, y: 1150, rx: 420, ry: 260, c: "#8A3FD1", o: 0.4 },
        ]}
      />
      <At x={150} y={380} w={920} z={30} className="flex flex-col gap-10">
        <div className="flex items-center gap-4">
          <ToretaIcon size={72} />
          <span className="text-[36px] font-bold">Toreta</span>
        </div>
        <h1 className="whitespace-nowrap text-[96px] font-bold leading-[1.18] tracking-[-0.01em] [font-feature-settings:'palt']">
          {COPY.search.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-[36px] font-semibold" style={{ color: INK.sub }}>
          {COPY.searchSub}
        </p>
      </At>
      <At x={1090} y={640} rotate={-16} z={4}>
        <TCard card="mina" width={250} blur={3} />
      </At>
      <At x={1180} y={560} rotate={-6} z={5}>
        <TCard card="kai" width={260} />
      </At>
      <Backlight color="#7B6BEA" style={{ left: 1320, top: 180, width: 460, height: 900 }} />
      <At x={1310} y={150} w={480} rotate={5} z={10}>
        <Device src={shots.collection} kind="iphone" width={480} />
      </At>
    </>
  );
}

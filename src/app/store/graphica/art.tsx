"use client";

import { BODY, Bokeh, G, Kicker, Phone, Place, StoreStyle, Tablet, Wordmark } from "./parts";
import { COPY as STRIP_COPY, type GShots, type Lang } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残るので、ワードマークと一言は安全領域（中央 824×331）に収め、
 * 外側には iPad や Mac で見える端末だけを置く。地とワードマークはスクリーンショットと同じ。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824, h: 331 };

// 検索結果の見出しは Web 版の紹介ページの見出し（ことばが、動く絵になる。）と同じ
const COPY: Record<Lang, { title: string[]; sub: string }> = {
  ja: { title: ["ことばが、", "動く絵になる。"], sub: "思い浮かんだ情景を一文で書くだけ。" },
  en: { title: ["Words become", "living art."], sub: "Describe a scene in a single sentence." },
};

export function GraphicaStoreArt({ kind, lang, shots }: { kind: ArtKind; lang: Lang; shots: GShots }) {
  const { w, h } = ART[kind];
  return (
    <div data-store-strip={`${w}x${h}x1`} lang={lang} className="relative overflow-hidden antialiased" style={{ width: w, height: h, background: G.void }}>
      <StoreStyle />
      {kind === "header" ? <HeaderScene lang={lang} shots={shots} /> : <SearchScene lang={lang} shots={shots} />}
    </div>
  );
}

function HeaderScene({ lang, shots }: { lang: Lang; shots: GShots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <Bokeh width={1920} height={823} lights={[{ x: 960, y: -60, r: 420, angle: 0 }, { x: 1700, y: -40, r: 260, angle: 10 }, { x: 220, y: -40, r: 240, angle: -10 }]} scale={1.4} density={0.7} seed={3} />
      <Place x={s.x} y={s.y} w={s.w} z={30} className="flex flex-col items-center justify-center gap-7" style={{ height: s.h }}>
        <Wordmark size={84} />
        <Kicker size={28}>{STRIP_COPY[lang].kicker}</Kicker>
      </Place>
      {/* 左右は安全領域の外。左に iPad の横向き、右に iPhone。傾きは左右で逆にする */}
      <Place x={-140} y={250} rotate={-5} z={10}>
        <Tablet src={shots.ipadGallery} width={620} />
      </Place>
      <Place x={1480} y={150} rotate={5} z={10}>
        <Phone src={shots.iphoneDetail} width={300} />
      </Place>
    </>
  );
}

function SearchScene({ lang, shots }: { lang: Lang; shots: GShots }) {
  const t = COPY[lang];
  return (
    <>
      <Bokeh width={1920} height={1280} lights={[{ x: 1500, y: -60, r: 460, angle: 8 }, { x: 420, y: -40, r: 300, angle: -8 }]} scale={1.6} density={0.6} seed={9} />
      <Place x={150} y={380} w={1060} z={30} className="flex flex-col gap-10">
        <Wordmark size={60} />
        <h1 className={`font-bold leading-[1.22] [font-feature-settings:'palt'] ${BODY}`} style={{ fontSize: 104, color: G.paper }}>
          {t.title.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>
        <p className={`text-[38px] text-white/70 ${BODY}`}>{t.sub}</p>
      </Place>
      <Place x={1250} y={150} rotate={4} z={10}>
        <Phone src={shots.iphoneDetail} width={480} />
      </Place>
    </>
  );
}

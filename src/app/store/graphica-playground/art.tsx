"use client";

import { BODY, Bokeh, G, Kicker, Phone, Place, StoreStyle } from "../graphica/parts";
import { type Lang, PlaygroundMark, POOL, ProBadge, type PShots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * GRAPHICA のヘッダーと同じ組み方で、ワードマークと一言は安全領域（中央 824×331）に収め、外側に端末を置く。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824, h: 331 };

// 検索結果の見出しは紹介ページの見出し（言葉で描いて、学んで、使う。）
const COPY: Record<Lang, { kicker: string; title: string[]; sub: string }> = {
  ja: { kicker: "Metal shaders, from words", title: ["言葉で描いて、", "学んで、使う。"], sub: "一文から Metal シェーダー。SwiftUI に書き出せる。" },
  en: { kicker: "Metal shaders, from words", title: ["Describe it.", "Learn it. Ship it."], sub: "One sentence to a Metal shader, exported as SwiftUI." },
};

export function PlaygroundStoreArt({ kind, lang, shots }: { kind: ArtKind; lang: Lang; shots: PShots }) {
  const { w, h } = ART[kind];
  const t = COPY[lang];
  return (
    <div data-store-strip={`${w}x${h}x1`} lang={lang} className="relative overflow-hidden antialiased" style={{ width: w, height: h, background: G.void }}>
      <StoreStyle />
      {kind === "header" ? (
        <>
          <Bokeh width={1920} height={823} lights={[{ x: 960, y: -60, r: 420 }, { x: 1700, y: -40, r: 260, angle: 10 }, { x: 220, y: -40, r: 240, angle: -10 }]} palette={POOL} scale={1.4} density={0.7} seed={31} />
          <Place x={HEADER_SAFE.x} y={HEADER_SAFE.y} w={HEADER_SAFE.w} z={30} className="flex flex-col items-center justify-center gap-7" style={{ height: HEADER_SAFE.h }}>
            <PlaygroundMark size={74} />
            <Kicker size={26}>{t.kicker}</Kicker>
          </Place>
          {/* 左右は安全領域の外。iPhone を 1 台ずつ、どちらも見切れさせず左右対称に置き、傾きは逆にする */}
          <Place x={150} y={120} rotate={-5} z={10}>
            <Phone src={shots.iphoneLesson} width={280} />
          </Place>
          <Place x={1920 - 150 - 280} y={120} rotate={5} z={10}>
            <Phone src={shots.iphoneEditor} width={280} />
          </Place>
        </>
      ) : (
        <>
          <Bokeh width={1920} height={1280} lights={[{ x: 1500, y: -60, r: 460, angle: 8 }, { x: 420, y: -40, r: 300, angle: -8 }]} palette={POOL} scale={1.6} density={0.6} seed={33} />
          <Place x={150} y={330} w={1060} z={30} className="flex flex-col gap-10">
            <PlaygroundMark size={56} />
            <h1 className={`font-bold leading-[1.22] [font-feature-settings:'palt'] ${BODY}`} style={{ fontSize: 104, color: G.paper }}>
              {t.title.map((line) => (
                <span key={line} className="block whitespace-nowrap">
                  {line}
                </span>
              ))}
            </h1>
            <p className={`flex items-center gap-4 text-[36px] text-white/70 ${BODY}`}>
              {t.sub}
              <ProBadge size={22} />
            </p>
          </Place>
          <Place x={1250} y={150} rotate={4} z={10}>
            <Phone src={shots.iphoneEditor} width={480} />
          </Place>
        </>
      )}
    </div>
  );
}

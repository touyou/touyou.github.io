"use client";

import { AndroidPhone, FEATURE } from "../android-phone";
import { COPY as ART_COPY } from "./art";
import { BODY, Bokeh, G, Kicker, Place, StoreStyle, Wordmark } from "./parts";
import { Chips, CodeCard, COPY, type Lang, lightsFor, SceneTitle } from "./strip";

/**
 * GRAPHICA（Android 版）の Google Play のスクリーンショット（縦 1080×1920）とフィーチャーグラフィック（1024×500）。
 * 360×640 を 3 倍で撮る 4 枚を横に並べる。地・ぼけた光・ワードマーク・見出しの文法は App Store の帯（strip.tsx）と同じ。
 * Apple の端末をまたぐ 1 枚（Native）は Android には当てはまらないので置かない。生成のしかたも Android にある 2 つだけを出す。
 * 画面は graphica の Actions（store-screenshots.yml）がエミュレータで撮ったもの
 */
export const PLAY_FRAME = { w: 360, h: 640, count: 4 } as const;

export type PlayShots = { gallery: string; detail: string; create: string; detail2: string };

// Android の生成方法は共有の無料枠と BYOK の 2 つ（docs/process/platform-feature-parity.md）
const WAYS: Record<Lang, string[]> = { ja: ["共有の無料枠", "自分の API キー"], en: ["Free shared quota", "Your own API key"] };

const SHADOW = "0 0 0 1px rgba(255,255,255,0.12), 0 50px 80px -30px rgba(0,0,0,0.85), 0 18px 36px -18px rgba(0,0,0,0.6)";

function Shell({ w, h, count, lang, children }: { w: number; h: number; count: number; lang: Lang; children: React.ReactNode }) {
  return (
    <div data-store-strip={`${w}x${h}x${count}`} lang={lang} className="relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none" style={{ width: w * count, height: h, background: G.void }}>
      <StoreStyle />
      {children}
    </div>
  );
}

function Phone({ src, width }: { src: string; width: number }) {
  return <AndroidPhone src={src} width={width} frame="#16171b" shadow={SHADOW} />;
}

export function GraphicaPlayStrip({ lang, shots }: { lang: Lang; shots: PlayShots }) {
  const t = COPY[lang];
  const a = ART_COPY[lang];
  const s = t.scenes;
  const { w: W, h, count } = PLAY_FRAME;
  const title = 26;
  return (
    <Shell w={W} h={h} count={count} lang={lang}>
      <Bokeh width={W * count} height={h} lights={lightsFor(W, count, 0.8)} />

      {/* 1. 表紙: ワードマークと、検索結果の画像と同じ見出し */}
      <Place x={28} y={40} z={30}>
        <Wordmark size={40} />
      </Place>
      <Place x={28} y={100} z={30}>
        <h2 className={`font-bold leading-[1.28] [font-feature-settings:'palt'] ${BODY}`} style={{ fontSize: title, color: G.paper }}>
          {a.title.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h2>
      </Place>
      <Place x={110} y={210} rotate={-4} z={10}>
        <Phone src={shots.gallery} width={210} />
      </Place>

      {/* 2. コードまで読める */}
      <SceneTitle x={W + 28} y={56} w={W - 56} eyebrow={s[1].eyebrow} title={s[1].title} size={title} />
      <Place x={W + 130} y={200} rotate={3} z={10}>
        <Phone src={shots.detail2} width={200} />
      </Place>
      <Place x={W + 12} y={440} rotate={-2} z={20}>
        <CodeCard width={300} size={8.2} />
      </Place>

      {/* 3. 生成のしかた */}
      <SceneTitle x={2 * W + 28} y={56} w={W - 56} eyebrow={s[0].eyebrow} title={s[0].title} size={title} />
      <Place x={2 * W + 28} y={190} w={W - 56} z={30}>
        <Chips items={WAYS[lang]} size={11} accent={0} />
      </Place>
      <Place x={2 * W + 90} y={250} rotate={-3} z={10}>
        <Phone src={shots.create} width={200} />
      </Place>

      {/* 4. 締め: 無料の一言と作品の詳細 */}
      <SceneTitle x={3 * W + 28} y={56} w={W - 56} eyebrow={s[3].eyebrow} title={s[3].title} size={title} />
      <Place x={3 * W + 28} y={190} z={30}>
        <span className={`text-[11px] text-white/65 ${BODY}`}>{t.free}</span>
      </Place>
      <Place x={3 * W + 110} y={240} rotate={3} z={10}>
        <Phone src={shots.detail} width={200} />
      </Place>
    </Shell>
  );
}

/** フィーチャーグラフィック: 左にワードマークと見出し、右に作品の一覧と詳細の 2 台 */
export function GraphicaFeatureGraphic({ lang, shots }: { lang: Lang; shots: PlayShots }) {
  const a = ART_COPY[lang];
  const { w, h } = FEATURE;
  return (
    <Shell w={w} h={h} count={1} lang={lang}>
      <Bokeh width={w} height={h} lights={[{ x: 820, y: -40, r: 300, angle: 8 }, { x: 260, y: -30, r: 200, angle: -8 }]} scale={0.9} density={0.6} seed={11} />
      <Place x={64} y={130} z={30} className="flex flex-col gap-5">
        <Wordmark size={46} />
        <h1 className={`whitespace-nowrap font-bold leading-[1.2] [font-feature-settings:'palt'] ${BODY}`} style={{ fontSize: 42, color: G.paper }}>
          {a.title.join(lang === "ja" ? "" : " ")}
        </h1>
        <Kicker size={15} style={{ color: G.acid }}>
          {COPY[lang].kicker}
        </Kicker>
      </Place>
      <Place x={660} y={60} rotate={-5} z={10}>
        <Phone src={shots.gallery} width={170} />
      </Place>
      <Place x={830} y={110} rotate={5} z={11}>
        <Phone src={shots.detail} width={170} />
      </Place>
    </Shell>
  );
}

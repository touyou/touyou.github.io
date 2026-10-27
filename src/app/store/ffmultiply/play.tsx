"use client";

import { AndroidPhone, FEATURE } from "../android-phone";
import { COPY as ART_COPY } from "./art";
import { BestChip, Circuit, FF, Glow, Keypad, LcdChip, Place, Seg, StoreStyle, StreakStairs, TITLE_FONT } from "./parts";
import { AppMark, circuitFor, COPY, type Lang } from "./strip";

/**
 * FFMultiplier（Android 版）の Google Play のスクリーンショット（縦 1080×1920）とフィーチャーグラフィック（1024×500）。
 * 360×640 を 3 倍で撮る 5 枚を横に並べる。見出し・配線・7 セグの意匠は App Store の帯（strip.tsx）と同じ。
 * Android 版のオンラインランキングはエミュレータで撮れないので、ランキングの 1 枚は置かない。
 * 画面は FFMultiplierAndroid の Actions（store-screenshots.yml）がエミュレータで撮ったもの
 */
export const PLAY_FRAME = { w: 360, h: 640, count: 5 } as const;

export type PlayShots = { home: string; game: string; result: string; local: string; icon: string };

// strip.tsx の見出しのうち、ランキング（5 枚目）を除いたもの
const TITLE_INDEX = [0, 1, 2, 3, 5];

function Shell({ w, h, count, lang, children }: { w: number; h: number; count: number; lang: Lang; children: React.ReactNode }) {
  return (
    <div
      data-store-strip={`${w}x${h}x${count}`}
      lang={lang}
      className="relative overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans',sans-serif] text-white antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w * count, height: h, background: `radial-gradient(120% 80% at 50% 0%, #151815 0%, ${FF.black} 60%)` }}
    >
      <StoreStyle />
      {children}
    </div>
  );
}

function Title({ index, lines }: { index: number; lines: string[] }) {
  const { w } = PLAY_FRAME;
  return (
    <h2
      className={`absolute z-30 font-bold leading-[1.22] tracking-[-0.01em] text-white [font-feature-settings:'palt'] ${TITLE_FONT}`}
      style={{ left: index * w + 22, top: 70, width: w - 44, fontSize: 27 }}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

export function FFPlayStrip({ lang, shots, best }: { lang: Lang; shots: PlayShots; best: string }) {
  const t = COPY[lang];
  const { w: W, h, count } = PLAY_FRAME;
  return (
    <Shell w={W} h={h} count={count} lang={lang}>
      <Circuit width={W * count} height={h} stroke={2} {...circuitFor({ w: W, h, count, s: 0.8, y: 160 })} />

      {/* 1. 表紙: ゲーム画面と「F × F = E1」 */}
      <AppMark x={22} y={26} size={28} icon={shots.icon} />
      <Glow x={60} y={240} w={280} h={380} />
      <Place x={128} y={200} rotate={-3} z={10}>
        <AndroidPhone src={shots.game} width={200} />
      </Place>
      <Place x={14} y={500} rotate={4} z={20}>
        <LcdChip a="F" b="F" ans="E1" size={28} />
      </Place>

      {/* 2. 60 秒: 大きな 7 セグの残り時間と、ホーム画面 */}
      <Place x={W + 22} y={196} z={10} className="flex items-end gap-2">
        <Seg text="60" size={100} />
        <span className="pb-1 text-[17px] font-bold text-white/50">{t.sec}</span>
      </Place>
      <Glow x={W + 110} y={360} w={240} h={300} opacity={0.22} />
      <Place x={W + 150} y={300} rotate={4} z={10}>
        <AndroidPhone src={shots.home} width={180} />
      </Place>

      {/* 3. 16 のキー: 「b × 7」の答え 4d を打っているところ */}
      <Glow x={2 * W + 20} y={240} w={320} h={320} opacity={0.2} />
      <Place x={2 * W + 34} y={220} rotate={-4} z={10}>
        <Keypad width={290} lit={["4", "d"]} />
      </Place>
      <Place x={2 * W + 80} y={530} rotate={3} z={20}>
        <LcdChip a="b" b="7" ans="4d" size={28} />
      </Place>

      {/* 4. 連続正解のボーナス: 階段のグラフと結果画面 */}
      <Place x={3 * W + 22} y={196} z={10}>
        <StreakStairs width={220} streakLabel={t.streak} />
      </Place>
      <Glow x={3 * W + 120} y={380} w={230} h={280} opacity={0.22} />
      <Place x={3 * W + 160} y={330} rotate={-3} z={10}>
        <AndroidPhone src={shots.result} width={170} />
      </Place>

      {/* 5. ローカルスコアと自己ベスト */}
      <Glow x={4 * W + 100} y={240} w={240} h={380} opacity={0.22} />
      <Place x={4 * W + 136} y={200} rotate={3} z={9}>
        <AndroidPhone src={shots.local} width={196} />
      </Place>
      <Place x={4 * W + 16} y={470} rotate={-4} z={10}>
        <BestChip label={t.best} score={best} size={44} />
      </Place>

      {TITLE_INDEX.map((ti, i) => (
        <Title key={i} index={i} lines={t.titles[ti]} />
      ))}
    </Shell>
  );
}

/** フィーチャーグラフィック: 左に見出し、右に傾けたゲーム画面と液晶 */
export function FFFeatureGraphic({ lang, shots }: { lang: Lang; shots: PlayShots }) {
  const a = ART_COPY[lang];
  const { w, h } = FEATURE;
  return (
    <Shell w={w} h={h} count={1} lang={lang}>
      <Circuit width={w} height={h} stroke={2.5} {...circuitFor({ w, h, count: 1, s: 1, y: 112 })} />
      <AppMark x={64} y={150} size={36} icon={shots.icon} />
      <Place x={64} y={214} z={30} className="flex flex-col gap-4">
        <h1 className={`whitespace-nowrap font-bold leading-[1.1] [font-feature-settings:'palt'] ${TITLE_FONT}`} style={{ fontSize: lang === "ja" ? 54 : 50 }}>
          {a.header}
        </h1>
        <p className="whitespace-nowrap text-[19px] font-bold text-white/55">{a.searchSub}</p>
      </Place>
      <Glow x={640} y={120} w={360} h={420} opacity={0.26} />
      <Place x={760} y={40} rotate={5} z={10}>
        <AndroidPhone src={shots.game} width={220} />
      </Place>
      <Place x={560} y={360} rotate={-4} z={20}>
        <LcdChip a="F" b="F" ans="E1" size={32} />
      </Place>
    </Shell>
  );
}

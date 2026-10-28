"use client";

import {
  Circuit,
  FF,
  Glow,
  Keypad,
  LcdChip,
  Phone,
  Place,
  Seg,
  StoreStyle,
  TITLE_FONT,
} from "./parts";
import type { FFShots, Lang } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残るので、見出しは Apple のテンプレートの安全領域（中央 824×331）に収め、
 * 外側には iPad や Mac で見える飾り（キーパッドと液晶）だけを置く。
 */
export const ART = {
  header: { w: 1920, h: 823 },
  search: { w: 1920, h: 1280 },
} as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824 };

type Copy = {
  header: string;
  headerSize: number;
  headerSub: string;
  search: string[];
  searchSize: number;
  searchSub: string;
  sec: string;
};

export const COPY: Record<Lang, Copy> = {
  ja: {
    header: "九九を、16 進数で。",
    headerSize: 80,
    headerSub: "連続正解のボーナスと、オンラインランキング",
    search: ["16 進数の九九で、", "タイムアタック。"],
    searchSize: 96,
    searchSub: "0〜F × 0〜F を、60 秒で。",
    sec: "秒",
  },
  en: {
    header: "Times tables, in hex.",
    headerSize: 68,
    headerSub: "With streak bonuses and an online ranking",
    search: ["Hex times tables,", "against the clock."],
    searchSize: 96,
    searchSub: "0–F × 0–F in 60 seconds.",
    sec: "SEC",
  },
};

export function FFStoreArt({
  kind,
  lang,
  shots,
}: {
  kind: ArtKind;
  lang: Lang;
  shots: FFShots;
}) {
  const t = COPY[lang];
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang={lang}
      className="relative overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans',sans-serif] text-white antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{
        width: w,
        height: h,
        background: `radial-gradient(90% 90% at 50% 40%, #161a16 0%, ${FF.black} 70%)`,
      }}
    >
      <StoreStyle />
      {kind === "header" ? (
        <HeaderScene t={t} />
      ) : (
        <SearchScene t={t} shots={shots} />
      )}
    </div>
  );
}

/** ヘッダー: 中央揃えの見出しを、左右から回路の配線がはさむ。左にキーパッド、右に液晶と残り時間 */
function HeaderScene({ t }: { t: Copy }) {
  const s = HEADER_SAFE;
  const mid = s.y + 165;
  return (
    <>
      <Circuit
        width={1920}
        height={823}
        stroke={3.5}
        traces={[
          {
            pts: [
              [480, mid - 120],
              [520, mid - 120],
              [520, mid - 30],
              [548, mid - 30],
            ],
          },
          {
            pts: [
              [480, mid + 120],
              [520, mid + 120],
              [520, mid + 30],
              [548, mid + 30],
            ],
            lit: true,
          },
          {
            pts: [
              [1372, mid - 30],
              [1400, mid - 30],
              [1400, mid - 140],
              [1440, mid - 140],
            ],
            lit: true,
          },
          {
            pts: [
              [1372, mid + 30],
              [1400, mid + 30],
              [1400, mid + 150],
              [1480, mid + 150],
            ],
          },
          {
            pts: [
              [0, 60],
              [260, 60],
              [300, 100],
              [1620, 100],
              [1660, 60],
              [1920, 60],
            ],
          },
          {
            pts: [
              [0, 770],
              [380, 770],
              [420, 730],
              [1500, 730],
              [1540, 770],
              [1920, 770],
            ],
          },
        ]}
        gates={[
          { x: 960, y: 100, type: "and", size: 40 },
          { x: 700, y: 730, type: "not", size: 40 },
          { x: 1220, y: 730, type: "or", size: 40 },
        ]}
      />
      <Place
        x={s.x}
        y={s.y}
        w={s.w}
        z={30}
        className="flex h-[331px] flex-col items-center justify-center gap-6 text-center"
      >
        <h1
          className={`whitespace-nowrap font-bold leading-none tracking-[-0.015em] [font-feature-settings:'palt'] ${TITLE_FONT}`}
          style={{ fontSize: t.headerSize }}
        >
          {t.header}
        </h1>
        <p className="text-[26px] font-semibold text-white/55">{t.headerSub}</p>
      </Place>

      {/* 左: キーパッド */}
      <Glow x={110} y={220} w={360} h={400} opacity={0.2} blur={110} />
      <Place x={120} y={190} rotate={-6} z={10}>
        <Keypad width={340} lit={["E", "1"]} />
      </Place>

      {/* 右: 「F × F = E1」と残り時間。傾きは液晶が右、時間が左 */}
      <Glow x={1460} y={200} w={380} h={420} opacity={0.2} blur={110} />
      <Place x={1430} y={210} rotate={5} z={10}>
        <LcdChip a="F" b="F" ans="E1" size={52} />
      </Place>
      <Place
        x={1520}
        y={430}
        rotate={-4}
        z={11}
        className="flex items-end gap-3 rounded-[28px] bg-[#121412] px-8 py-6 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.07)]"
      >
        <Seg text="60" size={110} />
        <span className="pb-1 text-[22px] font-bold text-white/50">
          {t.sec}
        </span>
      </Place>
    </>
  );
}

/** 検索結果: 左に見出し（左端をそろえる）、右に iPhone を 1 台と液晶 */
function SearchScene({ t, shots }: { t: Copy; shots: FFShots }) {
  return (
    <>
      <Circuit
        width={1920}
        height={1280}
        stroke={4}
        traces={[
          {
            pts: [
              [0, 340],
              [150, 340],
              [190, 380],
              [1000, 380],
              [1040, 340],
              [1260, 340],
            ],
          },
          {
            pts: [
              [0, 360],
              [150, 360],
              [190, 400],
              [1000, 400],
              [1040, 360],
              [1260, 360],
            ],
            lit: true,
          },
          {
            pts: [
              [0, 1180],
              [500, 1180],
              [540, 1140],
              [1920, 1140],
            ],
          },
        ]}
        gates={[
          { x: 600, y: 380, type: "not", size: 40 },
          { x: 820, y: 400, type: "and", size: 32, lit: true },
          { x: 360, y: 1180, type: "or", size: 40 },
        ]}
      />
      <Place x={150} y={470} w={1060} z={30} className="flex flex-col gap-8">
        <h1
          className={`font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt'] ${TITLE_FONT}`}
          style={{ fontSize: t.searchSize }}
        >
          {t.search.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-[38px] font-semibold text-white/55">{t.searchSub}</p>
      </Place>
      <Glow x={1240} y={300} w={520} h={800} opacity={0.24} blur={130} />
      <Place x={1290} y={170} rotate={5} z={10}>
        <Phone src={shots.game} width={470} />
      </Place>
      <Place x={1060} y={900} rotate={-4} z={20}>
        <LcdChip a="F" b="F" ans="E1" size={60} />
      </Place>
    </>
  );
}

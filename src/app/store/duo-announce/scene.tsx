import type { CSSProperties } from "react";

import type { Bezel } from "../intento/strip";

import { cn } from "@/lib/utils";

/**
 * 「アプリはぜんぶ iPhone Duo に対応している」の 1 枚絵（1600×900）。7 本のアプリそれぞれの閉じた形と開いた形、計 14 台を並べる。
 * レイアウトは 3 案: a は見出しを囲む輪、b は斜めにずらして敷き詰めた上にガラスの板を置く、c は英語の見出しを軌道のように囲む輪。
 * 撮るのは store-screenshot-composer の capture_web.py（--frame 1600x900 --count 1 --scale 1）。
 * 端末の画面は実機のスクショだけを使う。
 */

export type Layout = "a" | "b" | "c";
// mask は scripts/bezel-masks.py が作る、枠の外側だけが透明な PNG。あればスクショを枠の外へ漏らさない
export type DuoBezel = Bezel & { mask?: string };
export type DuoApp = {
  name: string;
  closed: string;
  open: string;
  white?: boolean;
};

const W = 1600;
const H = 900;

// 見出しは句点まで太い黒。行は手で切る。日本語はヒラギノ、英語は SF Pro で
const TITLES: { lines: string[]; en?: boolean }[] = [
  { lines: ["iPhone Duo、", "ぜんぶ対応しました。"] },
  { lines: ["All my apps are ready", "for iPhone Duo."], en: true },
];

// ヒラギノは W6 を 600 で当てる。無い環境は Noto Sans JP（太字のある書体だけを並べ、偽太字にしない）
const FONT =
  "font-['Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif]";
const FONT_EN =
  "font-['SF_Pro_Display',-apple-system,BlinkMacSystemFont,'Helvetica_Neue',sans-serif]";
const SHADOW = "drop-shadow-[0_18px_28px_rgba(0,0,0,0.22)]";

/** 実機のスクショを公式の端末枠に入れる。縮小で潰れないよう next/image を通さない */
function Device({
  src,
  bezel,
  height,
  shadow = SHADOW,
}: {
  src: string;
  bezel: DuoBezel;
  height: number;
  shadow?: string;
}) {
  const s = bezel.screen;
  const mask =
    bezel.mask && `url("${encodeURI(bezel.mask)}") 0 0 / 100% 100% no-repeat`;
  return (
    <div
      className={cn("relative shrink-0", shadow)}
      style={{ height, aspectRatio: `${bezel.w} / ${bezel.h}` }}
    >
      {/* 画面の四角は端末の角丸より大きいので、枠の外へ出た角を枠の形で切る（影は外の箱に付けるので切れない） */}
      <div className="absolute inset-0" style={{ mask, WebkitMask: mask }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt=""
          className="absolute object-cover"
          style={{
            left: `${s.x * 100}%`,
            top: `${s.y * 100}%`,
            width: `${s.w * 100}%`,
            height: `${s.h * 100}%`,
          }}
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={encodeURI(bezel.src)}
        alt=""
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}

// 英語は SF Pro の Heavy（800）。weight で Bold（700）とも見比べる。日本語はヒラギノ W6 のまま
function Heading({
  title,
  size,
  weight = 800,
}: {
  title: number;
  size: number;
  weight?: number;
}) {
  const { lines, en } = TITLES[title];
  return (
    <h1
      style={{ fontSize: size, fontWeight: en ? weight : 600 }}
      className={cn(
        "text-center text-[#111]",
        en
          ? cn(FONT_EN, "leading-[1.08] tracking-[-0.025em]")
          : "leading-[1.22] tracking-[-0.015em] [font-feature-settings:'palt']",
      )}
    >
      {lines.map((line) => (
        <span key={line} className="block whitespace-nowrap">
          {line}
        </span>
      ))}
    </h1>
  );
}

type Slot = { x: number; y: number; r: number };

// a: 輪の上の 14 か所（中心の座標と傾き）。時計回りに閉じた形と開いた形が交互で、隣り合う 2 台が同じアプリ
const RING: Slot[] = [
  { x: 330, y: 150, r: -7 },
  { x: 565, y: 118, r: -3 },
  { x: 800, y: 100, r: 2 },
  { x: 1040, y: 118, r: 4 },
  { x: 1275, y: 150, r: 7 },
  { x: 1440, y: 345, r: -5 },
  { x: 1450, y: 575, r: 6 },
  { x: 1265, y: 770, r: -4 },
  { x: 1035, y: 795, r: -2 },
  { x: 800, y: 800, r: 3 },
  { x: 565, y: 795, r: -3 },
  { x: 335, y: 770, r: 5 },
  { x: 150, y: 565, r: -6 },
  { x: 165, y: 340, r: 4 },
];
const RING_H = 182;

function RingLayout({
  title,
  apps,
  bezelFor,
}: {
  title: number;
  apps: DuoApp[];
  bezelFor: (app: DuoApp, kind: "open" | "closed") => DuoBezel;
}) {
  return (
    <>
      <span className="absolute left-1/2 top-1/2 h-[520px] w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white blur-[80px]" />
      {RING.map((slot, i) => {
        const app = apps[Math.floor(i / 2)];
        const kind = i % 2 === 0 ? "closed" : "open";
        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: slot.x,
              top: slot.y,
              transform: `translate(-50%, -50%) rotate(${slot.r}deg)`,
            }}
          >
            <Device
              src={app[kind]}
              bezel={bezelFor(app, kind)}
              height={RING_H}
            />
          </div>
        );
      })}
      <div className="absolute inset-0 flex items-center justify-center">
        <Heading title={title} size={TITLES[title].en ? 96 : 90} />
      </div>
    </>
  );
}

// c: 英語の見出しを軌道のように囲む輪。端末の大きさはそろえて少しだけ揺らし、傾きの向きは隣どうしでも場所ごとでも偏らないよう散らす。
// 端末どうしは重ねず、すき間はどこも同じ（2 行は 34px、1 行は 40px）。見出しの字の外形からは 140px（1 行は 150px）以上離し、外周は少しはみ出してよい。
// 位置は字の外形に沿った角丸の輪の上で、隣どうしのすき間が等しくなるように計算した値
// [アプリの番号, 形, 中心 x, 中心 y, 高さ, 傾き]。番号は page.tsx の APPS の順（0 Intento … 6 FFMultiplier）
type OrbitSlot = [number, "closed" | "open", number, number, number, number];
const ORBIT_TWO_LINES: OrbitSlot[] = [
  [6, "open", 116, 414, 191, -5],
  [0, "closed", 181, 644, 194, 3],
  [1, "open", 405, 771, 185, 11],
  [2, "closed", 668, 772, 208, -9],
  [3, "open", 913, 751, 178, 2],
  [4, "closed", 1165, 774, 204, -13],
  [0, "open", 1418, 732, 181, 7],
  [1, "closed", 1438, 495, 206, -2],
  [2, "open", 1484, 258, 179, 12],
  [6, "closed", 1247, 128, 202, -7],
  [5, "open", 989, 132, 192, 6],
  [3, "closed", 746, 135, 192, 10],
  [4, "open", 488, 125, 185, -12],
  [5, "closed", 242, 176, 196, 1],
];
const ORBIT_ONE_LINE: OrbitSlot[] = [
  [6, "open", 81, 500, 153, -5],
  [0, "closed", 205, 719, 207, 3],
  [1, "open", 444, 731, 166, 11],
  [2, "closed", 672, 709, 148, -9],
  [3, "open", 923, 738, 212, 2],
  [4, "closed", 1196, 732, 184, -13],
  [0, "open", 1464, 718, 194, 7],
  [1, "closed", 1498, 460, 225, -2],
  [2, "open", 1371, 195, 180, 12],
  [6, "closed", 1130, 193, 148, -7],
  [5, "open", 882, 155, 207, 6],
  [3, "closed", 630, 181, 166, 10],
  [4, "open", 368, 154, 198, -12],
  [5, "closed", 128, 282, 184, 1],
];

// apple.com の製品ページに寄せる: ほぼ白の地、#1d1d1f の字、詰めた字間と行間、浅くやわらかい影
const APPLE_INK = "#1d1d1f";
const APPLE_SHADOW =
  "drop-shadow-[0_22px_30px_rgba(0,0,0,0.10)] drop-shadow-[0_3px_6px_rgba(0,0,0,0.06)]";
// accent のとき「iPhone Duo.」だけに控えめなグラデーションを掛ける
const ACCENT = "linear-gradient(100deg, #2f6bff 0%, #6a4dff 55%, #a84ee6 100%)";

function AppleHeading({
  oneLine,
  accent,
  weight,
}: {
  oneLine: boolean;
  accent: boolean;
  weight: number;
}) {
  const duo = accent ? (
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: ACCENT, WebkitBackgroundClip: "text" }}
    >
      iPhone Duo.
    </span>
  ) : (
    "iPhone Duo."
  );
  return (
    <h1
      className={cn(FONT_EN, "whitespace-nowrap text-center leading-[1.05]")}
      style={{
        color: APPLE_INK,
        fontWeight: weight,
        fontSize: oneLine ? 56 : 76,
        letterSpacing: oneLine ? "-0.022em" : "-0.028em",
      }}
    >
      {oneLine ? (
        <>All my apps are ready for {duo}</>
      ) : (
        <>
          <span className="block">All my apps are ready</span>
          <span className="block">for {duo}</span>
        </>
      )}
    </h1>
  );
}

function OrbitLayout({
  oneLine,
  accent,
  weight,
  apps,
  bezelFor,
}: {
  oneLine: boolean;
  accent: boolean;
  weight: number;
  apps: DuoApp[];
  bezelFor: (app: DuoApp, kind: "open" | "closed") => DuoBezel;
}) {
  return (
    <>
      {(oneLine ? ORBIT_ONE_LINE : ORBIT_TWO_LINES).map(
        ([index, kind, x, y, h, r]) => {
          const app = apps[index];
          return (
            <div
              key={`${index}-${kind}`}
              className="absolute"
              style={{
                left: x,
                top: y,
                transform: `translate(-50%, -50%) rotate(${r}deg)`,
              }}
            >
              <Device
                src={app[kind]}
                bezel={bezelFor(app, kind)}
                height={h}
                shadow={APPLE_SHADOW}
              />
            </div>
          );
        },
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <AppleHeading oneLine={oneLine} accent={accent} weight={weight} />
      </div>
    </>
  );
}

// b: 3 段の帯。上下の段は端から端まで、まん中の段はガラスの板の左右から顔を出す。どの段も閉じた形と開いた形が交互
// [アプリの番号, 形]。番号は page.tsx の APPS の順（0 Intento … 6 FFMultiplier）
type Item = [number, "closed" | "open"];
const BANDS: {
  items: Item[];
  y: number;
  x: number;
  align: "center" | "end" | "start";
}[] = [
  {
    items: [
      [0, "open"],
      [1, "closed"],
      [2, "open"],
      [3, "closed"],
      [4, "open"],
    ],
    y: 190,
    x: 790,
    align: "center",
  },
  {
    items: [
      [1, "open"],
      [0, "closed"],
    ],
    y: 450,
    x: 470,
    align: "end",
  },
  {
    items: [
      [2, "closed"],
      [3, "open"],
    ],
    y: 450,
    x: 1130,
    align: "start",
  },
  {
    items: [
      [4, "closed"],
      [5, "open"],
      [6, "closed"],
      [6, "open"],
      [5, "closed"],
    ],
    y: 735,
    x: 760,
    align: "center",
  },
];
const BAND_H = 240;

function GlassLayout({
  title,
  apps,
  bezelFor,
}: {
  title: number;
  apps: DuoApp[];
  bezelFor: (app: DuoApp, kind: "open" | "closed") => DuoBezel;
}) {
  const glass: CSSProperties = {
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.58) 55%, rgba(255,255,255,0.7))",
    backdropFilter: "blur(30px) saturate(170%)",
    WebkitBackdropFilter: "blur(30px) saturate(170%)",
    boxShadow:
      "inset 0 1.5px 0 rgba(255,255,255,0.95), inset 0 0 0 1px rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.04), 0 30px 70px rgba(0,0,0,0.16), 0 6px 18px rgba(0,0,0,0.06)",
  };
  const shift = { center: "-50%", end: "-100%", start: "0%" };
  return (
    <>
      <div className="absolute inset-0" style={{ transform: "rotate(-6deg)" }}>
        {BANDS.map((band) => (
          <div
            key={`${band.x}-${band.y}`}
            className="absolute flex items-center gap-10"
            style={{
              left: band.x,
              top: band.y,
              transform: `translate(${shift[band.align]}, -50%)`,
            }}
          >
            {band.items.map(([index, kind], k) => {
              const app = apps[index];
              // 互い違いに上下へずらす
              return (
                <div
                  key={`${index}-${kind}`}
                  style={{
                    transform: `translateY(${k % 2 === 0 ? -14 : 14}px)`,
                  }}
                >
                  <Device
                    src={app[kind]}
                    bezel={bezelFor(app, kind)}
                    height={BAND_H}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-[48px] px-16 py-14"
          style={glass}
        >
          {/* 左上から差すハイライト */}
          <span
            className="pointer-events-none absolute inset-0 rounded-[48px]"
            style={{
              background:
                "radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.55), rgba(255,255,255,0) 45%)",
            }}
          />
          <div className="relative">
            <Heading title={title} size={TITLES[title].en ? 88 : 82} />
          </div>
        </div>
      </div>
    </>
  );
}

export function DuoAnnounce({
  layout,
  title,
  weight = 800,
  oneLine = false,
  accent = false,
  apps,
  bezelFor,
}: {
  layout: Layout;
  title: number;
  weight?: number;
  oneLine?: boolean;
  accent?: boolean;
  apps: DuoApp[];
  bezelFor: (app: DuoApp, kind: "open" | "closed") => DuoBezel;
}) {
  return (
    <main
      className={cn(
        "relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none",
        FONT,
      )}
      style={{
        width: W,
        height: H,
        background:
          layout === "c"
            ? "#fbfbfd"
            : "radial-gradient(120% 120% at 50% 40%, #ffffff, #f3f3f1 70%, #ececea)",
      }}
    >
      {layout === "a" && (
        <RingLayout title={title} apps={apps} bezelFor={bezelFor} />
      )}
      {layout === "b" && (
        <GlassLayout title={title} apps={apps} bezelFor={bezelFor} />
      )}
      {layout === "c" && (
        <OrbitLayout
          oneLine={oneLine}
          accent={accent}
          weight={weight}
          apps={apps}
          bezelFor={bezelFor}
        />
      )}
    </main>
  );
}

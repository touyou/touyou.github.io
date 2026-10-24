"use client";

import { type CSSProperties, type ReactNode, useId } from "react";

import { TsukibyobuIcon } from "@/components/tsukibyobu/TsukibyobuIcon";

import { cn } from "@/lib/utils";

/**
 * 月屏風の App Store のスクリーンショット 4 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 撮って 1 枚ずつに切るのは scripts/store-screenshots.sh。iPhone は 1 枚 440×956 を 3 倍で 1320×2868（6.9"）、
 * iPhone Duo は開いた横向き 1467×1032 を 1.94477 倍で 2853×2007。iPad には対応していないので作らない。
 * 夜の屏風に合わせて、地はほぼ黒の群青、文字は游明朝、差し色は金箔の金だけ。光やグラデーションは使わず、
 * 平らな金の霞と金砂子を画像の境目をまたいで流して、並べたときの動きを出す。
 * アプリの画面は実機のスクショだけを使う。
 */

const FRAMES = 4;
export const FRAME = {
  iphone: { w: 440, h: 956 },
  duoInner: { w: 1467, h: 1032 },
} as const;
export type StoreDevice = keyof typeof FRAME;

export type Lang = "ja" | "en";

/** 実機のスクショの公開パス。どちらも 01〜04 の 4 枚（富士と湖・秋 / 東山・春 / 松原・夏 / 山里・冬） */
export type Shots = { iphone: string[]; duoOpen: string[]; duoClosed: string[] };

/** Apple Design Resources の端末枠と、その中の画面の位置（枠に対する比）。touyou.github.io の scripts/measure-bezels.py が測る */
export type Bezel = { src: string; w: number; h: number; screen: { x: number; y: number; w: number; h: number } };
export type Bezels = { open?: Bezel; closed?: Bezel };

export const COLOR = { night: "#0A0B12", ink: "#F3EBDD", sub: "#9C968C", gold: "#C9A24E", leaf: "#B38D3F", silver: "#CFD3D6" } as const;
export const MINCHO = "font-['YuMincho','Yu_Mincho','Hiragino_Mincho_ProN',serif]";

/** 1 枚目・ヘッダー・検索結果で共通の見出し。朔と望には読みを振る */
export const LEAD: Record<Lang, { lines: string[]; sub: ReactNode }> = {
  ja: {
    lines: ["満ちては欠ける、", "てのひらの屏風。"],
    sub: (
      <>
        閉じて<ruby>朔<rt>さく</rt></ruby>、ひらいて<ruby>望<rt>ぼう</rt></ruby>。
      </>
    ),
  },
  en: { lines: ["Waxing and waning,", "a screen in your hand."], sub: "Closed, the new moon. Open, the full." },
};

const COPY: Record<Lang, { titles: string[][]; subs: ReactNode[]; name: string }> = {
  ja: {
    name: "月屏風",
    titles: [
      LEAD.ja.lines,
      ["金の霞に、", "銀の月。"],
      ["梅に燕子花、", "すすきに雪の笹。"],
      ["なにもしない、", "月見の夜。"],
    ],
    subs: [LEAD.ja.sub, "琳派の屏風に倣った、夜の絵。", "四つの景色と、四つの季節。", "通知も広告もなく。月に触れれば、月の話をひとつ。"],
  },
  en: {
    name: "Tsukibyobu",
    titles: [
      LEAD.en.lines,
      ["Gold mist,", "a silver moon."],
      ["Plum and iris,", "pampas and snow."],
      ["Nothing to do", "but watch the moon."],
    ],
    subs: [LEAD.en.sub, "A night painted after the Rinpa screens.", "Four landscapes, four seasons.", "No notifications, no ads. Tap the moon for a story."],
  },
};

/** 帯の中のある位置に置く。x は帯の左端からの距離なので、画像の境目をまたいで置ける */
export function At({ x, y, w, rotate = 0, z, children, className }: { x: number; y: number; w?: number; rotate?: number; z?: number; children: ReactNode; className?: string }) {
  const style: CSSProperties = { left: x, top: y, width: w, transform: rotate ? `rotate(${rotate}deg)` : undefined, zIndex: z };
  return (
    <div className={cn("absolute", className)} style={style}>
      {children}
    </div>
  );
}

/**
 * 実機のスクショを浮かせる。端末の枠は付けない。スクショの四隅はアプリが黒く塗っているので、角丸でその黒を落とす。
 * 縮小で潰れないよう next/image を通さない
 */
export function Screen({ src, width, kind, bezel }: { src: string; width: number; kind: "iphone" | "duoOpen" | "duoClosed"; bezel?: Bezel }) {
  if (bezel) {
    // 端末枠があるときは枠の中に画面をはめる。width は枠の幅
    const s = bezel.screen;
    return (
      <div className="relative shadow-[0_40px_70px_-20px_rgba(0,0,0,0.85)]" style={{ width, aspectRatio: `${bezel.w} / ${bezel.h}`, borderRadius: width * 0.06 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="absolute object-cover" style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, width: `${s.w * 100}%`, height: `${s.h * 100}%` }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={encodeURI(bezel.src)} alt="" className="absolute inset-0 h-full w-full" />
      </div>
    );
  }
  const radius = width * (kind === "iphone" ? 0.13 : 0.045);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className="block shadow-[0_40px_70px_-20px_rgba(0,0,0,0.85)] ring-1 ring-[#C9A24E]/30"
      style={{ width, borderRadius: radius }}
    />
  );
}

/** 再現できる乱数。金砂子の配置を撮るたびに変えない */
function random(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** 金砂子: 小さな四角い箔をまばらに撒く。上ほど多く、下は少なく */
export function GoldDust({ width, height, count, seed = 7, unit = 1 }: { width: number; height: number; count: number; seed?: number; unit?: number }) {
  const r = random(seed);
  const flakes = Array.from({ length: count }, () => {
    const y = r() ** 1.6 * height;
    return { x: r() * width, y, s: (1.5 + r() * 3.5) * unit, o: 0.35 + r() * 0.5 };
  });
  return (
    <div className="absolute inset-0" aria-hidden>
      {flakes.map((f, i) => (
        <span key={i} className="absolute" style={{ left: f.x, top: f.y, width: f.s, height: f.s, background: COLOR.gold, opacity: f.o }} />
      ))}
    </div>
  );
}

/**
 * 金の霞: 屏風絵のすやり霞のように、両端の丸い帯を 2 段ずらして重ねる。上の段は短く、lift で左右に寄せる。
 * 箔を貼った継ぎ目だけを少し濃い金で入れ、グラデーションは使わない
 */
export function Kasumi({ x, y, w, h, lift = 0.2, opacity = 0.9 }: { x: number; y: number; w: number; h: number; lift?: number; opacity?: number }) {
  const id = `kasumi-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const tile = h * 1.6;
  const upper = { x: w * lift, w: w * 0.5, h: h * 0.8 };
  const total = h + upper.h * 0.6;
  return (
    <svg className="absolute" style={{ left: x, top: y - upper.h * 0.6, opacity }} width={w} height={total} aria-hidden>
      <clipPath id={id}>
        <rect x={upper.x} y={0} width={upper.w} height={upper.h} rx={upper.h / 2} />
        <rect x={0} y={total - h} width={w} height={h} rx={h / 2} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width={w} height={total} fill={COLOR.gold} />
        {Array.from({ length: Math.ceil(w / tile) }, (_, i) => (
          <rect key={i} x={i * tile + (i % 2) * tile * 0.3} y={0} width={1.5} height={total} fill={COLOR.leaf} />
        ))}
      </g>
    </svg>
  );
}

/** 朔から望までの月相を並べる。光る側は右（上弦に向かって満ちていく） */
export function MoonPhases({ size, gap, count = 7 }: { size: number; gap: number; count?: number }) {
  return (
    <div className="flex items-center" style={{ gap }} aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <Moon key={i} lit={i / (count - 1)} size={size} />
      ))}
    </div>
  );
}

function Moon({ lit, size }: { lit: number; size: number }) {
  const r = 50;
  // 明暗の境目は楕円。輝面比が半分より小さいと境目は右へ膨らみ、大きいと左へ膨らむ
  const rx = Math.abs(1 - 2 * lit) * r;
  const sweep = lit < 0.5 ? 0 : 1;
  return (
    <svg viewBox="-52 -52 104 104" width={size} height={size}>
      <circle r={r} fill="#1B1D29" stroke={COLOR.silver} strokeOpacity={0.35} strokeWidth={2} />
      {lit > 0 && lit < 1 && <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 0 ${r} A ${rx} ${r} 0 0 ${sweep} 0 ${-r} Z`} fill={COLOR.silver} />}
      {lit >= 1 && <circle r={r} fill={COLOR.silver} />}
    </svg>
  );
}

const TITLE = { iphone: { size: 36, top: 92, inset: 30, sub: 15 }, duoInner: { size: 58, top: 96, inset: 84, sub: 24 } } as const;

function Title({ device, index, lines, sub }: { device: StoreDevice; index: number; lines: string[]; sub: ReactNode }) {
  const { size, top, inset, sub: subSize } = TITLE[device];
  const { w } = FRAME[device];
  return (
    <div className="absolute z-30 flex flex-col" style={{ left: index * w + inset, top, width: w - inset * 2, gap: size * 0.45 }}>
      <h2 className={cn(MINCHO, "font-semibold leading-[1.3] [font-feature-settings:'palt']")} style={{ fontSize: size, color: COLOR.ink }}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h2>
      <p className={cn(MINCHO, "leading-[1.7] [font-feature-settings:'palt']")} style={{ fontSize: subSize, color: COLOR.sub }}>
        {sub}
      </p>
    </div>
  );
}

function Eyebrow({ device, name }: { device: StoreDevice; name: string }) {
  const big = device === "duoInner";
  return (
    <At x={big ? 84 : 30} y={big ? 40 : 40} z={30} className="flex items-center gap-2.5">
      <TsukibyobuIcon className={cn("shadow-none ring-0", big ? "h-10 w-10" : "h-8 w-8")} />
      <span className={cn(MINCHO, "font-semibold")} style={{ fontSize: big ? 22 : 16, color: COLOR.sub }}>
        {name}
      </span>
    </At>
  );
}

/**
 * 4 枚を一隻の屏風の扇に見立てる。扇ごとに細い金の縁を内側に引き、隣の扇との境目には蝶番を置く。
 * 縁は画像の端から少し内側に引くので、切り分けても線が途切れない
 */
function Panels({ device }: { device: StoreDevice }) {
  const { w, h } = FRAME[device];
  const inset = device === "iphone" ? 10 : 16;
  const hinge = { w: device === "iphone" ? 5 : 8, h: device === "iphone" ? 34 : 44 };
  return (
    <div className="absolute inset-0" aria-hidden>
      {Array.from({ length: FRAMES }, (_, i) => (
        <span key={i} className="absolute" style={{ left: i * w + inset, top: inset, width: w - inset * 2, height: h - inset * 2, border: `1.5px solid ${COLOR.gold}`, opacity: 0.45 }} />
      ))}
      {/* 蝶番は扇の右端と、次の扇の左端に半分ずつかかる */}
      {Array.from({ length: FRAMES * 2 }, (_, i) => {
        const panel = Math.floor(i / 2);
        const right = i % 2 === 0;
        return [0.18, 0.82].map((y) => (
          <span
            key={`${i}-${y}`}
            className="absolute"
            style={{ left: right ? (panel + 1) * w - inset - hinge.w / 2 : panel * w + inset - hinge.w / 2, top: h * y - hinge.h / 2, width: hinge.w, height: hinge.h, background: COLOR.gold, opacity: (right && panel === FRAMES - 1) || (!right && panel === 0) ? 0 : 0.8 }}
          />
        ));
      })}
    </div>
  );
}

export function TsukibyobuStoreStrip({ device, lang, shots, bezels = {} }: { device: StoreDevice; lang: Lang; shots: Shots; bezels?: Bezels }) {
  const t = COPY[lang];
  const { w, h } = FRAME[device];
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang={lang}
      className="relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w * FRAMES, height: h, background: COLOR.night }}
    >
      {/* 開発サーバーのインジケータを写さない */}
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <GoldDust width={w * FRAMES} height={h} count={device === "iphone" ? 90 : 160} unit={device === "iphone" ? 1 : 1.6} />
      <Panels device={device} />
      {device === "iphone" ? <IphoneScene shots={shots} /> : <DuoScene shots={shots} bezel={bezels.open} />}
      <Eyebrow device={device} name={t.name} />
      {t.titles.map((lines, i) => (
        <Title key={i} device={device} index={i} lines={lines} sub={t.subs[i]} />
      ))}
    </div>
  );
}

/**
 * iPhone の 4 枚。霞は 1→2 枚目と 3→4 枚目の境目をまたぐ 2 本を、高さを変えて置く。
 * 3 枚目は 4 つの場所を扇のように重ね、1 枚目と最後の 1 枚は画面 1 枚だけで落ち着かせる
 */
function IphoneScene({ shots }: { shots: Shots }) {
  const W = FRAME.iphone.w;
  const fan = [
    { x: 2 * W + 36, y: 330, r: -8 },
    { x: 2 * W + 106, y: 305, r: -3 },
    { x: 2 * W + 176, y: 305, r: 3 },
    { x: 2 * W + 246, y: 330, r: 8 },
  ];
  return (
    <>
      <Kasumi x={W - 170} y={250} w={330} h={24} />
      <Kasumi x={3 * W - 120} y={870} w={290} h={22} lift={0.4} opacity={0.75} />

      {/* 1. 表紙: 満ちた月 */}
      <At x={78} y={278} z={10}>
        <Screen src={shots.iphone[0]} width={290} kind="iphone" />
      </At>

      {/* 2. 東山・春。少し傾けて流れを作る */}
      <At x={W + 92} y={290} rotate={3} z={10}>
        <Screen src={shots.iphone[1]} width={290} kind="iphone" />
      </At>

      {/* 3. 4 つの場所を扇に開く */}
      {fan.map((f, i) => (
        <At key={i} x={f.x} y={f.y} rotate={f.r} z={10 + i}>
          <Screen src={shots.iphone[i]} width={160} kind="iphone" />
        </At>
      ))}

      {/* 4. 山里・冬。まっすぐ置いて締める */}
      <At x={3 * W + 76} y={278} z={10}>
        <Screen src={shots.iphone[3]} width={290} kind="iphone" />
      </At>
    </>
  );
}

/** 開いた Duo の 4 枚。見出しは左上、画面は右下。3 枚目は 4 つの場所を少しずつずらして並べる */
function DuoScene({ shots, bezel }: { shots: Shots; bezel?: Bezel }) {
  const W = FRAME.duoInner.w;
  const row = [
    { x: 2 * W + 60, y: 470, r: -4 },
    { x: 2 * W + 380, y: 420, r: -1.5 },
    { x: 2 * W + 700, y: 420, r: 1.5 },
    { x: 2 * W + 1020, y: 470, r: 4 },
  ];
  return (
    <>
      <Kasumi x={W - 360} y={334} w={640} h={34} />
      <Kasumi x={3 * W - 260} y={960} w={560} h={32} lift={0.4} opacity={0.75} />

      <At x={500} y={340} z={10}>
        <Screen src={shots.duoOpen[0]} width={900} kind="duoOpen" bezel={bezel} />
      </At>
      <At x={W + 500} y={350} rotate={2} z={10}>
        <Screen src={shots.duoOpen[1]} width={880} kind="duoOpen" bezel={bezel} />
      </At>
      {row.map((p, i) => (
        <At key={i} x={p.x} y={p.y} rotate={p.r} z={10 + i}>
          <Screen src={shots.duoOpen[i]} width={400} kind="duoOpen" bezel={bezel} />
        </At>
      ))}
      <At x={3 * W + 500} y={340} z={10}>
        <Screen src={shots.duoOpen[3]} width={900} kind="duoOpen" bezel={bezel} />
      </At>
    </>
  );
}

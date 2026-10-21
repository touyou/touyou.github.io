"use client";

import type { ReactNode } from "react";

import { At, type Bezels, Device } from "../intento/strip";
import { Backlight, type CardName, INK, NightSky, ScanResult, ShotCrop, TCard, ToretaIcon, Viewfinder } from "./parts";

/**
 * Toreta の App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * Toreta は iPhone 専用で日本語だけなので、iPhone（440×956 を 3 倍）と、開いた iPhone Duo（1467×1032 を 1.94477 倍）を持つ。
 * 地は夜空の紺で、アプリのサンプルのカードを画像の境目にまたがせて置き、並べたときに 1 本の流れに見せる。
 * 端末とカードの傾きは画像ごとに左右を交互にし、端末の画像と絵の画像（集め具合・読み取り）も交互に並べる。
 */

const FRAMES = 6;
const FRAME = { iphone: { w: 440, h: 956 }, duoInner: { w: 1467, h: 1032 } } as const;
export type ToretaDevice = keyof typeof FRAME;

/** 実機のスクショ（_store-screenshots/Toreta から写したもの）の公開パス */
export type ToretaShots = {
  series: string;
  collection: string;
  trade: string;
  deck: string;
  duoOpenCollection?: string;
  duoOpenTrade?: string;
  duoOpenDeck?: string;
  duoClosedSeries?: string;
};

// 見出しの上の小さな札は、どの画像でも同じ位置・同じ色で繰り返す（1 枚目だけはアイコンとアプリ名）
const COPY: { tag: string; lines: [string, string] }[] = [
  { tag: "Toreta", lines: ["持っているカードを、", "シリーズごとに記録。"] },
  { tag: "集め具合", lines: ["何種そろったか、", "レアリティごとに。"] },
  { tag: "取り込み", lines: ["公式のカードリストを", "URL から取り込み。"] },
  { tag: "読み取り", lines: ["カメラにかざして、", "番号を読み取る。"] },
  { tag: "トレード", lines: ["ゆずる・もとめるを", "画像にして書き出し。"] },
  { tag: "デッキ", lines: ["デッキの足りない分を", "「ねらい」にまとめて。"] },
];

const TITLE = { iphone: { size: 34, tag: 15, top: 64, inset: 28, icon: 30 }, duoInner: { size: 58, tag: 22, top: 78, inset: 88, icon: 44 } } as const;

function Title({ device, index }: { device: ToretaDevice; index: number }) {
  const { size, tag, top, inset, icon } = TITLE[device];
  const { w } = FRAME[device];
  const { tag: label, lines } = COPY[index];
  return (
    <div className="absolute z-30 flex flex-col" style={{ left: index * w + inset, top, width: w - inset * 2, gap: size * 0.42 }}>
      <div className="flex items-center font-bold tracking-[0.04em]" style={{ height: icon, gap: tag * 0.6, fontSize: tag, color: INK.gold }}>
        {index === 0 ? (
          <>
            <ToretaIcon size={icon} />
            <span className="text-white" style={{ fontSize: tag * 1.15 }}>
              {label}
            </span>
          </>
        ) : (
          <>
            {/* アイコンの前のカードと同じ形の小さな札 */}
            <span className="inline-block rounded-[3px] border-2" style={{ width: tag * 0.7, height: tag * 0.98, borderColor: INK.gold, transform: "rotate(9deg)" }} />
            <span>{label}</span>
          </>
        )}
      </div>
      <h2 className="font-bold leading-[1.22] tracking-[-0.01em] [font-feature-settings:'palt']" style={{ fontSize: size, color: INK.text }}>
        {lines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

export function ToretaStoreStrip({ device, shots, bezels = {} }: { device: ToretaDevice; shots: ToretaShots; bezels?: Bezels }) {
  const { w, h } = FRAME[device];
  // 光の位置は iPhone の帯で決め、Duo の帯の大きさに引き伸ばす
  const sx = w / FRAME.iphone.w;
  const sy = h / FRAME.iphone.h;
  const glows = [
    { x: 120, y: 700, c: "#5146D9" },
    { x: 620, y: 420, c: "#2F6BF2" },
    { x: 1080, y: 720, c: "#8A3FD1" },
    { x: 1540, y: 380, c: "#5146D9" },
    { x: 1980, y: 760, c: "#11847E" },
    { x: 2440, y: 440, c: "#2F6BF2" },
  ].map((g) => ({ x: g.x * sx, y: g.y * sy, rx: 260 * sx, ry: 220 * sy, c: g.c, o: 0.55 }));
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang="ja"
      className="relative overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w * FRAMES, height: h, background: `linear-gradient(180deg, ${INK.top}, ${INK.bottom})` }}
    >
      {/* 開発サーバーのインジケータを写さない */}
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <NightSky glows={glows} id={`toreta-grain-${device}`} />
      {device === "iphone" ? <IphoneScene shots={shots} /> : <DuoOpenScene shots={shots} bezels={bezels} />}
      {COPY.map((_, i) => (
        <Title key={i} device={device} index={i} />
      ))}
    </div>
  );
}

/** カードを置く。z を端末（10）より小さくすると後ろに回る */
function Card({ x, y, w, rotate, card, blur, z = 5 }: { x: number; y: number; w: number; rotate: number; card: CardName; blur?: number; z?: number }) {
  return (
    <At x={x} y={y} rotate={rotate} z={z}>
      <TCard card={card} width={w} blur={blur} />
    </At>
  );
}

/** 公式カードリストの URL を貼る欄。取り込みの画像で使う */
function UrlField({ zoom = 1 }: { zoom?: number }) {
  return (
    <div className="flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white/95 py-2.5 pl-3 pr-5 text-[#1d1d1f] shadow-[0_24px_50px_-16px_rgba(5,4,25,0.7)]" style={{ zoom }}>
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#5146D9]">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" aria-hidden>
          <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold text-neutral-500">公式カードリストの URL</span>
        <span className="text-[14px] font-semibold">https://…/cardlist/</span>
      </span>
    </div>
  );
}

/** 読み取りの絵: 枠の中のカードと、見つかったカードの知らせ。カードと知らせは逆に傾ける */
function ScanScene({ x, y, cardW, rotate, resultX, resultY, zoom, children }: { x: number; y: number; cardW: number; rotate: number; resultX: number; resultY: number; zoom: number; children?: ReactNode }) {
  const cardH = (cardW * 88) / 63;
  const pad = cardW * 0.14;
  return (
    <>
      {children}
      <Backlight color="#7B6BEA" style={{ left: x - pad, top: y - pad, width: cardW + pad * 2, height: cardH + pad * 2 }} />
      <At x={x - pad} y={y - pad} z={12}>
        <Viewfinder width={cardW + pad * 2} height={cardH + pad * 2} stroke={Math.max(4, cardW * 0.022)} />
      </At>
      <Card x={x} y={y} w={cardW} rotate={rotate} card="bell" z={11} />
      {/* 読み取り中の光の線 */}
      <At x={x - pad * 0.6} y={y + cardH * 0.42} w={cardW + pad * 1.2} z={13}>
        <div className="h-[3px] rounded-full bg-white shadow-[0_0_24px_6px_rgba(160,150,255,0.85)]" />
      </At>
      <At x={resultX} y={resultY} rotate={-Math.sign(rotate) * 3} z={14}>
        <ScanResult card="bell" owned={4} zoom={zoom} />
      </At>
    </>
  );
}

// コレクションの画面の上にある「集め具合」の枠（何種そろったか・レアリティごと・ねらいのカード）の位置。実機のスクショの画素で測った
const SUMMARY = {
  iphone: { srcW: 1320, srcH: 2868, x: 46, y: 681, w: 1229, h: 644, radius: 62 },
  duo: { srcW: 2853, srcH: 2007, x: 1006, y: 303, w: 1550, h: 645, radius: 62 },
} as const;

/** 集め具合の絵: 1 枚目の画面の「集め具合」の枠を拡大して浮かせ、横にレアリティの違うカード（SR・R・C）を扇に並べる */
function SummaryScene({ src, crop, x, y, width, rotate, cards }: { src: string; crop: (typeof SUMMARY)[keyof typeof SUMMARY]; x: number; y: number; width: number; rotate: number; cards: { x: number; y: number; w: number; rotate: number; card: CardName; z: number }[] }) {
  const h = (width * crop.h) / crop.w;
  return (
    <>
      <Backlight color="#7B6BEA" style={{ left: x + width * 0.08, top: y + h * 0.1, width: width * 0.84, height: h * 0.9 }} />
      <At x={x} y={y} rotate={rotate} z={12}>
        <ShotCrop src={src} crop={crop} width={width} />
      </At>
      {cards.map((c) => (
        <Card key={c.card} {...c} />
      ))}
    </>
  );
}

function IphoneScene({ shots }: { shots: ToretaShots }) {
  const W = FRAME.iphone.w;
  const DW = 300;
  return (
    <>
      {/* 1. 表紙: コレクションの画面と、後ろに扇に開いたカード */}
      <Card x={18} y={600} w={128} rotate={-16} card="mina" z={4} />
      <Card x={52} y={560} w={128} rotate={-8} card="kai" z={5} />
      <Backlight color="#5146D9" style={{ left: 110, top: 300, width: 300, height: 560 }} />
      <At x={112} y={252} w={DW} rotate={-3} z={10}>
        <Device src={shots.collection} kind="iphone" width={DW} />
      </At>

      {/* 2. 集め具合: 1 枚目の画面の上の枠を拡大する。見出しと左端をそろえる */}
      <SummaryScene
        src={shots.collection}
        crop={SUMMARY.iphone}
        x={W + 28}
        y={262}
        width={384}
        rotate={3}
        cards={[
          { x: W + 40, y: 610, w: 132, rotate: -12, card: "bell", z: 6 },
          { x: W + 154, y: 584, w: 132, rotate: 0, card: "luka", z: 8 },
          { x: W + 268, y: 610, w: 132, rotate: 12, card: "mina", z: 7 },
        ]}
      />
      {/* 2|3 の境目をまたぐ、ぼかした奥のカード */}
      <Card x={2 * W - 70} y={420} w={140} rotate={12} card="shion" blur={5} z={2} />

      {/* 3. 取り込み: URL を貼る欄から、シリーズの一覧へ */}
      <Backlight color="#2F6BF2" style={{ left: 2 * W + 60, top: 320, width: 300, height: 560 }} />
      <At x={2 * W + 70} y={300} w={DW} rotate={-3} z={10}>
        <Device src={shots.series} kind="iphone" width={DW} />
      </At>
      <At x={2 * W + 26} y={232} rotate={2} z={20}>
        <UrlField zoom={1.05} />
      </At>
      {/* 取り込んだカードが、画面の下から手前にこぼれる */}
      <Card x={2 * W + 110} y={640} w={124} rotate={-10} card="kai" z={12} />
      <Card x={2 * W + 222} y={616} w={124} rotate={4} card="rei" z={13} />
      <Card x={3 * W - 60} y={720} w={120} rotate={14} card="mina" z={12} />

      {/* 4. 読み取り: 端末の画面ではなく、カメラの枠とカードで見せる */}
      <ScanScene x={3 * W + 104} y={296} cardW={232} rotate={4} resultX={3 * W + 34} resultY={760} zoom={1.15}>
        <Card x={3 * W + 20} y={520} w={130} rotate={10} card="kai" blur={6} z={3} />
        <Card x={3 * W + 300} y={250} w={120} rotate={-12} card="rei" blur={6} z={3} />
      </ScanScene>

      {/* 5. トレード: ゆずる・もとめる */}
      <Backlight color="#5146D9" style={{ left: 4 * W + 64, top: 320, width: 300, height: 560 }} />
      <At x={4 * W + 82} y={252} w={DW} rotate={-3} z={10}>
        <Device src={shots.trade} kind="iphone" width={DW} />
      </At>
      <Card x={5 * W - 74} y={400} w={140} rotate={-12} card="kai" blur={5} z={2} />

      {/* 6. デッキ: 後ろにデッキのカードを扇に重ねる */}
      <Card x={5 * W + 250} y={600} w={130} rotate={18} card="rei" z={4} />
      <Card x={5 * W + 226} y={560} w={130} rotate={10} card="shion" z={5} />
      <Backlight color="#11847E" style={{ left: 5 * W + 60, top: 320, width: 300, height: 560 }} />
      <At x={5 * W + 64} y={256} w={DW} rotate={3} z={10}>
        <Device src={shots.deck} kind="iphone" width={DW} />
      </At>
    </>
  );
}

/**
 * 開いた Duo（横向き）の 6 枚。見出しは左上、端末は右に置く。閉じた形は取り込み（3 枚目）でだけ使い、
 * 開いた形と同じ画面を並べて見せることはしない
 */
function DuoOpenScene({ shots, bezels }: { shots: ToretaShots; bezels: Bezels }) {
  const W = FRAME.duoInner.w;
  const OW = 900;
  const ox = W - OW - 60;
  return (
    <>
      {/* 1. 表紙 */}
      <Card x={70} y={560} w={200} rotate={-14} card="mina" z={4} />
      <Card x={200} y={520} w={200} rotate={-5} card="kai" z={5} />
      <Backlight color="#5146D9" style={{ left: ox + 40, top: 320, width: OW - 80, height: 560 }} />
      <At x={ox} y={300} w={OW} rotate={-3} z={10}>
        <Device src={shots.duoOpenCollection!} kind="duoOpen" width={OW} bezel={bezels.open} />
      </At>

      {/* 2. 集め具合: 開いた形の画面の枠を拡大する。見出しと左端をそろえ、右にカードの扇 */}
      <SummaryScene
        src={shots.duoOpenCollection!}
        crop={SUMMARY.duo}
        x={W + 88}
        y={380}
        width={940}
        rotate={3}
        cards={[
          { x: W + 1080, y: 220, w: 180, rotate: -12, card: "bell", z: 6 },
          { x: W + 1150, y: 540, w: 180, rotate: 8, card: "luka", z: 7 },
        ]}
      />
      <Card x={2 * W - 110} y={800} w={190} rotate={-10} card="mina" blur={8} z={2} />

      {/* 3. 取り込み: 閉じた形で、取り込んだシリーズの一覧 */}
      <At x={2 * W + 88} y={330} rotate={2} z={20}>
        <UrlField zoom={1.7} />
      </At>
      <Card x={2 * W + 150} y={600} w={170} rotate={-10} card="kai" z={6} />
      <Card x={2 * W + 330} y={640} w={170} rotate={6} card="rei" z={7} />
      <Backlight color="#2F6BF2" style={{ left: 2 * W + 860, top: 260, width: 400, height: 600 }} />
      <At x={2 * W + 840} y={220} w={430} rotate={-3} z={10}>
        <Device src={shots.duoClosedSeries!} kind="duoClosed" width={430} bezel={bezels.closed} />
      </At>
      <Card x={3 * W - 90} y={760} w={180} rotate={-12} card="shion" blur={6} z={2} />

      {/* 4. 読み取り */}
      <ScanScene x={3 * W + 820} y={250} cardW={330} rotate={4} resultX={3 * W + 110} resultY={560} zoom={1.7}>
        <Card x={3 * W + 600} y={560} w={190} rotate={12} card="kai" blur={8} z={3} />
        <Card x={3 * W + 1220} y={220} w={170} rotate={-10} card="rei" blur={8} z={3} />
      </ScanScene>

      {/* 5. トレード */}
      <Card x={4 * W + 110} y={600} w={190} rotate={-12} card="kai" z={5} />
      <Card x={4 * W + 290} y={560} w={190} rotate={8} card="luka" z={6} />
      <Backlight color="#5146D9" style={{ left: 4 * W + ox + 40, top: 320, width: OW - 80, height: 560 }} />
      <At x={4 * W + ox} y={300} w={OW} rotate={-3} z={10}>
        <Device src={shots.duoOpenTrade!} kind="duoOpen" width={OW} bezel={bezels.open} />
      </At>
      <Card x={5 * W - 100} y={720} w={200} rotate={-12} card="mina" blur={8} z={2} />

      {/* 6. デッキ: 扇に重ねたカード */}
      <Card x={5 * W + 90} y={620} w={180} rotate={-18} card="rei" z={4} />
      <Card x={5 * W + 210} y={580} w={180} rotate={-8} card="shion" z={5} />
      <Card x={5 * W + 330} y={560} w={180} rotate={2} card="mina" z={6} />
      <Backlight color="#11847E" style={{ left: 5 * W + ox + 40, top: 320, width: OW - 80, height: 560 }} />
      <At x={5 * W + ox} y={300} w={OW} rotate={3} z={10}>
        <Device src={shots.duoOpenDeck!} kind="duoOpen" width={OW} bezel={bezels.open} />
      </At>
    </>
  );
}

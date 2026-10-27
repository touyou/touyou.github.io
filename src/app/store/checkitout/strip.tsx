"use client";

import { PAD_COLORS, type PadColor } from "@/components/checkitout/pads";
import { cn } from "@/lib/utils";

import { At, type Bezels, Device } from "../intento/strip";
import { BokehPads, Confetti, FONT, GRAIN, Glow, NeonPad, Phone, Tag, Waveform } from "./parts";

/**
 * チェケラの App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 大きさと撮り方は intento/strip.tsx と同じ（iPhone 440×956 を 3 倍、iPad 1032×1376 を 2 倍、Duo 1467×1032 を 1.94477 倍）。
 * 地はアプリと同じほぼ黒で、6 枚それぞれにパッドの色を 1 つずつ割り当て（赤→黄→緑→青→赤→黄）、見出しの札・端末の下の光に使う。
 * 端末の傾きは左から順に左右を交互にする。画像の境目にはピントの外れたパッドを置き、隣の画像へ流れて見せる。
 */

const FRAMES = 6;
const FRAME = {
  iphone: { w: 440, h: 956 },
  ipad: { w: 1032, h: 1376 },
  duoInner: { w: 1467, h: 1032 },
} as const;
export type StoreDevice = keyof typeof FRAME;

/** 実機のスクショ（_store-screenshots/CheckItOut）の公開パス */
export type Shots = {
  iphonePlay: string;
  iphoneEdit: string;
  iphoneRecord: string;
  iphoneLandscape: string;
  ipadPlay: string;
  ipadEdit: string;
  ipadRecord: string;
  ipadLandscape: string;
  duoOpenPlay?: string;
  duoOpenEdit?: string;
  duoClosedPlay?: string;
  duoClosedEdit?: string;
  duoClosedRecord?: string;
};

type Slide = { tag: string; color: PadColor; lines: string[] };

// 機能はアプリの実装（CheckItOut/Checkitout/Views）にあるものだけを書く
const SLIDES: Slide[] = [
  { tag: "PLAY", color: "red", lines: ["叩けば鳴る、", "16 のパッド。"] },
  { tag: "REC", color: "yellow", lines: ["声も物音も、", "録れば楽器に。"] },
  { tag: "EDIT", color: "green", lines: ["録った音を、", "好きなパッドへ。"] },
  { tag: "TAP", color: "blue", lines: ["連打も、", "重ね打ちも。"] },
  { tag: "LAYOUT", color: "red", lines: ["画面に合わせて、", "並びが変わる。"] },
  { tag: "iPad", color: "yellow", lines: ["iPhone でも、", "iPad でも。"] },
];

const CAPTIONS = { retrigger: ["同じパッドは、", "頭から鳴り直す。"], layer: ["別々のパッドは、", "重なって鳴る。"] };

const TITLE = {
  iphone: { size: 42, tag: 14, top: 64, inset: 28 },
  ipad: { size: 76, tag: 24, top: 110, inset: 72 },
  duoInner: { size: 58, tag: 20, top: 80, inset: 84 },
} as const;

function Title({ device, index, slide }: { device: StoreDevice; index: number; slide: Slide }) {
  const { size, tag, top, inset } = TITLE[device];
  const { w } = FRAME[device];
  return (
    <div className="absolute z-30 flex flex-col" style={{ left: index * w + inset, top, width: w - inset * 2, gap: tag * 1.1 }}>
      <Tag color={slide.color} label={slide.tag} size={tag} />
      <h2 className="font-black leading-[1.18] tracking-[-0.03em] text-white [font-feature-settings:'palt']" style={{ fontSize: size }}>
        {slide.lines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

export function CheckitoutStoreStrip({ device, shots, bezels = {} }: { device: StoreDevice; shots: Shots; bezels?: Bezels }) {
  const { w, h } = FRAME[device];
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang="ja"
      className={cn("relative overflow-hidden text-white antialiased [&_*]:!animate-none [&_*]:!transition-none", FONT)}
      style={{ width: w * FRAMES, height: h, backgroundColor: "#0B0B0B", backgroundImage: GRAIN }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0;background:#0B0B0B}"}</style>
      {device === "iphone" && <IphoneScene shots={shots} />}
      {device === "ipad" && <IpadScene shots={shots} />}
      {device === "duoInner" && <DuoScene shots={shots} bezels={bezels} />}
      {SLIDES.map((slide, i) => (
        <Title key={i} device={device} index={i} slide={slide} />
      ))}
    </div>
  );
}

/** 画像の境目に置く、ピントの外れたパッド。左右の画像の色を 2 つずつ持つ */
function Seams({ device, ys, size, blur }: { device: StoreDevice; ys: number[]; size: number; blur: number }) {
  const { w } = FRAME[device];
  const cluster = size * 2 + size * 0.12;
  return (
    <>
      {ys.map((y, i) => {
        const a = SLIDES[i].color;
        const b = SLIDES[i + 1].color;
        return (
          <At key={i} x={(i + 1) * w - cluster / 2} y={y} rotate={i % 2 === 0 ? 10 : -10} z={1}>
            <BokehPads colors={[a, b, b, a]} size={size} blur={blur} />
          </At>
        );
      })}
    </>
  );
}

/** 編集の図: 一覧で選んだ音を、空いているパッドに割り当てる */
function AssignChip({ size = 1 }: { size?: number }) {
  return (
    <div className="flex items-center" style={{ gap: 14 * size }}>
      <span
        className="flex items-center rounded-[14px] bg-[#0A84FF] font-bold shadow-[0_20px_40px_-12px_rgba(0,0,0,0.8)]"
        style={{ gap: 18 * size, padding: `${12 * size}px ${16 * size}px`, fontSize: 17 * size, borderRadius: 14 * size }}
      >
        笑い声
        <span className="font-semibold text-white/75" style={{ fontSize: 13 * size }}>
          NONE
        </span>
      </span>
      <svg width={34 * size} height={16 * size} viewBox="0 0 34 16" aria-hidden>
        <path d="M1 8h28M23 2l7 6-7 6" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <NeonPad color="blue" size={84 * size} pressed label="笑い声" />
    </div>
  );
}

/** 連打の図: 同じパッドを続けて押すと、残像のように重なる */
function Retrigger({ size }: { size: number }) {
  return (
    <div className="relative" style={{ width: size * 1.36, height: size * 1.36 }}>
      {[0.36, 0.24, 0.12].map((o, i) => (
        <NeonPad key={o} color="blue" size={size} className="absolute" style={{ left: o * size, top: (0.36 - o) * size, opacity: 0.25 + i * 0.2, filter: `blur(${(2 - i) * size * 0.012}px)` }} />
      ))}
      <NeonPad color="blue" size={size} pressed className="absolute" style={{ left: 0, top: size * 0.36 }} />
    </div>
  );
}

/** 重ね打ちの図: 違う色のパッドを同時に押す */
function Layered({ size }: { size: number }) {
  return (
    <div className="relative" style={{ width: size * 1.7, height: size * 1.25 }}>
      <NeonPad color="red" size={size} pressed className="absolute" style={{ left: 0, top: 0 }} />
      <NeonPad color="green" size={size} pressed className="absolute" style={{ left: size * 0.7, top: size * 0.25 }} />
    </div>
  );
}

function Caption({ lines, size }: { lines: string[]; size: number }) {
  return (
    <p className="font-bold leading-[1.45] text-white/80 [font-feature-settings:'palt']" style={{ fontSize: size }}>
      {lines.map((l) => (
        <span key={l} className="block whitespace-nowrap">
          {l}
        </span>
      ))}
    </p>
  );
}

function IphoneScene({ shots }: { shots: Shots }) {
  const W = FRAME.iphone.w;
  return (
    <>
      <Seams device="iphone" ys={[640, 300, 700, 330, 680]} size={58} blur={5} />

      {/* 1. PLAY: 端末の上に紙吹雪 */}
      <Confetti x={0} y={0} w={440} h={956} count={90} unit={1.3} avoid={{ x: 20, y: 50, w: 360, h: 150 }} />
      <Glow x={70} y={420} w={300} h={420} color="red" opacity={0.32} />
      <At x={78} y={250} w={300} rotate={-3} z={10}>
        <Phone src={shots.iphonePlay} kind="iphone" width={300} />
      </At>

      {/* 2. REC: 波形を手前に大きく */}
      <Glow x={W + 60} y={420} w={320} h={420} color="yellow" opacity={0.3} />
      <At x={W + 70} y={250} w={300} rotate={3} z={10}>
        <Phone src={shots.iphoneRecord} kind="iphone" width={300} />
      </At>
      <At x={W + 20} y={770} z={20}>
        <Waveform width={400} height={150} color={PAD_COLORS.yellow} />
      </At>

      {/* 3. EDIT */}
      <Glow x={2 * W + 70} y={420} w={300} h={420} color="green" opacity={0.3} />
      <At x={2 * W + 80} y={250} w={300} rotate={-3} z={10}>
        <Phone src={shots.iphoneEdit} kind="iphone" width={300} />
      </At>
      <At x={2 * W + 24} y={820} rotate={3} z={20}>
        <AssignChip />
      </At>

      {/* 4. TAP: 端末を置かず、パッドの図だけで見せる */}
      <Glow x={3 * W + 40} y={300} w={360} h={560} color="blue" opacity={0.22} blur={110} />
      <At x={3 * W + 28} y={250} rotate={4} z={10}>
        <Retrigger size={150} />
      </At>
      <At x={3 * W + 262} y={352} z={10}>
        <Caption lines={CAPTIONS.retrigger} size={18} />
      </At>
      <At x={3 * W + 28} y={600} rotate={4} z={10}>
        <Layered size={118} />
      </At>
      <At x={3 * W + 262} y={640} z={10}>
        <Caption lines={CAPTIONS.layer} size={18} />
      </At>

      {/* 5. LAYOUT: 横向きと縦向き */}
      <Glow x={4 * W + 40} y={360} w={360} h={440} color="red" opacity={0.28} />
      <At x={4 * W + 24} y={280} w={392} rotate={-3} z={10}>
        <Phone src={shots.iphoneLandscape} kind="iphone" width={392} landscape />
      </At>
      <At x={4 * W + 210} y={520} w={180} rotate={4} z={11}>
        <Phone src={shots.iphonePlay} kind="iphone" width={180} />
      </At>

      {/* 6. iPhone と iPad */}
      <Glow x={5 * W + 60} y={380} w={340} h={420} color="yellow" opacity={0.28} />
      <At x={5 * W + 92} y={290} w={330} rotate={3} z={9}>
        <Phone src={shots.ipadPlay} kind="ipad" width={330} />
      </At>
      <At x={5 * W + 28} y={560} w={160} rotate={-5} z={10}>
        <Phone src={shots.iphonePlay} kind="iphone" width={160} />
      </At>
    </>
  );
}

function IpadScene({ shots }: { shots: Shots }) {
  const W = FRAME.ipad.w;
  return (
    <>
      <Seams device="ipad" ys={[900, 420, 980, 460, 940]} size={110} blur={9} />

      {/* 1. PLAY: 端末の上に紙吹雪 */}
      <Confetti x={0} y={0} w={1032} h={1376} count={130} unit={1.8} seed={2} avoid={{ x: 60, y: 90, w: 640, h: 230 }} />
      <Glow x={180} y={600} w={680} h={600} color="red" opacity={0.3} blur={150} />
      <At x={170} y={380} w={700} rotate={-3} z={10}>
        <Phone src={shots.ipadPlay} kind="ipad" width={700} />
      </At>

      {/* 2. REC */}
      <Glow x={W + 180} y={600} w={680} h={600} color="yellow" opacity={0.28} blur={150} />
      <At x={W + 170} y={380} w={700} rotate={3} z={10}>
        <Phone src={shots.ipadRecord} kind="ipad" width={700} />
      </At>
      <At x={W + 72} y={1050} z={20}>
        <Waveform width={888} height={250} color={PAD_COLORS.yellow} bars={120} />
      </At>

      {/* 3. EDIT */}
      <Glow x={2 * W + 180} y={600} w={680} h={600} color="green" opacity={0.28} blur={150} />
      <At x={2 * W + 170} y={380} w={700} rotate={-3} z={10}>
        <Phone src={shots.ipadEdit} kind="ipad" width={700} />
      </At>
      <At x={2 * W + 72} y={1080} rotate={3} z={20}>
        <AssignChip size={1.9} />
      </At>

      {/* 4. TAP */}
      <Glow x={3 * W + 120} y={420} w={760} h={800} color="blue" opacity={0.2} blur={170} />
      <At x={3 * W + 72} y={340} rotate={4} z={10}>
        <Retrigger size={300} />
      </At>
      <At x={3 * W + 600} y={560} z={10}>
        <Caption lines={CAPTIONS.retrigger} size={36} />
      </At>
      <At x={3 * W + 80} y={860} rotate={4} z={10}>
        <Layered size={255} />
      </At>
      <At x={3 * W + 600} y={970} z={10}>
        <Caption lines={CAPTIONS.layer} size={36} />
      </At>

      {/* 5. LAYOUT */}
      <Glow x={4 * W + 120} y={480} w={760} h={640} color="red" opacity={0.26} blur={150} />
      <At x={4 * W + 64} y={420} w={880} rotate={-3} z={10}>
        <Phone src={shots.ipadLandscape} kind="ipad" width={880} landscape />
      </At>
      <At x={4 * W + 620} y={800} w={330} rotate={4} z={11}>
        <Phone src={shots.ipadPlay} kind="ipad" width={330} />
      </At>

      {/* 6. iPad と iPhone */}
      <Glow x={5 * W + 200} y={560} w={720} h={640} color="yellow" opacity={0.26} blur={150} />
      <At x={5 * W + 300} y={400} w={640} rotate={3} z={9}>
        <Phone src={shots.ipadPlay} kind="ipad" width={640} />
      </At>
      <At x={5 * W + 90} y={760} w={280} rotate={-5} z={10}>
        <Phone src={shots.iphonePlay} kind="iphone" width={280} />
      </At>
    </>
  );
}

/** 開いた Duo（横向き）の 6 枚。見出しは左上、端末は右に置く。閉じた形は 2・5・6 枚目に出し、ふつうの iPhone は出さない */
function DuoScene({ shots, bezels }: { shots: Shots; bezels: Bezels }) {
  const W = FRAME.duoInner.w;
  return (
    <>
      <Seams device="duoInner" ys={[700, 300, 720, 320, 700]} size={90} blur={8} />

      {/* 1. PLAY: 開いた形。上に紙吹雪 */}
      <Confetti x={0} y={0} w={1467} h={1032} count={130} unit={1.6} seed={3} avoid={{ x: 70, y: 60, w: 480, h: 200 }} />
      <Glow x={620} y={420} w={720} h={480} color="red" opacity={0.3} blur={140} />
      <At x={460} y={270} w={960} rotate={-3} z={10}>
        <Device src={shots.duoOpenPlay!} kind="duoOpen" width={960} bezel={bezels.open} />
      </At>

      {/* 2. REC: 閉じた形で録る */}
      <Glow x={W + 820} y={360} w={520} h={520} color="yellow" opacity={0.28} blur={140} />
      <At x={W + 870} y={200} w={480} rotate={3} z={10}>
        <Device src={shots.duoClosedRecord!} kind="duoClosed" width={480} bezel={bezels.closed} />
      </At>
      <At x={W + 84} y={560} z={20}>
        <Waveform width={720} height={240} color={PAD_COLORS.yellow} bars={110} />
      </At>

      {/* 3. EDIT */}
      <Glow x={2 * W + 620} y={420} w={720} h={480} color="green" opacity={0.28} blur={140} />
      <At x={2 * W + 460} y={270} w={960} rotate={-3} z={10}>
        <Device src={shots.duoOpenEdit!} kind="duoOpen" width={960} bezel={bezels.open} />
      </At>
      <At x={2 * W + 84} y={720} rotate={3} z={20}>
        <AssignChip size={1.6} />
      </At>

      {/* 4. TAP */}
      <Glow x={3 * W + 200} y={360} w={1000} h={560} color="blue" opacity={0.2} blur={160} />
      {/* 2 つの図は帯の中央に寄せて並べ、傾きを逆にする。図は下端を、説明は上端をそろえる */}
      <At x={3 * W + 220} y={300} rotate={-4} z={10}>
        <Retrigger size={270} />
      </At>
      <At x={3 * W + 220} y={724} z={10}>
        <Caption lines={CAPTIONS.retrigger} size={32} />
      </At>
      <At x={3 * W + W / 2} y={367} rotate={4} z={10}>
        <Layered size={240} />
      </At>
      <At x={3 * W + W / 2} y={724} z={10}>
        <Caption lines={CAPTIONS.layer} size={32} />
      </At>

      {/* 5. LAYOUT: 閉じた形（縦長の並び）と開いた形（横長の並び） */}
      <Glow x={4 * W + 600} y={380} w={760} h={520} color="red" opacity={0.26} blur={140} />
      <At x={4 * W + 520} y={220} w={380} rotate={-3} z={10}>
        <Device src={shots.duoClosedPlay!} kind="duoClosed" width={380} bezel={bezels.closed} />
      </At>
      <At x={4 * W + 760} y={500} w={640} rotate={3} z={11}>
        <Device src={shots.duoOpenPlay!} kind="duoOpen" width={640} bezel={bezels.open} />
      </At>

      {/* 6. iPad と、閉じた Duo。この帯には Duo と iPad だけを出す */}
      <Glow x={5 * W + 600} y={380} w={760} h={560} color="yellow" opacity={0.26} blur={140} />
      <At x={5 * W + 820} y={270} w={520} rotate={3} z={9}>
        <Phone src={shots.ipadPlay} kind="ipad" width={520} />
      </At>
      <At x={5 * W + 560} y={500} w={300} rotate={-5} z={10}>
        <Device src={shots.duoClosedEdit!} kind="duoClosed" width={300} bezel={bezels.closed} />
      </At>
    </>
  );
}

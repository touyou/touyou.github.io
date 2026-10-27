"use client";

import { PAD_COLORS } from "@/components/checkitout/pads";
import { cn } from "@/lib/utils";

import { AndroidPhone, FEATURE } from "../android-phone";
import { At } from "../intento/strip";
import { PadRow } from "./art";
import { BokehPads, Confetti, FONT, GRAIN, Glow, Tag, Waveform } from "./parts";
import { AssignChip, CAPTIONS, Caption, Layered, Retrigger, SLIDES, type Slide } from "./strip";

/**
 * チェケラの Google Play のスクリーンショット（横向き 1920×1080）とフィーチャーグラフィック（1024×500）。
 * Android 版は横向き専用なので、640×360 を 3 倍で撮る 4 枚を横に並べる。見出し・色・図は App Store の帯と同じ。
 * 画面は CheckItOutAndroid の Actions（store-screenshots.yml）がエミュレータで撮ったもの
 */
export const PLAY_FRAME = { w: 640, h: 360, count: 4 } as const;

export type PlayShots = { play: string; edit: string; record: string };

// 録音の画面の波形の枠（03-rec.png の真っ黒な部分）。エミュレータにはマイクの音が無く、波形が出ない
const REC_BOX = { left: "51.3%", top: "41.7%", width: "46.4%", height: "23.9%" };

function Title({ index, slide }: { index: number; slide: Slide }) {
  const { w } = PLAY_FRAME;
  return (
    <div className="absolute z-30 flex flex-col" style={{ left: index * w + 28, top: 28, gap: 10 }}>
      <Tag color={slide.color} label={slide.tag} size={10} />
      <h2 className="font-black leading-[1.18] tracking-[-0.03em] text-white [font-feature-settings:'palt']" style={{ fontSize: 30 }}>
        {slide.lines.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>
    </div>
  );
}

function Frame({ w, h, count, children }: { w: number; h: number; count: number; children: React.ReactNode }) {
  return (
    <div
      data-store-strip={`${w}x${h}x${count}`}
      lang="ja"
      className={cn("relative overflow-hidden text-white antialiased [&_*]:!animate-none [&_*]:!transition-none", FONT)}
      style={{ width: w * count, height: h, backgroundColor: "#0B0B0B", backgroundImage: GRAIN }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0;background:#0B0B0B}"}</style>
      {children}
    </div>
  );
}

function RecPhone({ src, width }: { src: string; width: number }) {
  return (
    <AndroidPhone src={src} width={width} landscape>
      <div className="absolute flex items-center justify-center bg-black" style={REC_BOX}>
        <Waveform width={width * 0.44} height={width * 0.085} color={PAD_COLORS.yellow} bars={70} />
      </div>
    </AndroidPhone>
  );
}

export function CheckitoutPlayStrip({ shots }: { shots: PlayShots }) {
  const { w: W, h, count } = PLAY_FRAME;
  return (
    <Frame w={W} h={h} count={count}>
      {/* 画像の境目のぼけたパッド */}
      {[200, 60, 220].map((y, i) => (
        <At key={i} x={(i + 1) * W - 30} y={y} rotate={i % 2 ? -10 : 10} z={1}>
          <BokehPads colors={[SLIDES[i].color, SLIDES[i + 1].color, SLIDES[i + 1].color, SLIDES[i].color]} size={28} blur={3} />
        </At>
      ))}

      {/* 1. PLAY: 紙吹雪と、パッドの画面 */}
      <Confetti x={0} y={0} w={W} h={h} count={50} unit={0.8} avoid={{ x: 20, y: 20, w: 280, h: 110 }} />
      <Glow x={200} y={150} w={380} h={200} color="red" opacity={0.3} blur={70} />
      <At x={150} y={140} w={470} rotate={-3} z={10}>
        <AndroidPhone src={shots.play} width={470} landscape />
      </At>

      {/* 2. REC: 録音の画面。波形は画面の中に描く */}
      <Glow x={W + 200} y={150} w={380} h={200} color="yellow" opacity={0.28} blur={70} />
      <At x={W + 150} y={146} w={470} rotate={3} z={10}>
        <RecPhone src={shots.record} width={470} />
      </At>

      {/* 3. EDIT: パッドを選んで、一覧から音を割り当てる */}
      <Glow x={2 * W + 200} y={150} w={380} h={200} color="green" opacity={0.28} blur={70} />
      <At x={2 * W + 150} y={140} w={470} rotate={-3} z={10}>
        <AndroidPhone src={shots.edit} width={470} landscape />
      </At>
      <At x={2 * W + 20} y={282} rotate={3} z={20}>
        <AssignChip size={0.62} />
      </At>

      {/* 4. TAP: 端末を置かず、パッドの図を横に 2 つ並べる */}
      <Glow x={3 * W + 60} y={120} w={520} h={220} color="blue" opacity={0.2} blur={80} />
      <At x={3 * W + 40} y={150} rotate={-4} z={10}>
        <Retrigger size={92} />
      </At>
      <At x={3 * W + 40} y={292} z={10}>
        <Caption lines={CAPTIONS.retrigger} size={13} />
      </At>
      <At x={3 * W + 340} y={172} rotate={4} z={10}>
        <Layered size={84} />
      </At>
      <At x={3 * W + 340} y={292} z={10}>
        <Caption lines={CAPTIONS.layer} size={13} />
      </At>

      {SLIDES.slice(0, count).map((slide, i) => (
        <Title key={i} index={i} slide={slide} />
      ))}
    </Frame>
  );
}

/** フィーチャーグラフィック: 左に見出し、右に横向きの端末と 16 のパッド */
export function CheckitoutFeatureGraphic({ shots }: { shots: PlayShots }) {
  const { w, h } = FEATURE;
  return (
    <Frame w={w} h={h} count={1}>
      <Glow x={560} y={160} w={460} h={300} color="red" opacity={0.26} blur={110} />
      <Glow x={-60} y={300} w={360} h={260} color="yellow" opacity={0.18} blur={110} />
      <Confetti x={0} y={0} w={w} h={h} count={70} unit={1} seed={6} avoid={{ x: 50, y: 130, w: 470, h: 240 }} />
      <At x={64} y={150} z={30} className="flex flex-col gap-5">
        <PadRow size={14} />
        <h1 className="font-black leading-[1.14] tracking-[-0.035em] [font-feature-settings:'palt']" style={{ fontSize: 58 }}>
          <span className="block whitespace-nowrap">すべての音が、</span>
          <span className="block whitespace-nowrap">楽器になる。</span>
        </h1>
        <p className="whitespace-nowrap text-[19px] font-bold text-white/65">声や身の回りの音を録って、16 のパッドで鳴らす</p>
      </At>
      <At x={560} y={110} w={520} rotate={5} z={10}>
        <AndroidPhone src={shots.play} width={520} landscape />
      </At>
      <At x={870} y={-40} rotate={-10} z={5}>
        <BokehPads colors={["blue", "green", "green", "blue"]} size={44} blur={5} opacity={0.5} />
      </At>
    </Frame>
  );
}

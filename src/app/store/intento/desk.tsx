"use client";

import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { ShortcutsCount } from "@/components/intento/Surfaces";
import { SiriBubble } from "@/components/intento/VoiceDemo";

import { At, COPY, Device, type Lang, type Shots } from "./strip";

/**
 * Mac と Apple Vision Pro のスクリーンショット 3 枚ずつ。iPhone / iPad の帯（strip.tsx）と同じ部品・同じ文法で、
 * 横長の画像 3 枚を 1 本の帯として描く。Mac は 1 枚 1440×900 を 2 倍で 2880×1800、
 * Vision Pro は 1 枚 1920×1080 を 2 倍で 3840×2160。
 * アプリの画面は実機（Mac のウィンドウ、visionOS シミュレータの部屋ごとのスクショ）だけを使い、ウィンドウの周りを切り抜いて置く。
 * Mac にあって Vision Pro に無いもの（コントロールセンター）は出さない。
 */

export type DeskDevice = "mac" | "vision";
export const DESK_FRAMES = 3;
export const DESK_FRAME = { mac: { w: 1440, h: 900 }, vision: { w: 1920, h: 1080 } } as const;

/** 実機のスクショ。iPhone のスクショ（Vision Pro の 3 枚目で使う）も含む */
export type DeskShots = Shots & { deskList: string; deskDetail: string; deskAdd: string };

/** スクショのうち、使う範囲（画像に対する比）。Mac はウィンドウの外の余白、Vision Pro は部屋の端を落とす */
type Crop = { x: number; y: number; w: number; h: number };
const SOURCE = { mac: { w: 2880, h: 1800 }, vision: { w: 3840, h: 2160 } } as const;
const CROP: Record<DeskDevice, Crop> = {
  mac: { x: 0.0295, y: 0.002, w: 0.943, h: 0.996 },
  vision: { x: 0.18, y: 0.2, w: 0.64, h: 0.66 },
};

const TITLE = { mac: { size: 56, top: 132, inset: 96 }, vision: { size: 64, top: 150, inset: 96 } } as const;

// 部品はどれも同じ長い影で同じ面に浮かせる（art.tsx と同じ）
const FLOAT = "shadow-[0_50px_90px_-30px_rgba(20,20,40,0.35),0_8px_20px_-8px_rgba(20,20,40,0.18)]";

const DESK_COPY: Record<Lang, { visionSame: string[] }> = {
  ja: { visionSame: ["iPhone でも Apple Vision Pro でも、", "同じリストで。"] },
  en: { visionSame: ["iPhone or Apple Vision Pro,", "the same list."] },
};

function titlesFor(device: DeskDevice, lang: Lang) {
  const t = COPY[lang].titles;
  // Mac: 表紙・声・ショートカット。Vision Pro はショートカットの代わりに、iCloud で同じリストが見えることを出す
  return device === "mac" ? [t[0], t[1], t[4]] : [t[0], t[1], DESK_COPY[lang].visionSame];
}

/** スクショの一部を切り抜き、角を丸めて浮かせる */
function Shot({ src, device, width, radius }: { src: string; device: DeskDevice; width: number; radius: number }) {
  const c = CROP[device];
  const s = SOURCE[device];
  return (
    <div
      className={`relative overflow-hidden ring-1 ring-black/10 ${FLOAT}`}
      style={{ width, aspectRatio: `${c.w * s.w} / ${c.h * s.h}`, borderRadius: radius }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="absolute max-w-none"
        style={{ left: `${(-c.x / c.w) * 100}%`, top: `${(-c.y / c.h) * 100}%`, width: `${100 / c.w}%`, height: `${100 / c.h}%` }}
      />
    </div>
  );
}

/** Siri の色をぼかして帯全体に流す（strip.tsx の Aurora を横長の 3 枚に合わせたもの） */
function Aurora({ device }: { device: DeskDevice }) {
  const { w, h } = DESK_FRAME[device];
  const blobs = [
    { x: 0.3, y: 0.72, r: 0.36, c: "#5AC8FA" },
    { x: 0.95, y: 0.6, r: 0.34, c: "#AF52DE" },
    { x: 1.55, y: 0.75, r: 0.36, c: "#FF9500" },
    { x: 2.1, y: 0.62, r: 0.34, c: "#FF2D55" },
    { x: 2.7, y: 0.74, r: 0.36, c: "#5AC8FA" },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b) => (
        <span
          key={b.x}
          className="absolute rounded-full opacity-[0.22] blur-[90px]"
          style={{ left: (b.x - b.r) * w, top: b.y * h - b.r * w * 0.3, width: b.r * 2 * w, height: b.r * w * 0.6, background: b.c }}
        />
      ))}
    </div>
  );
}

function Title({ device, index, lines }: { device: DeskDevice; index: number; lines: string[] }) {
  const { size, top, inset } = TITLE[device];
  const { w } = DESK_FRAME[device];
  return (
    <h2
      className="absolute z-30 font-bold leading-[1.2] tracking-[-0.015em] [font-feature-settings:'palt']"
      style={{ left: index * w + inset, top, width: w - inset * 2, fontSize: size }}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

export function IntentoDeskStrip({ device, lang, shots }: { device: DeskDevice; lang: Lang; shots: DeskShots }) {
  const { w, h } = DESK_FRAME[device];
  return (
    <div
      data-store-strip={`${w}x${h}x${DESK_FRAMES}`}
      lang={lang}
      className="relative overflow-hidden bg-gradient-to-b from-[#FBFBFD] to-[#EDEDF2] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w * DESK_FRAMES, height: h }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      <Aurora device={device} />
      {device === "mac" ? <MacScene lang={lang} shots={shots} /> : <VisionScene lang={lang} shots={shots} />}
      {titlesFor(device, lang).map((lines, i) => (
        <Title key={i} device={device} index={i} lines={lines} />
      ))}
    </div>
  );
}

/** ショートカットのアクション名の列。その画像の中だけに斜めに流す */
function ActionRows({ actions, left, width, height, top, zoom }: { actions: string[]; left: number; width: number; height: number; top: number; zoom: number }) {
  return (
    <div className="absolute overflow-hidden" style={{ left, top: 0, width, height }}>
      <div className="absolute flex flex-col gap-3" style={{ left: -120 / zoom, top: top / zoom, width: (width + 320) / zoom, transform: "rotate(-8deg)", zoom }}>
        {[0, 4, 8, 2].map((offset, row) => (
          <div key={row} className="flex gap-2" style={{ marginLeft: row * -46 }}>
            {[...actions.slice(offset), ...actions.slice(0, offset)].slice(0, 6).map((action) => (
              <span key={action} className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-[14px] font-medium shadow-sm ring-1 ring-black/5">
                {action}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Mac の 3 枚。傾きは左から -・+・- と交互にする */
function MacScene({ lang, shots }: { lang: Lang; shots: DeskShots }) {
  const t = COPY[lang];
  const { w: W, h: H } = DESK_FRAME.mac;
  return (
    <>
      {/* 1. 表紙: アイコンとアプリ名は 1 枚目だけ */}
      <At x={96} y={52} className="flex items-center gap-3">
        <IntentoIcon className="h-12 w-12 shadow-none" />
        <span className="text-[24px] font-semibold text-neutral-500">Intento</span>
      </At>
      <At x={440} y={270} w={860} rotate={-3} z={10}>
        <Shot src={shots.deskList} device="mac" width={860} radius={18} />
      </At>
      <At x={70} y={600} z={20} rotate={4} zoom={1.5}>
        <SiriBubble className={`max-w-[260px] ${FLOAT}`}>{t.quote(t.phrases[0])}</SiriBubble>
      </At>

      {/* 2. 声: 話しかけた言葉と、開いた詳細 */}
      <At x={W + 90} y={340} rotate={-3} z={20} zoom={1.5}>
        <SiriBubble className={`max-w-[330px] ${FLOAT}`}>{t.quote(t.phrases[1])}</SiriBubble>
      </At>
      <At x={W + 110} y={600} rotate={2} z={20} zoom={1.5}>
        <SiriBubble className={`max-w-[300px] ${FLOAT}`}>{t.quote(t.phrases[2])}</SiriBubble>
      </At>
      <At x={W + 640} y={320} w={720} rotate={3} z={10}>
        <Shot src={shots.deskDetail} device="mac" width={720} radius={16} />
      </At>

      {/* 3. 25 のアクション */}
      <At x={2 * W + 90} y={270} z={10}>
        <ShortcutsCount className="text-[230px]" />
      </At>
      <At x={2 * W + 100} y={570} z={10} className="text-[24px] text-neutral-500">
        {t.actionsNote}
      </At>
      <ActionRows actions={t.actions} left={2 * W} width={W} height={H} top={640} zoom={1.4} />
      <At x={2 * W + 760} y={260} w={600} rotate={-3} z={20}>
        <Shot src={shots.deskAdd} device="mac" width={600} radius={14} />
      </At>
    </>
  );
}

/** Apple Vision Pro の 3 枚。部屋ごとのスクショからウィンドウの周りを切り抜く。傾きは -・+・- */
function VisionScene({ lang, shots }: { lang: Lang; shots: DeskShots }) {
  const t = COPY[lang];
  const W = DESK_FRAME.vision.w;
  return (
    <>
      {/* 1. 表紙 */}
      <At x={96} y={64} className="flex items-center gap-4">
        <IntentoIcon className="h-14 w-14 shadow-none" />
        <span className="text-[28px] font-semibold text-neutral-500">Intento</span>
      </At>
      <At x={700} y={330} w={1100} rotate={-3} z={10}>
        <Shot src={shots.deskList} device="vision" width={1100} radius={36} />
      </At>
      <At x={90} y={660} z={20} rotate={4} zoom={1.8}>
        <SiriBubble className={`max-w-[260px] ${FLOAT}`}>{t.quote(t.phrases[0])}</SiriBubble>
      </At>

      {/* 2. 声 */}
      <At x={W + 96} y={400} rotate={-3} z={20} zoom={1.8}>
        <SiriBubble className={`max-w-[330px] ${FLOAT}`}>{t.quote(t.phrases[1])}</SiriBubble>
      </At>
      <At x={W + 120} y={690} rotate={2} z={20} zoom={1.8}>
        <SiriBubble className={`max-w-[300px] ${FLOAT}`}>{t.quote(t.phrases[2])}</SiriBubble>
      </At>
      <At x={W + 900} y={340} w={920} rotate={3} z={10}>
        <Shot src={shots.deskDetail} device="vision" width={920} radius={32} />
      </At>

      {/* 3. iPhone と Apple Vision Pro で同じリスト */}
      <At x={2 * W + 700} y={340} w={1100} rotate={-3} z={10}>
        <Shot src={shots.deskAdd} device="vision" width={1100} radius={36} />
      </At>
      <At x={2 * W + 240} y={370} w={300} rotate={5} z={20}>
        <Device src={shots.iphoneList} kind="iphone" width={300} />
      </At>
    </>
  );
}

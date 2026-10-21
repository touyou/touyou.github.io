"use client";

import { PAD_COLORS, type PadColor } from "@/components/checkitout/pads";
import { cn } from "@/lib/utils";

import { At } from "../intento/strip";
import { BokehPads, FONT, GRAIN, Glow, PadGrid, Phone, Waveform } from "./parts";
import type { Shots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残るので、見出しは Apple のテンプレートの安全領域（3840×1646 で中央の 1646×661）に収め、
 * 左右は iPad や Mac で見える絵にする（intento/art.tsx と同じ考え方）。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824, h: 331 };

const COPY = {
  header: "すべての音が、楽器になる。",
  headerSub: "声や身の回りの音を録って、16 のパッドで鳴らす",
  search: ["録って、", "割り当てて、", "叩く。"],
  searchSub: "声も物音も、16 のパッドで鳴らせる。",
};

const ORDER: PadColor[] = ["red", "yellow", "green", "blue"];

/** 赤・黄・緑・青の小さなパッド。見出しの札として 4 色をそろえて見せる */
function PadRow({ size }: { size: number }) {
  return (
    <span className="flex" style={{ gap: size * 0.45 }} aria-hidden>
      {ORDER.map((c) => (
        <span
          key={c}
          style={{ width: size, height: size, borderRadius: size * 0.22, border: `${Math.max(2, size * 0.14)}px solid ${PAD_COLORS[c]}`, boxShadow: `0 0 ${size * 0.6}px ${PAD_COLORS[c]}` }}
        />
      ))}
    </span>
  );
}

export function CheckitoutStoreArt({ kind, shots }: { kind: ArtKind; shots: Shots }) {
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang="ja"
      className={cn("relative overflow-hidden text-white antialiased [&_*]:!animate-none [&_*]:!transition-none", FONT)}
      style={{ width: w, height: h, backgroundColor: "#0B0B0B", backgroundImage: GRAIN }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0;background:#0B0B0B}"}</style>
      {kind === "header" ? <HeaderScene shots={shots} /> : <SearchScene shots={shots} />}
    </div>
  );
}

/** ヘッダー: 見出しは中央に中央揃え。左に録音中の iPhone と波形、右に 16 のパッドを傾けて置く */
function HeaderScene({ shots }: { shots: Shots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <Glow x={60} y={300} w={460} h={520} color="yellow" opacity={0.22} blur={150} />
      <Glow x={1420} y={120} w={460} h={560} color="blue" opacity={0.2} blur={150} />
      <At x={s.x} y={s.y} w={s.w} z={30} className="flex flex-col items-center justify-center gap-7 text-center" >
        <div className="flex flex-col items-center gap-7" style={{ height: s.h, justifyContent: "center" }}>
          <PadRow size={20} />
          <h1 className="whitespace-nowrap font-black leading-none tracking-[-0.03em] [font-feature-settings:'palt']" style={{ fontSize: 64 }}>
            {COPY.header}
          </h1>
          <p className="whitespace-nowrap text-[25px] font-bold text-white/65">{COPY.headerSub}</p>
        </div>
      </At>

      {/* 左: 録音の画面と、その声の波形 */}
      <At x={150} y={110} w={290} rotate={-6} z={10}>
        <Phone src={shots.iphoneRecord} kind="iphone" width={290} />
      </At>
      <At x={-40} y={560} z={20}>
        <Waveform width={560} height={170} color={PAD_COLORS.yellow} bars={80} />
      </At>

      {/* 右: 16 のパッド。いくつかを押した光にする */}
      <At x={1450} y={90} rotate={7} z={10}>
        <PadGrid size={104} pressed={[1, 6, 11, 12]} />
      </At>
      <At x={1340} y={-60} rotate={-10} z={5}>
        <BokehPads colors={["blue", "green", "green", "blue"]} size={70} blur={7} opacity={0.5} />
      </At>
    </>
  );
}

/** 検索結果: 左に見出し（左端をそろえる）、右に端末を 1 台 */
function SearchScene({ shots }: { shots: Shots }) {
  return (
    <>
      <Glow x={1100} y={300} w={700} h={800} color="red" opacity={0.26} blur={170} />
      <Glow x={1500} y={-80} w={420} h={420} color="blue" opacity={0.18} blur={150} />
      <At x={150} y={300} w={980} z={30} className="flex flex-col gap-10">
        <PadRow size={30} />
        <h1 className="text-[124px] font-black leading-[1.12] tracking-[-0.035em] [font-feature-settings:'palt']">
          {COPY.search.map((line) => (
            <span key={line} className="block whitespace-nowrap">
              {line}
            </span>
          ))}
        </h1>
        <p className="whitespace-nowrap text-[40px] font-bold text-white/65">{COPY.searchSub}</p>
      </At>
      <At x={1240} y={150} w={480} rotate={5} z={10}>
        <Phone src={shots.iphonePlay} kind="iphone" width={480} />
      </At>
      <At x={1080} y={1010} rotate={-8} z={5}>
        <BokehPads colors={["yellow", "red", "red", "yellow"]} size={90} blur={8} opacity={0.5} />
      </At>
    </>
  );
}

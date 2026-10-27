"use client";

import { type Bezel, type Bezels, Device } from "../intento/strip";
import {
  BestChip,
  Circuit,
  FF,
  Glow,
  Keypad,
  LcdChip,
  Phone,
  Place,
  Seg,
  StoreStyle,
  StreakStairs,
  TITLE_FONT,
  type Gate,
  type Trace,
} from "./parts";

/**
 * FFMultiply の App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 作りは Intento と同じで、iPhone は 440×956 を 3 倍、Duo は開いた横向き 1467×1032 を 1.94477 倍で撮る。
 * iPhone 専用のアプリなので iPad は作らない。アプリの画面は実機のスクショだけを使い、
 * 手で描くのは 7 セグの数字・キーパッド・回路の線などの意匠に限る。
 * 傾きは左から順に左右を交互にする（同じ向きが続かないように）。
 */

const FRAMES = 6;
const FRAME = {
  iphone: { w: 440, h: 956 },
  duoInner: { w: 1467, h: 1032 },
} as const;
export type FFDevice = keyof typeof FRAME;
export type Lang = "ja" | "en";

export type FFShots = {
  home: string;
  game: string;
  result: string;
  ranking: string;
  local: string;
  icon: string;
  duoOpenHome?: string;
  duoOpenGame?: string;
  duoOpenResult?: string;
  duoOpenRanking?: string;
  duoClosedHome?: string;
  duoClosedGame?: string;
  duoClosedLocal?: string;
};

const COPY: Record<
  Lang,
  {
    titles: string[][];
    sec: string;
    streak: string;
    best: string;
    rank: string;
  }
> = {
  ja: {
    titles: [
      ["九九じゃなくて、", "FF を覚えよう。"],
      ["制限時間は 60 秒。", "何問解ける？"],
      ["0 から F まで、", "16 のキーで答える。"],
      ["連続で正解すると、", "1 問の点が伸びる。"],
      ["オンラインの", "ランキングで腕比べ。"],
      ["自分の記録を、", "塗り替えよう。"],
    ],
    sec: "秒",
    streak: "連続正解数と、1 問の点",
    best: "自己ベスト",
    rank: "あなたの順位",
  },
  en: {
    titles: [
      ["Forget 9×9.", "Learn F×F."],
      ["60 seconds.", "How many?"],
      ["Sixteen keys,", "0 through F."],
      ["Keep the streak,", "earn more points."],
      ["Take on the", "online ranking."],
      ["Beat your", "own best."],
    ],
    sec: "SEC",
    streak: "Streak and points per answer",
    best: "BEST",
    rank: "YOUR RANK",
  },
};

const TITLE = {
  iphone: { size: 34, top: 92, inset: 28 },
  duoInner: { size: 56, top: 92, inset: 84 },
} as const;

function Title({
  device,
  index,
  lines,
}: {
  device: FFDevice;
  index: number;
  lines: string[];
}) {
  const { size, top, inset } = TITLE[device];
  const { w } = FRAME[device];
  return (
    <h2
      className={`absolute z-30 font-bold leading-[1.22] tracking-[-0.01em] text-white [font-feature-settings:'palt'] ${TITLE_FONT}`}
      style={{
        left: index * w + inset,
        top,
        width: w - inset * 2,
        fontSize: size,
      }}
    >
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </h2>
  );
}

/**
 * 見出しの下を通る 2 本の配線。どの画像でも同じ高さを通るので、6 枚が 1 枚の基板に見える。
 * 下の 1 本は緑に光らせ、信号が左から右へ流れていくように見せる
 */
function busCircuit(device: FFDevice): { traces: Trace[]; gates: Gate[] } {
  const { w, h } = FRAME[device];
  const k = w / FRAME.iphone.w;
  const s = device === "iphone" ? 1 : 1.6;
  const y = device === "iphone" ? 214 : 268;
  const d = 22 * s;
  const gap = 16 * s;
  const line = (y0: number): [number, number][] => {
    const pts: [number, number][] = [[-10, y0]];
    for (let i = 0; i < FRAMES; i++) {
      const a = i * w + w * 0.62;
      const b = i * w + w * 0.9;
      pts.push([a, y0], [a + d, y0 + d], [b, y0 + d], [b + d, y0]);
    }
    pts.push([w * FRAMES + 10, y0]);
    return pts;
  };
  const types: Gate["type"][] = ["not", "and", "or", "not", "and", "or"];
  const gates: Gate[] = types.map((type, i) => ({
    x: i * w + w * 0.47,
    y,
    type,
    size: 34 * s,
    lit: false,
  }));
  // 光っている線の上にもゲートを 1 つずつ置き、画像の右寄りで向きをそろえる
  const litGates: Gate[] = types.map((_, i) => ({
    x: i * w + w * 0.76,
    y: y + gap + d,
    type: i % 2 ? "and" : "not",
    size: 26 * s,
    lit: true,
  }));
  // 下の端にも細い配線を 1 本。端末の下から覗く
  const bottom: [number, number][] = [[-10, h - 36 * k]];
  for (let i = 0; i < FRAMES; i++)
    bottom.push(
      [i * w + w * 0.2, h - 36 * k],
      [i * w + w * 0.2 + d, h - 36 * k - d],
      [i * w + w * 0.5, h - 36 * k - d],
      [i * w + w * 0.5 + d, h - 36 * k],
    );
  bottom.push([w * FRAMES + 10, h - 36 * k]);
  return {
    traces: [
      { pts: line(y) },
      { pts: line(y + gap), lit: true },
      { pts: bottom },
    ],
    gates: [...gates, ...litGates],
  };
}

export function FFStoreStrip({
  device,
  lang,
  shots,
  bezels = {},
}: {
  device: FFDevice;
  lang: Lang;
  shots: FFShots;
  bezels?: Bezels;
}) {
  const t = COPY[lang];
  const { w, h } = FRAME[device];
  const circuit = busCircuit(device);
  return (
    <div
      data-store-strip={`${w}x${h}x${FRAMES}`}
      lang={lang}
      className="relative overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans',sans-serif] text-white antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{
        width: w * FRAMES,
        height: h,
        background: `radial-gradient(120% 80% at 50% 0%, #151815 0%, ${FF.black} 60%)`,
      }}
    >
      <StoreStyle />
      <Circuit
        width={w * FRAMES}
        height={h}
        stroke={device === "iphone" ? 2.5 : 4}
        {...circuit}
      />
      {device === "iphone" ? (
        <IphoneScene lang={lang} shots={shots} />
      ) : (
        <DuoScene lang={lang} shots={shots} bezels={bezels} />
      )}
      {t.titles.map((lines, i) => (
        <Title key={i} device={device} index={i} lines={lines} />
      ))}
    </div>
  );
}

function AppMark({
  x,
  y,
  size,
  icon,
}: {
  x: number;
  y: number;
  size: number;
  icon: string;
}) {
  return (
    <Place
      x={x}
      y={y}
      z={30}
      className="flex items-center"
      style={{ gap: size * 0.3 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={icon}
        alt=""
        className="rounded-[22%]"
        style={{ width: size, height: size }}
      />
      <span
        className="font-[Futura,sans-serif] font-medium text-white/60"
        style={{ fontSize: size * 0.48 }}
      >
        FFMultiplier
      </span>
    </Place>
  );
}

function IphoneScene({ lang, shots }: { lang: Lang; shots: FFShots }) {
  const t = COPY[lang];
  return (
    <>
      {/* 1. 表紙: ゲーム画面と「F × F = E1」。傾きは左の液晶が右、端末が左 */}
      <AppMark x={28} y={40} size={34} icon={shots.icon} />
      <Glow x={60} y={360} w={360} h={520} />
      <Place x={112} y={290} rotate={-3} z={10}>
        <Phone src={shots.game} width={300} />
      </Place>
      <Place x={20} y={700} rotate={4} z={20}>
        <LcdChip a="F" b="F" ans="E1" size={40} />
      </Place>

      {/* 2. 60 秒: 大きな 7 セグの残り時間と、ホーム画面 */}
      <Place x={440 + 28} y={262} z={10} className="flex items-end gap-3">
        <Seg text="60" size={150} />
        <span className="pb-2 text-[22px] font-bold text-white/50">
          {t.sec}
        </span>
      </Place>
      <Glow x={440 + 120} y={560} w={300} h={420} opacity={0.22} />
      <Place x={440 + 120} y={520} rotate={4} z={10}>
        <Phone src={shots.home} width={280} />
      </Place>

      {/* 3. 16 のキー: 「b × 7」の答え 4d を打っているところ */}
      <Glow x={880 + 30} y={360} w={380} h={380} opacity={0.2} />
      <Place x={880 + 40} y={300} rotate={-4} z={10}>
        <Keypad width={360} lit={["4", "d"]} />
      </Place>
      <Place x={880 + 90} y={720} rotate={3} z={20}>
        <LcdChip a="b" b="7" ans="4d" size={40} />
      </Place>

      {/* 4. 連続正解のボーナス: 平らな階段グラフと結果画面 */}
      <Place x={1320 + 28} y={262} z={10}>
        <StreakStairs width={290} streakLabel={t.streak} />
      </Place>
      <Glow x={1320 + 150} y={560} w={280} h={400} opacity={0.22} />
      <Place x={1320 + 170} y={540} rotate={-3} z={10}>
        <Phone src={shots.result} width={250} />
      </Place>

      {/* 5. オンラインランキング */}
      <Glow x={1760 + 60} y={360} w={340} h={520} opacity={0.24} />
      <Place x={1760 + 70} y={290} rotate={3} z={10}>
        <Phone src={shots.ranking} width={300} />
      </Place>

      {/* 6. ローカルスコアと自己ベスト。左の液晶が左、端末が右に傾く */}
      <Glow x={2200 + 120} y={360} w={300} h={500} opacity={0.22} />
      <Place x={2200 + 130} y={300} rotate={3} z={9}>
        <Phone src={shots.local} width={280} />
      </Place>
      <Place x={2200 + 24} y={680} rotate={-4} z={10}>
        <BestChip label={t.best} score="230" size={64} />
      </Place>
    </>
  );
}

/** 開いた Duo（横向き）の 6 枚。見出しは左上、端末は右か下。閉じた形は 2・3・6 枚目に出す */
function DuoScene({
  lang,
  shots,
  bezels,
}: {
  lang: Lang;
  shots: FFShots;
  bezels: Bezels;
}) {
  const t = COPY[lang];
  const W = FRAME.duoInner.w;
  const open = (src: string, width: number) => (
    <Device
      src={src}
      kind="duoOpen"
      width={width}
      bezel={bezels.open as Bezel | undefined}
    />
  );
  const closed = (src: string, width: number) => (
    <Device
      src={src}
      kind="duoClosed"
      width={width}
      bezel={bezels.closed as Bezel | undefined}
    />
  );
  return (
    <>
      {/* 1. 表紙: 開いた形のゲーム画面 */}
      <AppMark x={84} y={36} size={44} icon={shots.icon} />
      <Glow x={520} y={420} w={860} h={520} opacity={0.22} blur={120} />
      <Place x={470} y={330} rotate={-3} z={10}>
        {open(shots.duoOpenGame!, 900)}
      </Place>
      <Place x={84} y={660} rotate={4} z={20}>
        <LcdChip a="F" b="F" ans="E1" size={64} />
      </Place>

      {/* 2. 60 秒: 閉じた形のホーム画面 */}
      <Place x={W + 84} y={380} z={10} className="flex items-end gap-5">
        <Seg text="60" size={300} />
        <span className="pb-4 text-[40px] font-bold text-white/50">
          {t.sec}
        </span>
      </Place>
      <Glow x={W + 900} y={300} w={460} h={640} opacity={0.2} blur={120} />
      <Place x={W + 900} y={190} rotate={4} z={10}>
        {closed(shots.duoClosedHome!, 430)}
      </Place>

      {/* 3. 16 のキーと、閉じた形のゲーム画面 */}
      <Glow x={2 * W + 100} y={380} w={560} h={560} opacity={0.18} blur={120} />
      <Place x={2 * W + 110} y={330} rotate={-4} z={10}>
        <Keypad width={520} lit={["4", "d"]} />
      </Place>
      <Place x={2 * W + 830} y={200} rotate={3} z={10}>
        {closed(shots.duoClosedGame!, 420)}
      </Place>

      {/* 4. 連続正解のボーナスと、開いた形の結果画面 */}
      <Place x={3 * W + 84} y={340} z={10}>
        <StreakStairs width={460} streakLabel={t.streak} />
      </Place>
      <Glow x={3 * W + 640} y={420} w={760} h={520} opacity={0.2} blur={120} />
      <Place x={3 * W + 620} y={360} rotate={-3} z={10}>
        {open(shots.duoOpenResult!, 780)}
      </Place>

      {/* 5. オンラインランキングと自分の順位（スクショの Your Rank: 4）。液晶が右、端末が左に傾く */}
      <Glow x={4 * W + 520} y={360} w={860} h={560} opacity={0.22} blur={120} />
      <Place x={4 * W + 84} y={600} rotate={4} z={20}>
        <BestChip label={t.rank} score="4" size={120} />
      </Place>
      <Place x={4 * W + 500} y={300} rotate={-3} z={10}>
        {open(shots.duoOpenRanking!, 880)}
      </Place>

      {/* 6. 閉じた形のローカルスコア（右に傾く）と、開いた形のホーム画面（左に傾く） */}
      <Glow x={5 * W + 260} y={340} w={1000} h={600} opacity={0.2} blur={120} />
      <Place x={5 * W + 250} y={300} rotate={3} z={10}>
        {closed(shots.duoClosedLocal!, 380)}
      </Place>
      <Place x={5 * W + 700} y={430} rotate={-4} z={9}>
        {open(shots.duoOpenHome!, 680)}
      </Place>
    </>
  );
}

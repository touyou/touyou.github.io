"use client";

import { type Bezel, type Bezels, Device } from "../intento/strip";
import { BODY, Bokeh, G, Kicker, type Palette, Phone, Place, Spark, StoreStyle, Tablet } from "../graphica/parts";
import { Chips, CodeCard, Lead, lightsFor, SceneTitle } from "../graphica/strip";

/**
 * Graphica Playground の App Store のスクリーンショット 6 枚を、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 姉妹アプリの GRAPHICA のいまのストア画像と同じ文法（暗い地にぼけた光・Syne のワードマーク・Plex Mono の一言・
 * 1・2 枚目にまたがるワードマークと説明文・チタンの iPhone）で組み、光の色だけをアプリのアクセント（mint）と
 * アイコンの青に変えて、別のアプリだと分かるようにする。
 * iPhone は 440×956 を 3 倍、iPad は 1032×1376 を 2 倍（縦）、Duo は開いた横向き 1467×1032 を 1.94477 倍。
 * 傾きは左から順に左右を交互にする。
 */

const FRAME = {
  iphone: { w: 440, h: 956 },
  ipad: { w: 1032, h: 1376 },
  duoInner: { w: 1467, h: 1032 },
} as const;
export type PDevice = keyof typeof FRAME;
export type Lang = "ja" | "en";

/** アプリの AccentColor（#67DABD）とアイコンの青 */
export const MINT = G.mint;
export const POOL: Palette = {
  base: "radial-gradient(140% 90% at 70% 0%, #0f2a2c 0%, #0b1418 45%, #07090d 100%)",
  glow: "rgba(120,230,215,0.5)",
  dot: "150,235,215",
  dot2: "120,180,255",
};

type ShotKey = "editor" | "lesson" | "parameters" | "export" | "learn" | "home" | "library";
export type PShots = Record<`iphone${Capitalize<ShotKey>}` | `ipad${Capitalize<ShotKey>}`, string> &
  Partial<Record<`duoOpen${Capitalize<ShotKey>}` | `duoClosed${Capitalize<ShotKey>}`, string>> & { icon: string };

type Copy = {
  lead: string[];
  kicker: string;
  scenes: { eyebrow: string; title: string[] }[];
  sliders: string[];
  steps: string[];
  privacy: string[];
};

// 見出しは graphica の Web 版の紹介ページ（components/landing/PlaygroundLanding.tsx）とアプリの文言から取る
const COPY: Record<Lang, Copy> = {
  ja: {
    lead: ["言葉で描いて、学んで、使う。", "一文から Metal シェーダーを作り、指で調整して、", "SwiftUI のコードとして書き出せる。"],
    kicker: "Metal shaders, from words",
    scenes: [
      { eyebrow: "Tune", title: ["色も速さも、", "その場で調整。"] },
      { eyebrow: "Ship", title: ["見た絵が、そのまま", "あなたのアプリに。"] },
      { eyebrow: "Learn", title: ["生成されたコードを、", "読めるようになる。"] },
      { eyebrow: "No sign-up", title: ["登録なしで、", "すぐ始められる。"] },
    ],
    sliders: ["速度", "強さ", "スケール", "3 色のパレット"],
    steps: ["式を書く", "数を合わせる", "選ぶ", "部品を並べる"],
    privacy: ["オンデバイス AI", "保存は端末の中", "AI が無くても 1 枚"],
  },
  en: {
    lead: ["Describe it. Learn it. Ship it.", "Turn one sentence into a Metal shader, tune it by hand,", "and export it as SwiftUI code."],
    kicker: "Metal shaders, from words",
    scenes: [
      { eyebrow: "Tune", title: ["It changes the moment", "you move it."] },
      { eyebrow: "Ship", title: ["What you see is", "what ships in your app."] },
      { eyebrow: "Learn", title: ["Learn to read the", "code it writes."] },
      { eyebrow: "No sign-up", title: ["No sign-up.", "Start right away."] },
    ],
    sliders: ["Speed", "Intensity", "Scale", "Three-color palette"],
    steps: ["Write", "Dial in", "Choose", "Arrange"],
    privacy: ["On-device AI", "Saved on your device", "A picture, even without AI"],
  },
};

/** 書き出される DeepOceanCaustics.swift の body の抜粋（PlaygroundKit の ShaderCodeExporter の出力。経過時間の式だけ elapsed に縮めた） */
const SWIFTUI_CODE = [
  "TimelineView(.animation) { timeline in",
  "    Rectangle()",
  "        .colorEffect(",
  "            ShaderLibrary.deepOceanCaustics(",
  "                .float2(size),",
  "                .float(elapsed),",
  "                .float(speed),",
  "                .float(intensity),",
  "                .float(scale),",
  "                ...",
  "            )",
  "        )",
  "}",
];

/** アプリの ProBadge と同じ形（「PRO」、太字・字間、mint の 22% の地に mint の文字） */
export function ProBadge({ size }: { size: number }) {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full font-bold leading-none font-['IBM_Plex_Mono',ui-monospace,monospace]" style={{ fontSize: size, letterSpacing: "0.08em", padding: `${size * 0.35}px ${size * 0.6}px`, color: MINT, background: "rgba(103,218,189,0.22)" }}>
      PRO
    </span>
  );
}

/** 「GRAPHICA」を小さく添えた PLAYGROUND のワードマーク。✦ は mint */
export function PlaygroundMark({ size }: { size: number }) {
  return (
    <span className="inline-flex flex-col" style={{ gap: size * 0.18 }}>
      <Kicker size={size * 0.3} style={{ letterSpacing: "0.5em", color: "rgba(236,233,226,0.7)" }}>
        Graphica
      </Kicker>
      <span className="inline-flex items-center whitespace-nowrap font-bold leading-none font-['Syne',sans-serif]" style={{ fontSize: size, letterSpacing: "0.12em", color: G.paper }}>
        PLAYGROUND
        <Spark size={size * 0.9} color={MINT} />
      </span>
    </span>
  );
}

/** 端末の後ろに敷く、シェーダーの色のぼかし */
function Glow({ x, y, w, h, color, opacity = 0.35 }: { x: number; y: number; w: number; h: number; color: string; opacity?: number }) {
  return <span aria-hidden className="absolute rounded-full" style={{ left: x, top: y, width: w, height: h, background: color, opacity, filter: `blur(${Math.max(w, h) * 0.18}px)` }} />;
}

export function PlaygroundStoreStrip({ device, lang, shots, bezels = {} }: { device: PDevice; lang: Lang; shots: PShots; bezels?: Bezels }) {
  const { w, h } = FRAME[device];
  const t = COPY[lang];
  return (
    <div data-store-strip={`${w}x${h}x6`} lang={lang} className="relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none" style={{ width: w * 6, height: h, background: G.void }}>
      <StoreStyle />
      {device === "iphone" && <IphoneScene t={t} shots={shots} />}
      {device === "ipad" && <IpadScene t={t} shots={shots} />}
      {device === "duoInner" && <DuoScene t={t} shots={shots} bezels={bezels} />}
    </div>
  );
}

function IphoneScene({ t, shots }: { t: Copy; shots: PShots }) {
  const W = FRAME.iphone.w;
  const s = t.scenes;
  return (
    <>
      <Bokeh width={W * 6} height={956} lights={lightsFor(W, 6, 1)} palette={POOL} seed={21} />

      {/* 1・2. GRAPHICA と同じ組み方: ワードマークと説明文が 2 枚にまたがり、iPhone が 1 台ずつ */}
      <Place x={45} y={30} z={30}>
        <PlaygroundMark size={50} />
      </Place>
      <Lead x={45} y={122} size={15.5} lines={t.lead} trailing={<ProBadge size={9} />} />
      <Glow x={80} y={330} w={320} h={520} color="#3aa7d8" />
      <Place x={56} y={230} rotate={-4} z={10}>
        <Phone src={shots.iphoneEditor} width={340} />
      </Place>
      <Place x={W} y={150} w={W} z={30} className="flex justify-center">
        <Kicker size={15}>{t.kicker}</Kicker>
      </Place>
      <Glow x={W + 90} y={300} w={300} h={400} color="#f4b860" opacity={0.22} />
      <Place x={W + 50} y={200} rotate={3} z={10}>
        <Phone src={shots.iphoneLesson} width={340} />
      </Place>

      {/* 3. 調整 */}
      <SceneTitle x={2 * W + 30} y={70} w={W - 60} eyebrow={s[0].eyebrow} title={s[0].title} size={32} accent={MINT} />
      <Place x={2 * W + 30} y={232} w={W - 60} z={30}>
        <Chips items={t.sliders} size={13} accent={0} color={MINT} />
      </Place>
      <Place x={2 * W + 70} y={340} rotate={-3} z={10}>
        <Phone src={shots.iphoneParameters} width={310} />
      </Place>

      {/* 4. 書き出し */}
      <SceneTitle x={3 * W + 30} y={70} w={W - 60} eyebrow={s[1].eyebrow} title={s[1].title} size={32} accent={MINT} badge={<ProBadge size={10} />} />
      <Place x={3 * W + 100} y={250} rotate={3} z={10}>
        <Phone src={shots.iphoneExport} width={300} />
      </Place>
      <Place x={3 * W + 14} y={650} rotate={-2} z={20}>
        <CodeCard width={360} size={11} lines={SWIFTUI_CODE} title="DeepOceanCaustics.swift" accent={MINT} keywords={["colorEffect", "ShaderLibrary", "Rectangle", "TimelineView"]} />
      </Place>

      {/* 5. 学ぶ */}
      <SceneTitle x={4 * W + 30} y={70} w={W - 60} eyebrow={s[2].eyebrow} title={s[2].title} size={32} accent={MINT} />
      <Place x={4 * W + 30} y={232} w={W - 60} z={30}>
        <Chips items={t.steps} size={13} accent={0} color={MINT} />
      </Place>
      <Glow x={4 * W + 90} y={420} w={300} h={420} color="#f4b860" opacity={0.18} />
      <Place x={4 * W + 70} y={330} rotate={-3} z={10}>
        <Phone src={shots.iphoneLearn} width={310} />
      </Place>

      {/* 6. 登録なしで */}
      <SceneTitle x={5 * W + 30} y={70} w={W - 60} eyebrow={s[3].eyebrow} title={s[3].title} size={32} accent={MINT} />
      <Place x={5 * W + 30} y={232} w={W - 60} z={30}>
        <Chips items={t.privacy} size={13} accent={0} color={MINT} />
      </Place>
      <Place x={5 * W + 76} y={330} rotate={3} z={10}>
        <Phone src={shots.iphoneLibrary} width={310} />
      </Place>
    </>
  );
}

/** iPad（縦）の 6 枚。iPhone と同じ流れで、端末を大きくする */
function IpadScene({ t, shots }: { t: Copy; shots: PShots }) {
  const W = FRAME.ipad.w;
  const s = t.scenes;
  const title = { y: 120, size: 64 };
  return (
    <>
      <Bokeh width={W * 6} height={1376} lights={lightsFor(W, 6, 2)} palette={POOL} scale={1.6} density={0.55} seed={23} />

      <Place x={84} y={64} z={30}>
        <PlaygroundMark size={92} />
      </Place>
      <Lead x={84} y={240} size={30} lines={t.lead} trailing={<ProBadge size={17} />} />
      <Glow x={160} y={560} w={760} h={720} color="#3aa7d8" />
      <Place x={150} y={470} rotate={-3} z={10}>
        <Tablet src={shots.ipadEditor} width={760} />
      </Place>
      <Place x={W} y={150} w={W} z={30} className="flex justify-center">
        <Kicker size={32}>{t.kicker}</Kicker>
      </Place>
      <Glow x={W + 200} y={500} w={640} h={640} color="#f4b860" opacity={0.2} />
      <Place x={W + 140} y={300} rotate={3} z={10}>
        <Tablet src={shots.ipadLesson} width={760} />
      </Place>

      {[shots.ipadParameters, shots.ipadExport, shots.ipadLearn, shots.ipadLibrary].map((src, i) => {
        const x = (i + 2) * W;
        const chips = [t.sliders, null, t.steps, t.privacy][i];
        return (
          <div key={src}>
            <SceneTitle x={x + 84} y={title.y} w={W - 168} eyebrow={s[i].eyebrow} title={s[i].title} size={title.size} accent={MINT} badge={i === 1 ? <ProBadge size={20} /> : undefined} />
            {chips && (
              <Place x={x + 84} y={430} w={W - 168} z={30}>
                <Chips items={chips} size={24} accent={0} color={MINT} />
              </Place>
            )}
            <Place x={x + 150} y={560} rotate={i % 2 ? 3 : -3} z={10}>
              <Tablet src={src} width={740} />
            </Place>
            {i === 1 && (
              <Place x={x + 50} y={1000} rotate={-2} z={20}>
                <CodeCard width={600} size={18} lines={SWIFTUI_CODE} title="DeepOceanCaustics.swift" accent={MINT} keywords={["colorEffect", "ShaderLibrary", "Rectangle", "TimelineView"]} />
              </Place>
            )}
          </div>
        );
      })}
    </>
  );
}

/**
 * 開いた Duo（横向き）の 6 枚。GRAPHICA の Duo と同じ組み方（1: 端末が右上・ワードマークが左下、2: 一言が上の中央）。
 * レッスンは開くと絵とコードが左右に分かれるので、Duo では開いた形で見せる。閉じた形と iPad も交ぜる
 */
function DuoScene({ t, shots, bezels }: { t: Copy; shots: PShots; bezels: Bezels }) {
  const W = FRAME.duoInner.w;
  const H = FRAME.duoInner.h;
  const s = t.scenes;
  const open = (src: string | undefined, width: number) => <Device src={src!} kind="duoOpen" width={width} bezel={bezels.open as Bezel | undefined} />;
  const closed = (src: string | undefined, width: number) => <Device src={src!} kind="duoClosed" width={width} bezel={bezels.closed as Bezel | undefined} />;
  return (
    <>
      <Bokeh width={W * 6} height={H} lights={lightsFor(W, 6, 2)} palette={POOL} scale={1.6} density={0.55} seed={25} />

      {/* 1. 開いた形のエディタ。ワードマークと説明文は左下 */}
      <Glow x={W - 900} y={120} w={820} h={560} color="#3aa7d8" opacity={0.3} />
      <Place x={W - 950} y={70} rotate={3} z={10}>
        {open(shots.duoOpenEditor, 900)}
      </Place>
      <Place x={78} y={H - 330} z={30}>
        <PlaygroundMark size={64} />
      </Place>
      <Lead x={78} y={H - 182} size={24} lines={t.lead} trailing={<ProBadge size={14} />} />

      {/* 2. 一言が上の中央、開いた形のレッスン（絵とコードが左右に分かれる）がまっすぐ中央 */}
      <Place x={W} y={104} w={W} z={30} className="flex justify-center">
        <Kicker size={36}>{t.kicker}</Kicker>
      </Place>
      <Place x={W + (W - 940) / 2} y={200} z={10}>
        {open(shots.duoOpenLesson, 940)}
      </Place>

      {/* 3. 調整: 閉じた形 */}
      <SceneTitle x={2 * W + 90} y={240} w={620} eyebrow={s[0].eyebrow} title={s[0].title} size={58} accent={MINT} />
      <Place x={2 * W + 90} y={560} w={560} z={30}>
        <Chips items={t.sliders} size={22} accent={0} color={MINT} />
      </Place>
      <Place x={2 * W + 800} y={60} rotate={-3} z={10}>
        {closed(shots.duoClosedParameters, 580)}
      </Place>

      {/* 4. 書き出し: 開いた形とコード */}
      <SceneTitle x={3 * W + 90} y={96} w={560} eyebrow={s[1].eyebrow} title={s[1].title} size={58} accent={MINT} badge={<ProBadge size={18} />} />
      <Place x={3 * W + 620} y={320} rotate={3} z={10}>
        {open(shots.duoOpenExport, 760)}
      </Place>
      <Place x={3 * W + 70} y={500} rotate={-2} z={20}>
        <CodeCard width={560} size={17} lines={SWIFTUI_CODE} title="DeepOceanCaustics.swift" accent={MINT} keywords={["colorEffect", "ShaderLibrary", "Rectangle", "TimelineView"]} />
      </Place>

      {/* 5. 学ぶ: 開いた形のレッスン一覧と、閉じた形 */}
      <SceneTitle x={4 * W + 90} y={96} w={620} eyebrow={s[2].eyebrow} title={s[2].title} size={58} accent={MINT} />
      <Place x={4 * W + 90} y={410} w={560} z={30}>
        <Chips items={t.steps} size={22} accent={0} color={MINT} />
      </Place>
      <Place x={4 * W + 640} y={300} rotate={-3} z={10}>
        {open(shots.duoOpenLearn, 760)}
      </Place>

      {/* 6. 登録なしで: 閉じた形のライブラリと、開いた形の作成画面 */}
      <SceneTitle x={5 * W + 90} y={240} w={620} eyebrow={s[3].eyebrow} title={s[3].title} size={58} accent={MINT} />
      <Place x={5 * W + 90} y={560} w={560} z={30}>
        <Chips items={t.privacy} size={22} accent={0} color={MINT} />
      </Place>
      <Place x={5 * W + 640} y={560} rotate={-4} z={9}>
        {open(shots.duoOpenHome, 560)}
      </Place>
      <Place x={5 * W + 900} y={60} rotate={3} z={10}>
        {closed(shots.duoClosedLibrary, 540)}
      </Place>
    </>
  );
}


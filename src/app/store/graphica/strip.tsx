"use client";

import type { ReactNode } from "react";

import { type Bezel, type Bezels, Device } from "../intento/strip";
import { BODY, Bokeh, G, Kicker, type Light, MacWindow, MONO, Phone, Place, StoreStyle, Tablet, Wordmark } from "./parts";

/**
 * GRAPHICA の App Store のスクリーンショットを、横に 1 枚つながった絵として描く（開発サーバーでだけ開ける）。
 * 1・2 枚目は、いま App Store に出ている画像（iPhone 6.5" / iPad 12.9" 横 / Mac / Vision Pro の各 2 枚）の
 * 構図・色・書体・コピーをそのまま組み直したもの。中の画面だけを最新の実機スクショに差し替える。
 * 3〜6 枚目と iPhone Duo の帯は、同じ文法（ぼけた光・Syne のワードマーク・Plex Mono の一言）で足した。
 * iPhone は 440×956 を 3 倍（1320×2868）、iPad は横の 1376×1032 を 2 倍（2752×2064）、
 * Duo は 1467×1032 を 1.94477 倍（2853×2007）、Mac は 1440×900 を 2 倍、Vision Pro は 1920×1080 を 2 倍。
 * 傾きは左から順に左右を交互にする。
 */

export const FRAME = {
  iphone: { w: 440, h: 956, count: 6 },
  ipad: { w: 1376, h: 1032, count: 6 },
  duoInner: { w: 1467, h: 1032, count: 6 },
  mac: { w: 1440, h: 900, count: 2 },
  vision: { w: 1920, h: 1080, count: 2 },
} as const;
export type GDevice = keyof typeof FRAME;
export type Lang = "ja" | "en";

/** 実機のスクショ（graphica の ios/Graphica/scripts/capture_screenshots.sh の出力）の公開パス */
export type GShots = Record<
  | "iphoneGallery"
  | "iphoneDetail"
  | "iphoneCreate"
  | "iphoneDetail2"
  | "ipadGallery"
  | "ipadDetail"
  | "ipadCreate"
  | "ipadDetail2",
  string
> &
  Partial<
    Record<
      | "duoOpenGallery"
      | "duoOpenDetail"
      | "duoOpenDetail2"
      | "duoClosedGallery"
      | "duoClosedCreate"
      | "duoClosedDetail"
      | "macGallery"
      | "macDetail"
      | "visionGallery"
      | "visionDetail",
      string
    >
  >;

export type Copy = {
  /** いまのストア画像の説明文（3 行） */
  lead: string[];
  kicker: string;
  scenes: { eyebrow: string; title: string[]; note?: string }[];
  ways: string[];
  devices: string;
  free: string;
};

// 3〜6 枚目の見出しは graphica の Web 版の紹介ページ（components/landing/GraphicaAppLanding.tsx）の文言から取る
export const COPY: Record<Lang, Copy> = {
  ja: {
    lead: ["コードは書かない。ことばを置くだけ。", "あなたの一文を、AI が WebGL のジェネラティブアートに変換して", "共有するギャラリー。"],
    kicker: "Generative art, from words",
    scenes: [
      { eyebrow: "Your way", title: ["生成のしかたは、", "選べる。"] },
      { eyebrow: "Open source art", title: ["どの作品も、", "コードまで読める。"] },
      { eyebrow: "Native", title: ["一枚の作品が、", "どの端末でも動く。"] },
      { eyebrow: "Free", title: ["今夜の空を、", "ことばにしてみる。"] },
    ],
    ways: ["オンデバイス", "共有の無料枠", "自分の API キー", "AI エージェント"],
    devices: "iPhone · iPad · Mac · Apple Vision Pro",
    free: "無料 · 広告なし · 閲覧はサインイン不要",
  },
  en: {
    lead: ["No code. Just put down words.", "A gallery where AI turns your one sentence into WebGL", "generative art you can share."],
    kicker: "Generative art, from words",
    scenes: [
      { eyebrow: "Your way", title: ["Generate", "the way you like."] },
      { eyebrow: "Open source art", title: ["Every work comes", "with its code."] },
      { eyebrow: "Native", title: ["One work, alive on", "every device."] },
      { eyebrow: "Free", title: ["Put tonight's sky", "into words."] },
    ],
    ways: ["On-device", "Free shared quota", "Your own API key", "AI agents"],
    devices: "iPhone · iPad · Mac · Apple Vision Pro",
    free: "Free · No ads · Browse without signing in",
  },
};

/** #017「電脳の海」の GLSL（本番の API の shader_body から抜粋。コードまで読める、の見本） */
const CODE_017 = [
  "// --- Digital Ocean Flow Field ---",
  "vec2 flow_uv = uv * 0.7 + time * 0.5;",
  "vec2 displacement = vec2(",
  "    fbm(flow_uv * 3.0 + vec2(0.0, time * 0.5)),",
  "    fbm(flow_uv * 3.0 + vec2(time * 0.5, 0.0))",
  ") * 0.2;",
  "vec2 distorted_uv = uv + displacement;",
  "",
  "// --- Flowing Text/Data Pattern ---",
  "vec2 grid_uv = distorted_uv * 15.0;",
  "grid_uv.y -= iTime * 0.3;",
];

export function CodeCard({ width, size, lines = CODE_017, title = "#017 · shader.glsl", accent = G.acid, keywords = ["fbm", "vec2"] }: { width: number; size: number; lines?: string[]; title?: string; accent?: string; keywords?: string[] }) {
  return (
    <div className="overflow-hidden rounded-[0.9em] border border-white/10 bg-[#0c0d12]/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur" style={{ width, fontSize: size }}>
      <div className={`flex items-center gap-[0.5em] border-b border-white/10 px-[1em] py-[0.6em] text-white/45 ${MONO}`}>
        <span className="h-[0.6em] w-[0.6em] rounded-full" style={{ background: accent }} />
        {title}
      </div>
      <pre className={`px-[1em] py-[0.8em] leading-[1.6] text-white/80 ${MONO}`}>
        {lines.map((line, i) => (
          <span key={i} className={`block whitespace-pre ${line.startsWith("//") ? "text-white/35" : ""}`}>
            {line
              .split(new RegExp(`(${keywords.join("|")})`))
              .map((part, j) => (keywords.includes(part) ? <span key={j} style={{ color: part === keywords[0] ? accent : "#9fb7ff" }}>{part}</span> : part))}
            {line === "" ? " " : null}
          </span>
        ))}
      </pre>
    </div>
  );
}

/** 3 枚目以降の見出し: Plex Mono の一言（acid）と、日本語の 2 行 */
export function SceneTitle({ x, y, w, eyebrow, title, size, align = "left", accent = G.acid, badge }: { x: number; y: number; w: number; eyebrow: string; title: string[]; size: number; align?: "left" | "center"; accent?: string; badge?: ReactNode }) {
  return (
    <Place x={x} y={y} w={w} z={30} className={`flex flex-col ${align === "center" ? "items-center text-center" : ""}`} style={{ gap: size * 0.45 }}>
      <span className="flex items-center" style={{ gap: size * 0.3 }}>
        <Kicker size={size * 0.42} style={{ color: accent }}>
          {eyebrow}
        </Kicker>
        {badge}
      </span>
      <h2 className={`font-bold leading-[1.28] tracking-[0.01em] [font-feature-settings:'palt'] ${BODY}`} style={{ fontSize: size, color: G.paper }}>
        {title.map((line) => (
          <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        ))}
      </h2>
    </Place>
  );
}

export function Lead({ x, y, size, lines, z = 30, trailing }: { x: number; y: number; size: number; lines: string[]; z?: number; trailing?: ReactNode }) {
  return (
    <Place x={x} y={y} z={z} className={`flex flex-col whitespace-nowrap tracking-[0.04em] ${BODY}`} style={{ fontSize: size, lineHeight: 1.62, color: "rgba(236,233,226,0.92)" }}>
      {lines.map((line, i) => (
        <span key={line} className="flex items-center" style={{ gap: size * 0.5 }}>
          {line}
          {i === lines.length - 1 && trailing}
        </span>
      ))}
    </Place>
  );
}

export function Chips({ items, size, accent, color = G.acid }: { items: string[]; size: number; accent?: number; color?: string }) {
  return (
    <div className="flex flex-wrap" style={{ gap: size * 0.5 }}>
      {items.map((item, i) => (
        <span
          key={item}
          className={`whitespace-nowrap rounded-full border px-[0.9em] py-[0.45em] font-medium ${BODY}`}
          style={{ fontSize: size, color: i === accent ? "#111" : G.paper, background: i === accent ? color : "rgba(12,13,18,0.7)", borderColor: i === accent ? color : "rgba(255,255,255,0.14)" }}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export function GraphicaStoreStrip({ device, lang, shots, bezels = {} }: { device: GDevice; lang: Lang; shots: GShots; bezels?: Bezels }) {
  const { w, h, count } = FRAME[device];
  const t = COPY[lang];
  return (
    <div data-store-strip={`${w}x${h}x${count}`} lang={lang} className="relative overflow-hidden antialiased [&_*]:!animate-none [&_*]:!transition-none" style={{ width: w * count, height: h, background: G.void }}>
      <StoreStyle />
      {device === "iphone" && <IphoneScene t={t} shots={shots} />}
      {(device === "ipad" || device === "duoInner") && <LandscapeScene device={device} t={t} shots={shots} bezels={bezels} />}
      {device === "mac" && <MacScene t={t} shots={shots} />}
      {device === "vision" && <VisionScene t={t} shots={shots} />}
    </div>
  );
}

// 光源は帯の上の端に並べ、1・2 枚目はいまの画像と同じく 1 枚目の右上と 2 枚目の右上から差す
export function lightsFor(w: number, count: number, k: number): Light[] {
  return Array.from({ length: count }, (_, i) => ({ x: i * w + w * (i % 2 ? 0.78 : 0.95), y: -40 * k, r: 260 * k, angle: i % 2 ? 8 : -6 }));
}

function IphoneScene({ t, shots }: { t: Copy; shots: GShots }) {
  const W = FRAME.iphone.w;
  const s = t.scenes;
  return (
    <>
      <Bokeh width={W * 6} height={956} lights={lightsFor(W, 6, 1)} />

      {/* 1・2. いまの画像のまま: ワードマークと説明文が 2 枚にまたがり、iPhone が 1 台ずつ */}
      <Place x={45} y={36} z={30}>
        <Wordmark size={62} />
      </Place>
      <Lead x={45} y={112} size={15.5} lines={t.lead} />
      <Place x={56} y={214} rotate={-4} z={10}>
        <Phone src={shots.iphoneGallery} width={350} />
      </Place>
      {/* いまの画像は 2 台とも左に傾いているので、2 台目は右へ傾けて交互にする */}
      <Place x={W + 46} y={170} rotate={3} z={10}>
        <Phone src={shots.iphoneDetail} width={350} />
      </Place>

      {/* 3. 生成のしかた */}
      <SceneTitle x={2 * W + 30} y={70} w={W - 60} eyebrow={s[0].eyebrow} title={s[0].title} size={32} />
      <Place x={2 * W + 30} y={232} w={W - 60} z={30}>
        <Chips items={t.ways} size={13} accent={0} />
      </Place>
      <Place x={2 * W + 70} y={340} rotate={-3} z={10}>
        <Phone src={shots.iphoneCreate} width={310} />
      </Place>

      {/* 4. コードまで読める */}
      <SceneTitle x={3 * W + 30} y={70} w={W - 60} eyebrow={s[1].eyebrow} title={s[1].title} size={32} />
      <Place x={3 * W + 96} y={250} rotate={3} z={10}>
        <Phone src={shots.iphoneDetail2} width={300} />
      </Place>
      <Place x={3 * W + 14} y={640} rotate={-2} z={20}>
        <CodeCard width={380} size={10.5} />
      </Place>

      {/* 5. どの端末でも: iPad の横向きと iPhone */}
      <SceneTitle x={4 * W + 30} y={70} w={W - 60} eyebrow={s[2].eyebrow} title={s[2].title} size={32} />
      <Place x={4 * W + 30} y={232} z={30}>
        <Kicker size={12} style={{ color: "rgba(236,233,226,0.6)" }}>
          {t.devices}
        </Kicker>
      </Place>
      <Place x={4 * W + 22} y={330} rotate={-3} z={9}>
        <Tablet src={shots.ipadGallery} width={400} />
      </Place>
      <Place x={4 * W + 190} y={480} rotate={4} z={10}>
        <Phone src={shots.iphoneGallery} width={220} />
      </Place>

      {/* 6. 締め: ワードマークと無料の一言、作品の詳細 */}
      <SceneTitle x={5 * W + 30} y={70} w={W - 60} eyebrow={s[3].eyebrow} title={s[3].title} size={32} />
      <Place x={5 * W + 30} y={232} z={30}>
        <span className={`text-[13px] text-white/65 ${BODY}`}>{t.free}</span>
      </Place>
      <Place x={5 * W + 30} y={268} z={30}>
        <Wordmark size={30} />
      </Place>
      <Place x={5 * W + 72} y={350} rotate={-3} z={10}>
        <Phone src={shots.iphoneDetail} width={300} />
      </Place>
    </>
  );
}

/**
 * iPad（横）と Duo（開いた横向き）の 6 枚。1・2 枚目はいまの iPad の画像の構図
 * （1: 端末が右上・ワードマークと説明文が左下、2: 一言が上の中央・端末がまっすぐ中央）。
 * Duo では開いた形と閉じた形を、iPad では iPad と iPhone を組み合わせる（Duo の帯に普通の iPhone は出さない）
 */
function LandscapeScene({ device, t, shots, bezels }: { device: "ipad" | "duoInner"; t: Copy; shots: GShots; bezels: Bezels }) {
  const { w: W, h: H } = FRAME[device];
  const duo = device === "duoInner";
  const s = t.scenes;
  const wide = (src: string | undefined, width: number) =>
    duo ? <Device src={src!} kind="duoOpen" width={width} bezel={bezels.open as Bezel | undefined} /> : <Tablet src={src!} width={width} />;
  const tall = (src: string | undefined, width: number) =>
    duo ? <Device src={src!} kind="duoClosed" width={width} bezel={bezels.closed as Bezel | undefined} /> : <Phone src={src!} width={width} />;
  const gallery = duo ? shots.duoOpenGallery : shots.ipadGallery;
  const detail = duo ? shots.duoOpenDetail : shots.ipadDetail;
  const detail2 = duo ? shots.duoOpenDetail2 : shots.ipadDetail2;
  const create = duo ? shots.duoClosedCreate : shots.iphoneCreate;
  const tallGallery = duo ? shots.duoClosedGallery : shots.iphoneGallery;
  const tallDetail = duo ? shots.duoClosedDetail : shots.iphoneDetail;
  const deviceW = duo ? 900 : 880;
  const titleSize = 58;
  return (
    <>
      <Bokeh width={W * 6} height={H} lights={lightsFor(W, 6, 2)} scale={1.6} density={0.55} seed={11} />

      {/* 1. いまの iPad の 1 枚目: 端末が右上、ワードマークと説明文が左下 */}
      <Place x={W - deviceW - 50} y={70} rotate={3} z={10}>
        {wide(gallery, deviceW)}
      </Place>
      <Place x={78} y={H - 268} z={30}>
        <Wordmark size={60} />
      </Place>
      <Lead x={78} y={H - 182} size={24} lines={t.lead} />

      {/* 2. いまの iPad の 2 枚目: 一言が上の中央、端末がまっすぐ中央 */}
      <Place x={W} y={104} w={W} z={30} className="flex justify-center">
        <Kicker size={36}>{t.kicker}</Kicker>
      </Place>
      <Place x={W + (W - 940) / 2} y={200} z={10}>
        {wide(detail, 940)}
      </Place>

      {/* 3. 生成のしかた: 縦の端末で Create */}
      <SceneTitle x={2 * W + 90} y={240} w={620} eyebrow={s[0].eyebrow} title={s[0].title} size={titleSize} />
      <Place x={2 * W + 90} y={560} w={560} z={30}>
        <Chips items={t.ways} size={22} accent={0} />
      </Place>
      <Place x={2 * W + 790} y={60} rotate={-3} z={10}>
        {tall(create, duo ? 580 : 400)}
      </Place>

      {/* 4. コードまで読める */}
      <SceneTitle x={3 * W + 90} y={96} w={560} eyebrow={s[1].eyebrow} title={s[1].title} size={titleSize} />
      <Place x={3 * W + 620} y={320} rotate={3} z={10}>
        {wide(detail2, 760)}
      </Place>
      <Place x={3 * W + 70} y={520} rotate={-2} z={20}>
        <CodeCard width={600} size={17} />
      </Place>

      {/* 5. どの端末でも */}
      <SceneTitle x={4 * W + 90} y={96} w={560} eyebrow={s[2].eyebrow} title={s[2].title} size={titleSize} />
      <Place x={4 * W + 94} y={330} z={30}>
        <Kicker size={20} style={{ color: "rgba(236,233,226,0.6)" }}>
          {t.devices}
        </Kicker>
      </Place>
      <Place x={4 * W + 160} y={430} rotate={-3} z={10}>
        {duo ? <Tablet src={shots.ipadGallery} width={760} /> : <Phone src={shots.iphoneDetail2} width={300} />}
      </Place>
      <Place x={4 * W + (duo ? 960 : 560)} y={duo ? 150 : 400} rotate={4} z={11}>
        {duo ? tall(tallGallery, 520) : <Tablet src={shots.ipadCreate} width={720} />}
      </Place>

      {/* 6. 締め */}
      <SceneTitle x={5 * W + 90} y={240} w={620} eyebrow={s[3].eyebrow} title={s[3].title} size={titleSize} />
      <Place x={5 * W + 94} y={560} z={30}>
        <span className={`text-[22px] text-white/65 ${BODY}`}>{t.free}</span>
      </Place>
      <Place x={5 * W + 94} y={H - 150} z={30}>
        <Wordmark size={46} />
      </Place>
      <Place x={5 * W + 820} y={60} rotate={3} z={10}>
        {tall(tallDetail, duo ? 580 : 400)}
      </Place>
    </>
  );
}

// 撮ったウィンドウ（1280x800pt を 2 倍、2560x1600）の縦横比。切り出さずに全体を見せる
const MAC_ASPECT = 2560 / 1600;
const MAC_CROP = { gallery: { w: 1, h: 1 }, detail: { w: 1, h: 1 } };

/** Mac の 2 枚。いまの画像の構図のまま（1: ウィンドウが右上・ワードマークが左下、2: 一言が上・ウィンドウが中央） */
function MacScene({ t, shots }: { t: Copy; shots: GShots }) {
  const W = FRAME.mac.w;
  return (
    <>
      <Bokeh width={W * 2} height={900} lights={lightsFor(W, 2, 2)} scale={1.6} density={0.55} seed={5} />
      <Place x={514} y={89} z={10}>
        <MacWindow src={shots.macGallery!} width={800} crop={MAC_CROP.gallery} aspect={MAC_ASPECT} />
      </Place>
      <Place x={81} y={708} z={30}>
        <Wordmark size={46} />
      </Place>
      <Lead x={81} y={772} size={20} lines={t.lead} />
      <Place x={W} y={132} w={W} z={30} className="flex justify-center">
        <Kicker size={30}>{t.kicker}</Kicker>
      </Place>
      <Place x={W + 290} y={200} z={10}>
        <MacWindow src={shots.macDetail!} width={860} crop={MAC_CROP.detail} aspect={MAC_ASPECT} />
      </Place>
    </>
  );
}

/** Vision Pro の 2 枚。部屋ごと撮った画面に、いまの画像と同じ位置で文字を重ねる */
function VisionScene({ t, shots }: { t: Copy; shots: GShots }) {
  const W = FRAME.vision.w;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shots.visionGallery} alt="" className="absolute left-0 top-0" style={{ width: W, height: 1080 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={shots.visionDetail} alt="" className="absolute top-0" style={{ left: W, width: W, height: 1080 }} />
      {/* 文字の下だけ少し暗くして、明るい部屋の上でも読めるようにする */}
      <div className="absolute" style={{ left: 0, top: 760, width: 900, height: 320, background: "radial-gradient(80% 90% at 20% 70%, rgba(0,0,0,0.45), transparent 75%)" }} />
      <Place x={92} y={876} z={30}>
        <Wordmark size={44} />
      </Place>
      <Lead x={92} y={940} size={19} lines={t.lead} />
      <div className="absolute" style={{ left: W + 560, top: 200, width: 800, height: 120, background: "radial-gradient(60% 60% at 50% 50%, rgba(0,0,0,0.35), transparent 75%)" }} />
      <Place x={W} y={244} w={W} z={30} className="flex justify-center">
        <Kicker size={30}>{t.kicker}</Kicker>
      </Place>
    </>
  );
}


"use client";

import { ControlPad, WatchFace, WidgetCard } from "@/components/intento/Surfaces";
import { SiriBubble } from "@/components/intento/VoiceDemo";

import { At, Device, type Lang, type Shots } from "./strip";

/**
 * iOS 27 のプロダクトページのヘッダー（21:9）と検索結果（3:2）の 1 枚絵。2 倍で撮ると 3840×1646 / 3840×2560。
 * ヘッダーは iPhone では中央だけが残り、上の角に戻る・共有のボタンが重なる。Apple のテンプレートの安全領域
 * （3840×1646 で中央の 1646×661）に見出しを収め、外側は iPad や Mac で見える飾りだけにする。
 */
export const ART = { header: { w: 1920, h: 823 }, search: { w: 1920, h: 1280 } } as const;
export type ArtKind = keyof typeof ART;
const HEADER_SAFE = { x: 548, y: 246, w: 824 }; // 高さ 331 は見出しの枠の h-[331px]

type Copy = {
  header: string;
  /** 安全領域の幅に 1 行で収まる大きさ */
  headerSize: number;
  headerSub: string;
  search: string[];
  searchSub: string;
  phrase: string;
  widgetTodos: string[];
  widgetHeader: string;
  left: (n: number) => string;
  remaining: string;
};

const COPY: Record<Lang, Copy> = {
  ja: {
    header: "開かなくても、使える。",
    headerSize: 76,
    headerSub: "Siri・ウィジェット・ロック画面・Apple Watch から",
    search: ["話しかけるだけで、", "片づく。"],
    searchSub: "追加も、完了も、あと回しも。",
    phrase: "「Intento で歯医者を予約するを完了」",
    widgetTodos: ["登壇のリハーサルをする", "1.0 のビルドを提出する", "歯医者を予約する"],
    widgetHeader: "やること",
    left: (n) => `残り ${n}`,
    remaining: "未完了",
  },
  en: {
    header: "Works without opening.",
    headerSize: 68,
    headerSub: "From Siri, widgets, the Lock Screen and Apple Watch",
    search: ["Just say it.", "It's done."],
    searchSub: "Add, complete, or snooze.",
    phrase: "“Complete Book the dentist in Intento”",
    widgetTodos: ["Rehearse the talk", "Submit the 1.0 build", "Book the dentist"],
    widgetHeader: "To Do",
    left: (n) => `${n} left`,
    remaining: "Remaining",
  },
};

// 部品はどれも同じ長い影で同じ面に浮かせる。影の向きと長さをそろえると、ばらばらの部品が 1 枚の絵になる
const FLOAT = "shadow-[0_50px_90px_-30px_rgba(20,20,40,0.35),0_8px_20px_-8px_rgba(20,20,40,0.18)]";

/** Siri の色をぼかした光。中央は白く抜いて見出しの読みやすさを守り、色は外側に寄せる */
function Glow({ blobs }: { blobs: { x: number; y: number; r: number; c: string; o?: number }[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {blobs.map((b) => (
        <span
          key={`${b.x}-${b.y}`}
          className="absolute rounded-full blur-[140px]"
          style={{ left: b.x - b.r, top: b.y - b.r, width: b.r * 2, height: b.r * 2, background: b.c, opacity: b.o ?? 0.45 }}
        />
      ))}
      {/* 大きなぼかしは色が段になりやすいので、ごく薄い粒子を重ねてならす */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
    </div>
  );
}

export function IntentoStoreArt({ kind, lang, shots }: { kind: ArtKind; lang: Lang; shots: Shots }) {
  const t = COPY[lang];
  const { w, h } = ART[kind];
  return (
    <div
      data-store-strip={`${w}x${h}x1`}
      lang={lang}
      className="relative overflow-hidden bg-[#FAFAFC] font-[-apple-system,BlinkMacSystemFont,'Hiragino_Sans','Hiragino_Kaku_Gothic_ProN','Noto_Sans_JP',sans-serif] text-[#1d1d1f] antialiased [&_*]:!animate-none [&_*]:!transition-none"
      style={{ width: w, height: h }}
    >
      <style>{"nextjs-portal{display:none!important}body{margin:0}"}</style>
      {kind === "header" ? <HeaderScene t={t} shots={shots} /> : <SearchScene t={t} shots={shots} />}
    </div>
  );
}

/** ヘッダー: 見出しは中央の安全領域に中央揃えで置き、左右に「開かずに触れる場所」の部品を同じ影で浮かせる */
function HeaderScene({ t, shots }: { t: Copy; shots: Shots }) {
  const s = HEADER_SAFE;
  return (
    <>
      <Glow
        blobs={[
          { x: 120, y: 620, r: 360, c: "#5AC8FA" },
          { x: 420, y: 120, r: 300, c: "#AF52DE", o: 0.35 },
          { x: 1500, y: 700, r: 340, c: "#FF2D55", o: 0.3 },
          { x: 1820, y: 160, r: 360, c: "#FF9500", o: 0.4 },
        ]}
      />
      <At x={s.x} y={s.y} w={s.w} z={30} className="flex h-[331px] flex-col items-center justify-center gap-5 text-center">
        <h1 className="whitespace-nowrap font-bold leading-none tracking-[-0.02em] [font-feature-settings:'palt']" style={{ fontSize: t.headerSize }}>
          {t.header}
        </h1>
        <p className="text-[26px] font-semibold text-neutral-500">{t.headerSub}</p>
      </At>

      {/* 左: ウィジェットと話しかけた言葉 */}
      <At x={96} y={170} w={380} rotate={-6} z={10} zoom={1.25}>
        <WidgetCard todos={t.widgetTodos} done={[false, false, true]} header={t.widgetHeader} leftLabel={t.left} className={`max-w-none ${FLOAT}`} />
      </At>
      <At x={110} y={560} rotate={-3} z={20} zoom={1.3}>
        <SiriBubble className={`whitespace-nowrap [&>div]:line-clamp-none ${FLOAT}`}>{t.phrase}</SiriBubble>
      </At>

      {/* 右: コントロールと Apple Watch */}
      <At x={1450} y={140} rotate={6} z={10} zoom={1.3} className={`rounded-[40px] bg-[#1d1d1f]/90 p-6 ${FLOAT}`}>
        <ControlPad count={2} remainingLabel={t.remaining} />
      </At>
      <At x={1590} y={440} rotate={-5} z={11} zoom={1.15}>
        <WatchFace src={shots.watchList} className={FLOAT} />
      </At>
    </>
  );
}

/** 検索結果: Apple の見本と同じく、左に見出し（左端をそろえる）、右に端末を 1 台だけ置く */
function SearchScene({ t, shots }: { t: Copy; shots: Shots }) {
  return (
    <>
      <Glow
        blobs={[
          { x: 1500, y: 260, r: 420, c: "#AF52DE", o: 0.35 },
          { x: 1760, y: 900, r: 440, c: "#FF9500", o: 0.38 },
          { x: 1080, y: 1080, r: 380, c: "#5AC8FA", o: 0.4 },
        ]}
      />
      <At x={150} y={430} w={900} z={30} className="flex flex-col gap-8">
        <h1 className="text-[104px] font-bold leading-[1.15] tracking-[-0.02em] [font-feature-settings:'palt']">
          {t.search.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="text-[38px] font-semibold text-neutral-500">{t.searchSub}</p>
      </At>
      <At x={1230} y={170} w={480} rotate={-5} z={10} className={`rounded-[64px] ${FLOAT}`}>
        <Device src={shots.iphoneList} kind="iphone" width={480} />
      </At>
      <At x={1010} y={760} rotate={-3} z={20} zoom={1.45}>
        <SiriBubble className={`whitespace-nowrap [&>div]:line-clamp-none ${FLOAT}`}>{t.phrase}</SiriBubble>
      </At>
    </>
  );
}

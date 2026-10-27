import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";
import { FFStoreArt } from "./art";
import { FFFeatureGraphic, FFPlayStrip, type PlayShots } from "./play";
import { type FFShots, FFStoreStrip } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// 実機のスクショ（_store-screenshots/FFMultiply）と、アプリのアイコン・DSEG7 フォントをここへ写す（gitignore）
const SHOT_FILES: Record<Exclude<keyof FFShots, `duo${string}`>, string> = {
  home: "iphone/{lang}/01-home.png",
  game: "iphone/{lang}/02-game.png",
  result: "iphone/{lang}/03-result.png",
  ranking: "iphone/{lang}/04-ranking.png",
  local: "iphone/{lang}/05-local-score.png",
  icon: "icon.png",
};

const DUO_FILES = {
  duoOpenHome: "duo-open/{lang}/01-home.png",
  duoOpenGame: "duo-open/{lang}/02-game.png",
  duoOpenResult: "duo-open/{lang}/03-result.png",
  duoOpenRanking: "duo-open/{lang}/04-ranking.png",
  duoClosedHome: "duo-closed/{lang}/01-home.png",
  duoClosedGame: "duo-closed/{lang}/02-game.png",
  duoClosedLocal: "duo-closed/{lang}/05-local-score.png",
};

// parts.tsx の SEG_FONT と同じ（クライアント部品の定数はサーバーから読めない）
const SEG_FONT = "/store-shots/ffmultiply/DSEG7ClassicMini-Bold.ttf";

const BEZELS_JSON = path.join(
  process.cwd(),
  "public/store-bezels/duo/bezels.json",
);
// 黒地では Night Sky の枠が沈むので、同じ形の Star White を使う（画面の位置は同じ）
const BEZEL_COLOR = "Star White";

export default async function FFMultiplyStorePage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string; device?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device = params.device;
  if (device === "android" || device === "feature") return <PlayPage device={device} lang={lang} />;
  const duo = device === "duoInner";
  const files = duo ? { ...SHOT_FILES, ...DUO_FILES } : SHOT_FILES;
  const shots = Object.fromEntries(
    Object.entries(files).map(([key, file]) => [
      key,
      `/store-shots/ffmultiply/${file.replace("{lang}", lang)}`,
    ]),
  ) as FFShots;
  const missing = [...Object.values(shots), SEG_FONT].filter(
    (src) => !existsSync(path.join(process.cwd(), "public", src)),
  );
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショなどが無い:\n${missing.join("\n")}\n_store-screenshots/FFMultiply と FFMultiply の Assets（ffmultiicon.png → icon.png、DSEG7ClassicMini-Bold.ttf）から写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search")
    return <FFStoreArt kind={device} lang={lang} shots={shots} />;
  let bezels: Bezels = {};
  if (duo && existsSync(BEZELS_JSON)) {
    const raw = readFileSync(BEZELS_JSON, "utf8").replaceAll(
      "Night Sky",
      BEZEL_COLOR,
    );
    bezels = JSON.parse(raw);
  }
  return (
    <FFStoreStrip
      device={duo ? "duoInner" : "iphone"}
      lang={lang}
      shots={shots}
      bezels={bezels}
    />
  );
}

// Google Play 用。FFMultiplierAndroid の store-shots/raw ブランチ（Actions がエミュレータで撮る）の ja-JP と、
// Play の掲載のアイコン（app/src/main/play/listings/ja-JP/graphics/icon/1.png → icon.png）をここへ写す（gitignore）。
// アプリの画面は英語だけなので、en の画像も ja のスクショを使う
const PLAY_FILES: Record<keyof PlayShots, string> = {
  home: "android/ja/01-home.png",
  game: "android/ja/02-game.png",
  result: "android/ja/03-result.png",
  local: "android/ja/04-local-score.png",
  icon: "android/icon.png",
};
// ローカルスコアのスクショの 1 位の点数。自己ベストの札に出す
const PLAY_BEST = "2620";

function PlayPage({ device, lang }: { device: "android" | "feature"; lang: "ja" | "en" }) {
  const shots = Object.fromEntries(Object.entries(PLAY_FILES).map(([key, file]) => [key, `/store-shots/ffmultiply/${file}`])) as PlayShots;
  const missing = [...Object.values(shots), SEG_FONT].filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`エミュレータのスクショなどが無い:\n${missing.join("\n")}`}
      </pre>
    );
  }
  return device === "feature" ? <FFFeatureGraphic lang={lang} shots={shots} /> : <FFPlayStrip lang={lang} shots={shots} best={PLAY_BEST} />;
}

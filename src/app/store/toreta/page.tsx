import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";
import { ToretaStoreArt } from "./art";
import { ToretaStoreStrip, type ToretaShots } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は ../intento/strip.tsx と同じ）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Toreta の実機スクショ（_store-screenshots/Toreta）をここへ写す（gitignore）。Toreta は日本語だけ
const SHOT_FILES: Record<Exclude<keyof ToretaShots, `duo${string}`>, string> = {
  series: "iphone/ja/01-series.png",
  collection: "iphone/ja/02-collection.png",
  trade: "iphone/ja/04-trade.png",
  deck: "iphone/ja/05-deck.png",
};

// Duo の帯は開いた形が中心で、閉じた形は取り込みの 1 枚だけに出す。カードの詳細の画面は使わない
const DUO_FILES = {
  duoOpenCollection: "duo-open/ja/02-collection.png",
  duoOpenTrade: "duo-open/ja/04-trade.png",
  duoOpenDeck: "duo-open/ja/05-deck.png",
  duoClosedSeries: "duo-closed/ja/01-series.png",
};

// Apple の端末枠は再配布できないので gitignore。無いときは CSS で描いた枠になる（確認用で、ストアには出さない）
const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function ToretaStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { device } = await searchParams;
  const duo = device === "duoInner";
  const files = duo ? { ...SHOT_FILES, ...DUO_FILES } : SHOT_FILES;
  const shots = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, `/store-shots/toreta/${file}`])) as ToretaShots;
  // 欠けたまま撮ると壊れた画像がストアに出るので、どれが無いかを出して止める
  const missing = Object.values(shots).filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\n_store-screenshots/Toreta から public/store-shots/toreta へ写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search") return <ToretaStoreArt kind={device} shots={shots} />;
  const bezels: Bezels = duo && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8")) : {};
  return <ToretaStoreStrip device={duo ? "duoInner" : "iphone"} shots={shots} bezels={bezels} />;
}

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";
import { CheckitoutStoreArt } from "./art";
import { CheckitoutStoreStrip, type Shots, type StoreDevice } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は intento/strip.tsx と同じ）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// _store-screenshots/CheckItOut の実機スクショをここへ写して使う（gitignore）。アプリは日本語だけなので ja だけ
const SHOT_FILES: Record<Exclude<keyof Shots, `duo${string}`>, string> = {
  iphonePlay: "iphone/ja/01-play.png",
  iphoneEdit: "iphone/ja/02-edit.png",
  iphoneRecord: "iphone/ja/03-record.png",
  iphoneLandscape: "iphone/ja/04-landscape.png",
  ipadPlay: "ipad/ja/01-play.png",
  ipadEdit: "ipad/ja/02-edit.png",
  ipadRecord: "ipad/ja/03-record.png",
  ipadLandscape: "ipad/ja/04-landscape.png",
};

const DUO_FILES = {
  duoOpenPlay: "duo-open/ja/01-play.png",
  duoOpenEdit: "duo-open/ja/02-edit.png",
  duoClosedPlay: "duo-closed/ja/01-play.png",
  duoClosedEdit: "duo-closed/ja/02-edit.png",
  duoClosedRecord: "duo-closed/ja/03-record.png",
};

// Apple の端末枠は再配布できないので gitignore。無いときは CSS で描いた枠になる（確認用で、ストアには出さない）
const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function CheckitoutStorePage({ searchParams }: { searchParams: Promise<{ device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const { device } = await searchParams;
  const duo = device === "duoInner";
  const files = duo ? { ...SHOT_FILES, ...DUO_FILES } : SHOT_FILES;
  const shots = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, `/store-shots/checkitout/${file}`])) as Shots;
  const missing = Object.values(shots).filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\n_store-screenshots/CheckItOut を public/store-shots/checkitout へ写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search") return <CheckitoutStoreArt kind={device} shots={shots} />;
  const strip: StoreDevice = device === "ipad" || device === "duoInner" ? device : "iphone";
  const bezels: Bezels = duo && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8")) : {};
  return <CheckitoutStoreStrip device={strip} shots={shots} bezels={bezels} />;
}

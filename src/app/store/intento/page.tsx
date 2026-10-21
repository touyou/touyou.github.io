import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntentoStoreArt } from "./art";
import { type Bezels, IntentoStoreStrip, type Shots, type StoreDevice } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// scripts/store-screenshots.sh が IntentTodo の実機スクショをここへ写す（gitignore）
const SHOT_FILES: Record<Exclude<keyof Shots, `duo${string}`>, string> = {
  iphoneList: "iphone/{lang}/01-list.png",
  iphoneDetail: "iphone/{lang}/02-detail.png",
  ipadList: "ipad/{lang}/01-list.png",
  ipadDetail: "ipad/{lang}/02-detail.png",
  watchList: "watch/{lang}/01-list.png",
};

// Duo は開いた形（duo-open）と閉じた形（duo-closed）でフォルダが分かれる。帯は開いた形の 1 本で、閉じた形も中に出す
const DUO_FILES = {
  duoOpenList: "duo-open/{lang}/01-list.png",
  duoOpenDetail: "duo-open/{lang}/02-detail.png",
  duoClosedList: "duo-closed/{lang}/01-list.png",
  duoClosedDetail: "duo-closed/{lang}/02-detail.png",
};

// Apple の端末枠は再配布できないので gitignore。無いときは CSS で描いた枠になる（確認用で、ストアには出さない）
const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function IntentoStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device = params.device;
  const duo = device === "duoInner";
  const files = duo ? { ...SHOT_FILES, ...DUO_FILES } : SHOT_FILES;
  const shots = Object.fromEntries(
    Object.entries(files).map(([key, file]) => [key, `/store-shots/intento/${file.replace("{lang}", lang)}`]),
  ) as Shots;
  // 欠けたまま撮ると壊れた画像がストアに出るので、どれが無いかを出して止める
  const missing = Object.values(shots).filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\nscripts/store-screenshots.sh で IntentTodo の Screenshots/ から写す`}
      </pre>
    );
  }
  // header / search は iOS 27 のプロダクトページのヘッダーと検索結果の画像
  if (device === "header" || device === "search") return <IntentoStoreArt kind={device} lang={lang} shots={shots} />;
  const strip: StoreDevice = device === "ipad" || device === "duoInner" ? device : "iphone";
  const bezels: Bezels = duo && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8")) : {};
  return <IntentoStoreStrip device={strip} lang={lang} shots={shots} bezels={bezels} />;
}

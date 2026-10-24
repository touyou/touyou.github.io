import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TsukibyobuStoreArt } from "./art";
import { type Bezels, type Shots, type StoreDevice, TsukibyobuStoreStrip } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// scripts/store-screenshots.sh が Tsukibyobu の実機スクショをここへ写す（gitignore）
const SHOT_FILES: Record<keyof Shots, string[]> = {
  iphone: ["iphone/{lang}/01.png", "iphone/{lang}/02.png", "iphone/{lang}/03.png", "iphone/{lang}/04.png"],
  duoOpen: ["duo-open/{lang}/01.png", "duo-open/{lang}/02.png", "duo-open/{lang}/03.png", "duo-open/{lang}/04.png"],
  // 閉じた Duo の外画面。シミュレータでは外画面にアプリを出せないので、Tsukibyobu の byobu-render で 0°（朔）を描いたもの
  duoClosed: ["duo-closed/{lang}/01.png"],
};

// Apple の端末枠は再配布できないので gitignore（Intento と共用）。夜の地に溶けないよう明るい Star White を使う。
// 無いときは枠なしの画面だけになる（確認用で、ストアには出さない）
const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

function loadBezels(): Bezels {
  if (!existsSync(BEZELS_JSON)) return {};
  const bezels: Bezels = JSON.parse(readFileSync(BEZELS_JSON, "utf8"));
  for (const bezel of Object.values(bezels)) bezel.src = bezel.src.replace("Night Sky", "Star White");
  return bezels;
}

export default async function TsukibyobuStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device = params.device;
  const shots = Object.fromEntries(
    Object.entries(SHOT_FILES).map(([key, files]) => [key, files.map((file) => `/store-shots/tsukibyobu/${file.replace("{lang}", lang)}`)]),
  ) as Shots;
  // 欠けたまま撮ると壊れた画像がストアに出るので、どれが無いかを出して止める
  const missing = Object.values(shots)
    .flat()
    .filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\nscripts/store-screenshots.sh で Tsukibyobu の docs/app-store/screenshots/raw から写す`}
      </pre>
    );
  }
  // header / search は iOS 27 のプロダクトページのヘッダーと検索結果の画像
  const bezels = loadBezels();
  if (device === "header" || device === "search") return <TsukibyobuStoreArt kind={device} lang={lang} shots={shots} bezels={bezels} />;
  const strip: StoreDevice = device === "duoInner" ? "duoInner" : "iphone";
  return <TsukibyobuStoreStrip device={strip} lang={lang} shots={shots} bezels={bezels} />;
}

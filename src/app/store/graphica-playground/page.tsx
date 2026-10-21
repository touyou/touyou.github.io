import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";
import { PlaygroundStoreArt } from "./art";
import { type PDevice, PlaygroundStoreStrip, type PShots } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// 実機のスクショ（graphica の ios/GraphicaPlayground/scripts/capture_screenshots.sh の出力）をここへ写す（gitignore）
const NAMES = {
  Editor: "01-editor",
  Lesson: "02-lesson",
  Parameters: "03-parameters",
  Export: "04-export-swiftui",
  Learn: "05-learn",
  Home: "06-create-home",
  Library: "07-library",
} as const;

const DIRS = { iphone: "iphone", ipad: "ipad", duoOpen: "duo-open", duoClosed: "duo-closed" } as const;

const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function PlaygroundStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device = params.device;
  const duo = device === "duoInner";
  const used = duo ? (["duoOpen", "duoClosed", "ipad"] as const) : (["iphone", "ipad"] as const);
  const entries = used.flatMap((prefix) =>
    Object.entries(NAMES).map(([key, name]) => [`${prefix}${key}`, `/store-shots/graphica-playground/${DIRS[prefix]}/${lang}/${name}.png`]),
  );
  const shots = { ...Object.fromEntries(entries), icon: "/store-shots/graphica-playground/icon.png" } as PShots;
  // 帯で実際に使うものだけを確かめる（Duo の閉じた形は 3 枚しか使わない）
  const missing = Object.values(shots).filter((src) => !existsSync(path.join(process.cwd(), "public", src)) && !/duo-closed\/\w+\/0[1245]/.test(src));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\ngraphica の ios/GraphicaPlayground/scripts/capture_screenshots.sh で撮って写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search") return <PlaygroundStoreArt kind={device} lang={lang} shots={shots} />;
  const strip: PDevice = device === "ipad" || duo ? (device as PDevice) : "iphone";
  // 暗い地では Night Sky の枠が沈むので、Star White の枠を使う（画面の位置は同じ）
  const bezels: Bezels = duo && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8").replaceAll("Night Sky", "Star White")) : {};
  return <PlaygroundStoreStrip device={strip} lang={lang} shots={shots} bezels={bezels} />;
}

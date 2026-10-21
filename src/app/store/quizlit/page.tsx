import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";

import { QuizStoreArt } from "./art";
import { type QuizDevice, type QuizShots, QuizStoreStrip } from "./strip";

// QuizLiT（Programming Quiz）の App Store のスクリーンショットの元絵。開発サーバーでだけ開ける
export const metadata: Metadata = { robots: { index: false, follow: false } };

// 実機のスクショは public/store-shots/quizlit/{iphone,ipad,duo-open,duo-closed}/<lang>/ に写す（gitignore）。
// 撮影はアプリが日本語だけなので ja だけ
const FOLDERS = { iphone: "iphone", ipad: "ipad", duoOpen: "duo-open", duoClosed: "duo-closed" } as const;

// 撮影スクリプトのファイル名（01-home.png〜04-result.png）
const SCREENS = [
  { key: "home", file: "01-home.png" },
  { key: "question", file: "02-question.png" },
  { key: "answered", file: "03-answered.png" },
  { key: "result", file: "04-result.png" },
] as const;

const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function QuizStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = "ja";
  const device = params.device;
  const duo = device === "duoInner";
  const folders = Object.entries(FOLDERS).filter(([key]) => duo || !key.startsWith("duo"));
  const shots = Object.fromEntries(
    folders.map(([key, folder]) => [key, Object.fromEntries(SCREENS.map((s) => [s.key, `/store-shots/quizlit/${folder}/${lang}/${s.file}`]))]),
  ) as QuizShots;
  const missing = Object.values(shots)
    .flatMap((set) => Object.values(set ?? {}))
    .filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\n_store-screenshots/QuizLiT/ から public/store-shots/quizlit/ へ写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search") return <QuizStoreArt kind={device} shots={shots} />;
  const strip: QuizDevice = device === "ipad" || device === "duoInner" ? device : "iphone";
  const bezels: Bezels = duo && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8")) : {};
  return <QuizStoreStrip device={strip} shots={shots} bezels={bezels} />;
}

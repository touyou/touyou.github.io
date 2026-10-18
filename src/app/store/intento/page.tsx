import { existsSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntentoStoreStrip, type Shots, type StoreDevice } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// scripts/store-screenshots.sh が IntentTodo の実機スクショをここへ写す（gitignore）
const SHOT_FILES: Record<keyof Shots, string> = {
  iphoneList: "iphone/{lang}/01-list.png",
  iphoneDetail: "iphone/{lang}/02-detail.png",
  ipadList: "ipad/{lang}/01-list.png",
  ipadDetail: "ipad/{lang}/02-detail.png",
  watchList: "watch/{lang}/01-list.png",
};

export default async function IntentoStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device: StoreDevice = params.device === "ipad" ? "ipad" : "iphone";
  const shots = Object.fromEntries(
    Object.entries(SHOT_FILES).map(([key, file]) => [key, `/store-shots/intento/${file.replace("{lang}", lang)}`]),
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
  return <IntentoStoreStrip device={device} lang={lang} shots={shots} />;
}

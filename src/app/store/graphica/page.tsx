import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezels } from "../intento/strip";
import { GraphicaStoreArt } from "./art";
import { type GDevice, type GShots, GraphicaStoreStrip } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

// 実機のスクショ（graphica の ios/Graphica/Screenshots を _store-screenshots/Graphica 経由で）をここへ写す（gitignore）
const FILES: Record<keyof GShots, string> = {
  iphoneGallery: "iphone/{lang}/01-gallery.png",
  iphoneDetail: "iphone/{lang}/02-detail.png",
  iphoneCreate: "iphone/{lang}/03-create.png",
  iphoneDetail2: "iphone/{lang}/04-detail-second.png",
  ipadGallery: "ipad/{lang}/01-gallery.png",
  ipadDetail: "ipad/{lang}/02-detail.png",
  ipadCreate: "ipad/{lang}/03-create.png",
  ipadDetail2: "ipad/{lang}/04-detail-second.png",
  duoOpenGallery: "duo-open/{lang}/01-gallery.png",
  duoOpenDetail: "duo-open/{lang}/02-detail.png",
  duoOpenDetail2: "duo-open/{lang}/04-detail-second.png",
  duoClosedGallery: "duo-closed/{lang}/01-gallery.png",
  duoClosedCreate: "duo-closed/{lang}/03-create.png",
  duoClosedDetail: "duo-closed/{lang}/02-detail.png",
  macGallery: "mac-window/{lang}/01-gallery.png",
  macDetail: "mac-window/{lang}/02-detail.png",
  visionGallery: "vision/{lang}/01-gallery.png",
  visionDetail: "vision/{lang}/02-detail.png",
};

// 端末ごとに要るスクショ。iPhone と iPad の帯は互いの画面も使う
const NEEDS: Record<GDevice | "header" | "search", string[]> = {
  iphone: ["iphone", "ipadGallery"],
  ipad: ["iphone", "ipad"],
  duoInner: ["duo", "ipadGallery"],
  mac: ["mac"],
  vision: ["vision"],
  header: ["iphone", "ipadGallery"],
  search: ["iphone"],
};

const BEZELS_JSON = path.join(process.cwd(), "public/store-bezels/duo/bezels.json");

export default async function GraphicaStorePage({ searchParams }: { searchParams: Promise<{ lang?: string; device?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const lang = params.lang === "en" ? "en" : "ja";
  const device = (params.device && params.device in NEEDS ? params.device : "iphone") as keyof typeof NEEDS;
  const shots = Object.fromEntries(
    Object.entries(FILES).map(([key, file]) => [key, `/store-shots/graphica/${file.replace("{lang}", lang)}`]),
  ) as GShots;
  const needed = Object.entries(shots).filter(([key]) => NEEDS[device].some((prefix) => key.startsWith(prefix)));
  const missing = needed.map(([, src]) => src).filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショが無い:\n${missing.join("\n")}\ngraphica の ios/Graphica/scripts/capture_screenshots.sh で撮って写す`}
      </pre>
    );
  }
  if (device === "header" || device === "search") return <GraphicaStoreArt kind={device} lang={lang} shots={shots} />;
  // 暗い地では Night Sky の枠が沈むので、FFMultiply と同じく Star White の枠を使う
  const bezels: Bezels =
    device === "duoInner" && existsSync(BEZELS_JSON) ? JSON.parse(readFileSync(BEZELS_JSON, "utf8").replaceAll("Night Sky", "Star White")) : {};
  return <GraphicaStoreStrip device={device} lang={lang} shots={shots} bezels={bezels} />;
}

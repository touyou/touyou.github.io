import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Bezel, Bezels } from "../intento/strip";

import { DuoAnnounce, type DuoApp, type Layout } from "./scene";

// 「アプリはぜんぶ iPhone Duo に対応している」の告知画像（1600×900、X / Bluesky 用）。開発サーバーでだけ開ける
export const metadata: Metadata = { robots: { index: false, follow: false } };

// 各アプリのストア画像のブランチと同じ場所に実機のスクショを写す（gitignore）。どれも日本語版
const APPS: (DuoApp & { dir: string; closedFile: string; openFile: string })[] =
  [
    {
      name: "Intento",
      dir: "intento",
      closedFile: "01-list.png",
      openFile: "01-list.png",
      closed: "",
      open: "",
    },
    {
      name: "GRAPHICA",
      dir: "graphica",
      closedFile: "01-gallery.png",
      openFile: "01-gallery.png",
      closed: "",
      open: "",
      white: true,
    },
    {
      name: "Toreta",
      dir: "toreta",
      closedFile: "02-collection.png",
      openFile: "02-collection.png",
      closed: "",
      open: "",
    },
    {
      name: "チェケラ",
      dir: "checkitout",
      closedFile: "01-play.png",
      openFile: "01-play.png",
      closed: "",
      open: "",
    },
    {
      name: "Programming Quiz",
      dir: "quizlit",
      closedFile: "01-home.png",
      openFile: "02-question.png",
      closed: "",
      open: "",
    },
    {
      name: "GRAPHICA Playground",
      dir: "graphica-playground",
      closedFile: "02-lesson.png",
      openFile: "02-lesson.png",
      closed: "",
      open: "",
      white: true,
    },
    {
      name: "FFMultiplier",
      dir: "ffmultiply",
      closedFile: "01-home.png",
      openFile: "02-game.png",
      closed: "",
      open: "",
    },
  ];

const BEZELS_JSON = path.join(
  process.cwd(),
  "public/store-bezels/duo/bezels.json",
);

export default async function DuoAnnouncePage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string; title?: string }>;
}) {
  if (process.env.NODE_ENV === "production") notFound();
  const params = await searchParams;
  const layout: Layout = params.layout === "b" ? "b" : "a";
  // title=1 は日本語、2 は英語の見出し
  const title = params.title === "2" ? 1 : 0;
  const apps = APPS.map((app) => ({
    ...app,
    closed: `/store-shots/${app.dir}/duo-closed/ja/${app.closedFile}`,
    open: `/store-shots/${app.dir}/duo-open/ja/${app.openFile}`,
  }));
  const missing = apps
    .flatMap((a) => [a.closed, a.open])
    .filter((src) => !existsSync(path.join(process.cwd(), "public", src)));
  if (missing.length > 0 || !existsSync(BEZELS_JSON)) {
    return (
      <pre data-store-missing className="p-6 text-red-600">
        {`実機のスクショか端末の枠が無い:\n${missing.join("\n")}\n各アプリの store ブランチの public/store-shots/ と public/store-bezels/duo/ から写す`}
      </pre>
    );
  }
  const raw = readFileSync(BEZELS_JSON, "utf8");
  const night: Bezels = JSON.parse(raw);
  // GRAPHICA の 2 本はストア画像と同じく Star White の枠（画面の位置は同じ）
  const white: Bezels = JSON.parse(raw.replaceAll("Night Sky", "Star White"));
  const bezelFor = (app: DuoApp, kind: "open" | "closed"): Bezel =>
    (app.white ? white : night)[kind]!;
  return (
    <DuoAnnounce
      layout={layout}
      title={title}
      apps={apps}
      bezelFor={bezelFor}
    />
  );
}

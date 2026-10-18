import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { IntentoStoreStrip } from "./strip";

// App Store のスクリーンショットの元絵。開発サーバーでだけ開ける（撮り方は strip.tsx）
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function IntentoStorePage({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  if (process.env.NODE_ENV === "production") notFound();
  return <IntentoStoreStrip lang={(await searchParams).lang === "en" ? "en" : "ja"} />;
}

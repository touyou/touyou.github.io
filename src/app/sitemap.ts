import type { MetadataRoute } from "next";

// 配信は www に寄せている（apex は www へ転送）ので、Search Console に渡す URL も www で揃える
const base = "https://www.touyou.dev";

const apps = ["tsukibyobu", "toreta", "checkitout", "ffmultiplier", "programming-quiz", "intento", "patchday"];
const bilingual = new Set(["intento", "patchday"]);

export default function sitemap(): MetadataRoute.Sitemap {
  const top: MetadataRoute.Sitemap = [
    { url: `${base}/`, priority: 1 },
    { url: `${base}/press`, priority: 0.5 },
  ];
  const lps = apps.flatMap((app) => {
    const ja = `${base}/${app}`;
    if (!bilingual.has(app)) return [{ url: ja, priority: 0.9 }];
    const en = `${base}/${app}/en`;
    const alternates = { languages: { ja, en } };
    return [
      { url: ja, priority: 0.9, alternates },
      { url: en, priority: 0.9, alternates },
    ];
  });
  return [...top, ...lps];
}

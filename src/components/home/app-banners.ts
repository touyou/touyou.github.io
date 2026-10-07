/**
 * トップページのカルーセルに並べるアプリ。並びはそのまま表示順。
 * トップページは文字を極力減らしているので、カードに出す文字はアプリ名だけにし、雰囲気は絵（AppCarousel の art）で伝える。
 * Android 版を Google Play で公開しているものは android を true にする。
 */

export type AppArt = "intento" | "toreta" | "graphica" | "playground" | "checkitout" | "quiz" | "ffmultiplier";

export type AppBanner = {
  id: AppArt;
  name: string;
  href: string;
  android?: boolean;
  status?: string;
};

export const appBanners: AppBanner[] = [
  { id: "intento", name: "Intento", href: "/intento" },
  { id: "toreta", name: "Toreta", href: "/toreta", status: "近日公開" },
  { id: "graphica", name: "GRAPHICA", href: "https://graphica.touyou.dev/app", android: true },
  { id: "playground", name: "Graphica Playground", href: "https://graphica.touyou.dev/playground" },
  { id: "checkitout", name: "チェケラ", href: "/checkitout", android: true },
  { id: "quiz", name: "Programming Quiz", href: "/programming-quiz" },
  { id: "ffmultiplier", name: "FFMultiplier", href: "/ffmultiplier" },
];

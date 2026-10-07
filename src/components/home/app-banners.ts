/**
 * トップページのカルーセルに並べるアプリ。並びはそのまま表示順。
 * トップページは文字を極力減らしているので、カードに出す文字はアプリ名だけにし、雰囲気は絵（AppCarousel の art）で伝える。
 * 対応している端末（Android など）は各アプリの紹介ページに書き、カードには出さない。
 */

export type AppArt = "intento" | "toreta" | "graphica" | "playground" | "checkitout" | "quiz" | "ffmultiplier";

export type AppBanner = {
  id: AppArt;
  name: string;
  href: string;
  status?: string;
};

export const appBanners: AppBanner[] = [
  { id: "intento", name: "Intento", href: "/intento" },
  { id: "toreta", name: "Toreta", href: "/toreta", status: "近日公開" },
  { id: "graphica", name: "GRAPHICA", href: "https://graphica.touyou.dev/app" },
  { id: "playground", name: "Graphica Playground", href: "https://graphica.touyou.dev/playground" },
  { id: "checkitout", name: "チェケラ", href: "/checkitout" },
  { id: "quiz", name: "Programming Quiz", href: "/programming-quiz" },
  { id: "ffmultiplier", name: "FFMultiplier", href: "/ffmultiplier" },
];

/**
 * トップページのカルーセルに並べるアプリ。並びはそのまま表示順。
 * 文言は各アプリの紹介ページ（または App Store の掲載文）に合わせる。
 * Android 版を公開しているものは platforms に "Android" を入れる（Google Play で公開中のものだけ）。
 */

export type AppBanner = {
  id: string;
  name: string;
  catchcopy: string;
  platforms: string[];
  href: string;
  /** バナーの地の色と文字色 */
  background: string;
  foreground: "light" | "dark";
  /** アイコン。component はサイト内で描いているアイコンを使うもの */
  icon: { kind: "image"; src: string; background?: string; offset?: [string, string] } | { kind: "component"; name: "toreta" | "intento" };
  status?: string;
};

export const appBanners: AppBanner[] = [
  {
    id: "intento",
    name: "Intento",
    catchcopy: "アプリを開かなくても使える、やることリスト。",
    platforms: ["iPhone", "iPad", "Mac", "Apple Watch", "Apple Vision Pro"],
    href: "/intento",
    background: "#F2F2F7",
    foreground: "dark",
    icon: { kind: "component", name: "intento" },
  },
  {
    id: "toreta",
    name: "Toreta",
    catchcopy: "公式カードリストを、そのままコレクション帳に。",
    platforms: ["iPhone"],
    href: "/toreta",
    background: "#2F6BF2",
    foreground: "light",
    icon: { kind: "component", name: "toreta" },
    status: "近日公開",
  },
  {
    id: "graphica",
    name: "GRAPHICA",
    catchcopy: "ことばが、動く絵になる。",
    platforms: ["iPhone", "iPad", "Mac", "Apple Vision Pro", "Android"],
    href: "https://graphica.touyou.dev/app",
    background: "#06060A",
    foreground: "light",
    icon: { kind: "image", src: "/apps/graphica.png" },
  },
  {
    id: "graphica-playground",
    name: "Graphica Playground",
    catchcopy: "言葉で描いて、学んで、使う。",
    platforms: ["iPhone", "iPad"],
    href: "https://graphica.touyou.dev/playground",
    background: "#0B0C0E",
    foreground: "light",
    icon: { kind: "image", src: "/apps/graphica-playground.png" },
  },
  {
    id: "checkitout",
    name: "チェケラ",
    catchcopy: "すべての音が楽器になる、音楽アプリ。",
    platforms: ["iPhone", "iPad", "Android"],
    href: "/checkitout",
    background: "#16161A",
    foreground: "light",
    icon: { kind: "image", src: "/apps/checkitout.png" },
  },
  {
    id: "programming-quiz",
    name: "Programming Quiz",
    catchcopy: "プログラミングの雑学を、3 択クイズで。",
    platforms: ["iPhone", "iPad"],
    href: "/programming-quiz",
    background: "#5856D6",
    foreground: "light",
    // アイコンの素材は文字が左下に寄っているので、アプリと同じく右上へずらして置く
    icon: { kind: "image", src: "/apps/programming-quiz.png", background: "#F2F2F7", offset: ["8.45%", "-5.75%"] },
  },
  {
    id: "ffmultiplier",
    name: "FFMultiplier",
    catchcopy: "16 進数の九九、覚えてみませんか？",
    platforms: ["iPhone", "iPad"],
    href: "/ffmultiplier",
    // 白い文字だとコントラストが足りないので、緑の地には黒い文字を載せる
    background: "#85BF5D",
    foreground: "dark",
    icon: { kind: "image", src: "/apps/ffmultiplier.png" },
  },
];

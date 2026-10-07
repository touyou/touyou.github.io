import { cn } from "@/lib/utils";

/**
 * アプリの数字表示（DSEG7 フォント）に似せた 7 セグメント表示。
 * Web ではフォントを読み込まず、セグメントを SVG で描く。消えているセグメントも既定ではうっすら残し、電卓の表示らしく見せる。
 * 大きさは font-size（1em が 1 文字の高さ）、色は color で決まる。
 */

// a: 上 / b: 右上 / c: 右下 / d: 下 / e: 左下 / f: 左上 / g: 中央
const SEGMENTS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abdeg",
  "3": "abcdg",
  "4": "bcfg",
  "5": "acdfg",
  "6": "acdefg",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
  A: "abcefg",
  B: "cdefg", // 7 セグメントでは 8 と区別するため小文字の b の形にする
  C: "adef",
  D: "bcdeg", // 同じく 0 と区別するため小文字の d の形
  E: "adefg",
  F: "aefg",
  "-": "g",
};

const T = 8; // セグメントの太さ

function horizontal(y: number) {
  const [x1, x2] = [10, 50];
  return `${x1},${y} ${x1 + T / 2},${y - T / 2} ${x2 - T / 2},${y - T / 2} ${x2},${y} ${x2 - T / 2},${y + T / 2} ${x1 + T / 2},${y + T / 2}`;
}

function vertical(x: number, y1: number, y2: number) {
  return `${x},${y1} ${x + T / 2},${y1 + T / 2} ${x + T / 2},${y2 - T / 2} ${x},${y2} ${x - T / 2},${y2 - T / 2} ${x - T / 2},${y1 + T / 2}`;
}

const SHAPES: Record<string, string> = {
  a: horizontal(6),
  b: vertical(54, 8, 48),
  c: vertical(54, 52, 92),
  d: horizontal(94),
  e: vertical(6, 52, 92),
  f: vertical(6, 8, 48),
  g: horizontal(50),
};

function Digit({ char, ghost }: { char: string; ghost: boolean }) {
  const lit = SEGMENTS[char] ?? "";
  return (
    <svg viewBox="0 0 60 100" className="h-[1em] w-[0.6em] shrink-0" aria-hidden>
      {Object.entries(SHAPES).map(([name, points]) => (
        <polygon key={name} points={points} fill="currentColor" opacity={lit.includes(name) ? 1 : ghost ? 0.07 : 0} />
      ))}
    </svg>
  );
}

/**
 * text を 7 セグメントで描く。digits を渡すと、その桁数になるまで左を消灯した桁で埋める（右寄せ）。
 * ghost を false にすると、消えているセグメントを描かない（キーのように 1 文字で読ませたいところ向け）。
 * 読み上げは label（省略時は text）にする。
 */
export function SevenSeg({
  text,
  digits,
  label,
  ghost = true,
  className,
}: {
  text: string;
  digits?: number;
  label?: string;
  ghost?: boolean;
  className?: string;
}) {
  const chars = text.toUpperCase().split("");
  const padded = digits && chars.length < digits ? [...Array<string>(digits - chars.length).fill(" "), ...chars] : chars;
  return (
    <span role="img" aria-label={label ?? text} className={cn("inline-flex items-center gap-[0.14em] leading-none", className)}>
      {padded.map((char, i) => (
        <Digit key={i} char={char} ghost={ghost} />
      ))}
    </span>
  );
}

/**
 * チェケラのパッドの定義。
 * アプリ（CheckItOut/Checkitout/Views/ContentView.swift）と同じく 4×4 の 16 個で、行ごとに赤・黄・緑・青の色が付く。
 * 色はアプリのパッド画像（Assets.xcassets の Redpad など）から拾った値。
 */

export type PadColor = "red" | "yellow" | "green" | "blue";

export const PAD_COLORS: Record<PadColor, string> = {
  red: "#E63C35",
  yellow: "#FAC700",
  green: "#67B62D",
  blue: "#009BDB",
};

/** パッドの中の色。押している間は明るいグレーに変わる（アプリの Selected〜pad 画像と同じ） */
export const PAD_FILL = "#151515";
export const PAD_FILL_PRESSED = "#3B3B3B";

/** アプリの背景に近い、ほぼ黒の地 */
export const APP_BACKGROUND = "#0B0B0B";

/** デモで鳴らす音の種類。どれもブラウザの中で合成し、音声ファイルは使わない */
export type Voice =
  | { kind: "kick" }
  | { kind: "snare" }
  | { kind: "hat" }
  | { kind: "clap" }
  | { kind: "bass"; frequency: number }
  | { kind: "chord"; frequencies: number[] }
  | { kind: "bleep"; frequency: number };

export type DemoPad = { index: number; color: PadColor; name: string; voice: Voice; key: string };

const ROW_COLORS: PadColor[] = ["red", "yellow", "green", "blue"];

/** キーボードで押すときのキー。行ごとに 1〜4、Q〜R、A〜F、Z〜V の 4 つずつ */
const KEY_ROWS = [
  ["1", "2", "3", "4"],
  ["q", "w", "e", "r"],
  ["a", "s", "d", "f"],
  ["z", "x", "c", "v"],
];

// どのパッドを同時に押しても濁りにくいよう、ベースとメロディはハ長調のペンタトニック（ド・レ・ミ・ソ・ラ）、和音はハ長調の中の和音にそろえる
const C2 = 65.41;
const E2 = 82.41;
const G2 = 98.0;
const A2 = 110.0;

const ROW_VOICES: { name: string; voice: Voice }[][] = [
  [
    { name: "キック", voice: { kind: "kick" } },
    { name: "スネア", voice: { kind: "snare" } },
    { name: "ハイハット", voice: { kind: "hat" } },
    { name: "クラップ", voice: { kind: "clap" } },
  ],
  [
    { name: "ベース ド", voice: { kind: "bass", frequency: C2 } },
    { name: "ベース ミ", voice: { kind: "bass", frequency: E2 } },
    { name: "ベース ソ", voice: { kind: "bass", frequency: G2 } },
    { name: "ベース ラ", voice: { kind: "bass", frequency: A2 } },
  ],
  [
    { name: "和音 C", voice: { kind: "chord", frequencies: [261.63, 329.63, 392.0] } },
    { name: "和音 Am", voice: { kind: "chord", frequencies: [220.0, 261.63, 329.63] } },
    { name: "和音 Em", voice: { kind: "chord", frequencies: [246.94, 329.63, 392.0] } },
    { name: "和音 G", voice: { kind: "chord", frequencies: [196.0, 246.94, 293.66] } },
  ],
  [
    { name: "ド", voice: { kind: "bleep", frequency: 523.25 } },
    { name: "レ", voice: { kind: "bleep", frequency: 587.33 } },
    { name: "ミ", voice: { kind: "bleep", frequency: 659.25 } },
    { name: "ソ", voice: { kind: "bleep", frequency: 783.99 } },
  ],
];

export const DEMO_PADS: DemoPad[] = ROW_VOICES.flatMap((row, r) =>
  row.map(({ name, voice }, c) => ({ index: r * 4 + c, color: ROW_COLORS[r], name, voice, key: KEY_ROWS[r][c] })),
);

/** 押されたキーに対応するパッドの番号。対応しないキーなら null */
export function padIndexForKey(key: string): number | null {
  const pad = DEMO_PADS.find((p) => p.key === key.toLowerCase());
  return pad ? pad.index : null;
}

/**
 * 「ループ」で流す 1 小節（8 分音符 8 つ）のリズム。各ステップで鳴らすパッドの番号を並べる。
 * キック（0）・スネア（1）・ハイハット（2）とベースだけにして、上でメロディを足せる余地を残す。
 */
export const LOOP_PATTERN: number[][] = [[0, 2, 4], [2], [1, 2], [2, 6], [0, 2], [0, 2, 7], [1, 2], [2]];

export const LOOP_BPM = 104;

/** 8 分音符 1 つぶんの長さ（秒） */
export function stepSeconds(bpm: number): number {
  return 60 / bpm / 2;
}

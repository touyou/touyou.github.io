/**
 * FFMultiplier のゲームの決まりごと。アプリの実装（FFMultiply リポジトリ）に合わせる。
 * - 出題: FFUtility.swift の makeProblem（0〜F の 2 つの数をランダムに選ぶ）
 * - 答え: fTimes（16 進数の大文字、先頭に 0 を付けない。0 × n は "0"）
 * - 点数: GameViewModel.swift（正解 +10、5 問続けて正解するごとに +5、上乗せは最大 +15、不正解 -5）
 * アプリの決まりを変えたら、ここも直す。
 */

export const HEX_DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"] as const;

/** 入力できる最大の桁数。F × F = E1 なので 2 桁で足りる */
export const MAX_INPUT_LENGTH = 2;

export const POINTS_ACCEPTED = 10;
export const POINTS_FAILED = -5;
const POINTS_COMBO = 5;
const MAX_COMBO_BONUS = 15;

export type Problem = { left: number; right: number };

/** 0〜15 の数を 16 進数 1 桁の文字にする */
export function hexDigit(value: number): string {
  return HEX_DIGITS[value];
}

/** 掛け算の答えを、アプリと同じ書き方の 16 進数にする（例: 10 × 7 → "46"） */
export function answerOf({ left, right }: Problem): string {
  return (left * right).toString(16).toUpperCase();
}

/** 正解したときに入る点数。combo はこの問題より前に続けて正解した数 */
export function pointsForCorrect(combo: number): number {
  return POINTS_ACCEPTED + Math.min(POINTS_COMBO * Math.floor(combo / 5), MAX_COMBO_BONUS);
}

/** 次の問題を選ぶ。random は 0 以上 1 未満を返す関数（テストで差し替える） */
export function nextProblem(previous: Problem | null, random: () => number = Math.random): Problem {
  // 同じ問題が続くと押し間違えたように見えるので、直前と同じ組み合わせは選び直す
  for (let i = 0; i < 10; i++) {
    const problem = { left: Math.floor(random() * 16), right: Math.floor(random() * 16) };
    if (!previous || problem.left !== previous.left || problem.right !== previous.right) return problem;
  }
  return { left: Math.floor(random() * 16), right: Math.floor(random() * 16) };
}

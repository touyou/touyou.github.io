import { describe, expect, it } from "vitest";

import { answerOf, hexDigit, nextProblem, pointsForCorrect } from "./hex";

describe("answerOf", () => {
  it("16 進数の大文字で返す", () => {
    expect(answerOf({ left: 10, right: 7 })).toBe("46");
    expect(answerOf({ left: 12, right: 5 })).toBe("3C");
    expect(answerOf({ left: 15, right: 15 })).toBe("E1");
  });

  it("1 桁の答えに 0 を付けない（アプリの fTimes と同じ）", () => {
    expect(answerOf({ left: 2, right: 3 })).toBe("6");
    expect(answerOf({ left: 0, right: 15 })).toBe("0");
  });
});

describe("hexDigit", () => {
  it("10 以上は A〜F になる", () => {
    expect(hexDigit(9)).toBe("9");
    expect(hexDigit(10)).toBe("A");
    expect(hexDigit(15)).toBe("F");
  });
});

describe("pointsForCorrect", () => {
  it("5 問続けて正解するごとに 5 点ずつ増え、25 点で止まる", () => {
    expect(pointsForCorrect(0)).toBe(10);
    expect(pointsForCorrect(4)).toBe(10);
    expect(pointsForCorrect(5)).toBe(15);
    expect(pointsForCorrect(10)).toBe(20);
    expect(pointsForCorrect(15)).toBe(25);
    expect(pointsForCorrect(100)).toBe(25);
  });
});

describe("nextProblem", () => {
  it("直前と同じ問題は選び直す", () => {
    const values = [0.7, 0.5, 0.7, 0.5, 0.1, 0.2];
    let i = 0;
    const random = () => values[i++];
    const previous = { left: 11, right: 8 };
    expect(nextProblem(previous, random)).toEqual({ left: 1, right: 3 });
  });

  it("0〜15 の範囲で選ぶ", () => {
    expect(nextProblem(null, () => 0)).toEqual({ left: 0, right: 0 });
    expect(nextProblem(null, () => 0.9999)).toEqual({ left: 15, right: 15 });
  });
});

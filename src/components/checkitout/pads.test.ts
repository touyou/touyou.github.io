import { describe, expect, it } from "vitest";

import { DEMO_PADS, LOOP_PATTERN, padIndexForKey, stepSeconds } from "./pads";

describe("DEMO_PADS", () => {
  it("アプリと同じく 16 個で、行ごとに赤・黄・緑・青", () => {
    expect(DEMO_PADS).toHaveLength(16);
    expect(DEMO_PADS.map((p) => p.color)).toEqual([
      ...Array(4).fill("red"),
      ...Array(4).fill("yellow"),
      ...Array(4).fill("green"),
      ...Array(4).fill("blue"),
    ]);
    expect(DEMO_PADS.map((p) => p.index)).toEqual([...Array(16).keys()]);
  });

  it("キーの割り当てが重ならない", () => {
    expect(new Set(DEMO_PADS.map((p) => p.key)).size).toBe(16);
  });
});

describe("padIndexForKey", () => {
  it("行ごとのキーをパッドの番号に変える", () => {
    expect(padIndexForKey("1")).toBe(0);
    expect(padIndexForKey("4")).toBe(3);
    expect(padIndexForKey("q")).toBe(4);
    expect(padIndexForKey("F")).toBe(11);
    expect(padIndexForKey("v")).toBe(15);
  });

  it("対応しないキーは null", () => {
    expect(padIndexForKey("5")).toBeNull();
    expect(padIndexForKey("Enter")).toBeNull();
  });
});

describe("LOOP_PATTERN", () => {
  it("8 ステップで、存在するパッドだけを鳴らす", () => {
    expect(LOOP_PATTERN).toHaveLength(8);
    for (const step of LOOP_PATTERN) {
      for (const index of step) expect(DEMO_PADS[index]).toBeDefined();
    }
  });
});

describe("stepSeconds", () => {
  it("120 BPM の 8 分音符は 0.25 秒", () => {
    expect(stepSeconds(120)).toBeCloseTo(0.25);
  });
});

import { describe, expect, it } from "vitest";
import { appStoreLink } from "./app-store";

describe("appStoreLink", () => {
  it("pt / ct / mt を付ける", () => {
    expect(appStoreLink("https://apps.apple.com/jp/app/id6826440511", "lp-tsukibyobu")).toBe(
      "https://apps.apple.com/jp/app/id6826440511?pt=118141122&ct=lp-tsukibyobu&mt=8",
    );
  });

  it("platform などの追加の引数を残す", () => {
    expect(
      appStoreLink("https://apps.apple.com/jp/app/id6831397385", "lp-patchday-mac", { platform: "mac" }),
    ).toBe("https://apps.apple.com/jp/app/id6831397385?platform=mac&pt=118141122&ct=lp-patchday-mac&mt=8");
  });
});

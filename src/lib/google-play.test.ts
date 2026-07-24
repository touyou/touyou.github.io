import { describe, it, expect, vi, afterEach } from "vitest";
import { parseGooglePlayApp, fetchGooglePlayApps } from "./google-play";

// Minimal shape of a real Play store page head (verified 2026-07 via curl)
function playPageHtml(title: string, image: string) {
  return `<!doctype html><html><head>
<meta property="og:url" content="https://play.google.com/store/apps/details?id=dev.example&amp;hl=ja">
<meta property="og:title" content="${title}">
<meta property="og:image" content="${image}">
</head><body></body></html>`;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("parseGooglePlayApp", () => {
  it("extracts name and icon from OGP tags", () => {
    const html = playPageHtml(
      "Graphica - Words to Shaders - Google Play のアプリ",
      "https://play-lh.googleusercontent.com/abc123"
    );

    expect(parseGooglePlayApp(html)).toEqual({
      name: "Graphica - Words to Shaders",
      iconUrl: "https://play-lh.googleusercontent.com/abc123",
    });
  });

  it("strips the English store suffix too", () => {
    const html = playPageHtml(
      "チェケラ - Apps on Google Play",
      "https://play-lh.googleusercontent.com/def456"
    );

    expect(parseGooglePlayApp(html)?.name).toBe("チェケラ");
  });

  it("decodes HTML entities in the title", () => {
    const html = playPageHtml(
      "Foo &amp; Bar - Google Play のアプリ",
      "https://play-lh.googleusercontent.com/xyz"
    );

    expect(parseGooglePlayApp(html)?.name).toBe("Foo & Bar");
  });

  it("returns null when OGP tags are missing", () => {
    expect(parseGooglePlayApp("<html><head></head></html>")).toBeNull();
  });
});

describe("fetchGooglePlayApps", () => {
  it("maps configured packages to AppStoreApp with the android platform", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: () =>
          Promise.resolve(
            playPageHtml(
              "Graphica - Words to Shaders - Google Play のアプリ",
              "https://play-lh.googleusercontent.com/abc123"
            )
          ),
      })
    );

    const apps = await fetchGooglePlayApps();

    expect(apps.length).toBeGreaterThan(0);
    for (const app of apps) {
      expect(app.platform).toBe("android");
      expect(app.name).toBe("Graphica - Words to Shaders");
      expect(app.iconUrl).toBe("https://play-lh.googleusercontent.com/abc123");
      expect(app.url).toContain("https://play.google.com/store/apps/details?id=");
      expect(app.releaseDate).not.toBe("");
    }
  });

  it("drops apps whose page fails to fetch instead of failing the whole list", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: () =>
            Promise.resolve(
              playPageHtml(
                "Graphica - Words to Shaders - Google Play のアプリ",
                "https://play-lh.googleusercontent.com/abc123"
              )
            ),
        })
        .mockResolvedValue({ ok: false, status: 404, text: () => Promise.resolve("") })
    );

    const apps = await fetchGooglePlayApps();

    expect(apps.length).toBe(1);
  });

  it("returns an empty array when every fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error"))
    );

    expect(await fetchGooglePlayApps()).toEqual([]);
  });
});

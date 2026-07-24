import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchAppStoreApps } from "./app-store";

function mockFetchOnce(body: unknown, ok = true, status = 200) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(body),
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchAppStoreApps", () => {
  it("maps software results to AppStoreApp and drops the artist entry", async () => {
    mockFetchOnce({
      results: [
        { wrapperType: "artist", artistName: "Yosuke Fujii" },
        {
          wrapperType: "software",
          trackName: "FFMultiplier",
          trackViewUrl: "https://apps.apple.com/jp/app/ffmultiplier/id1",
          artworkUrl512: "https://example.com/icon1.png",
          version: "2.0.0",
          currentVersionReleaseDate: "2026-07-06T18:49:14Z",
        },
      ],
    });

    const apps = await fetchAppStoreApps();

    expect(apps).toEqual([
      {
        name: "FFMultiplier",
        url: "https://apps.apple.com/jp/app/ffmultiplier/id1",
        iconUrl: "https://example.com/icon1.png",
        version: "2.0.0",
        releaseDate: "2026-07-06T18:49:14Z",
        platform: "ios",
      },
    ]);
  });

  it("sorts apps by release date, newest first", async () => {
    mockFetchOnce({
      results: [
        {
          wrapperType: "software",
          trackName: "Older",
          trackViewUrl: "https://apps.apple.com/jp/app/older/id1",
          artworkUrl512: "https://example.com/older.png",
          currentVersionReleaseDate: "2020-01-01T00:00:00Z",
        },
        {
          wrapperType: "software",
          trackName: "Newer",
          trackViewUrl: "https://apps.apple.com/jp/app/newer/id2",
          artworkUrl512: "https://example.com/newer.png",
          currentVersionReleaseDate: "2026-01-01T00:00:00Z",
        },
      ],
    });

    const apps = await fetchAppStoreApps();

    expect(apps.map((app) => app.name)).toEqual(["Newer", "Older"]);
  });

  it("drops software entries missing a name, url, or icon", async () => {
    mockFetchOnce({
      results: [
        {
          wrapperType: "software",
          trackName: "",
          trackViewUrl: "https://apps.apple.com/jp/app/noname/id1",
          artworkUrl512: "https://example.com/icon.png",
        },
        {
          wrapperType: "software",
          trackName: "Complete App",
          trackViewUrl: "https://apps.apple.com/jp/app/complete/id2",
          artworkUrl512: "https://example.com/icon2.png",
        },
      ],
    });

    const apps = await fetchAppStoreApps();

    expect(apps.map((app) => app.name)).toEqual(["Complete App"]);
  });

  it("returns an empty array when the response is not ok", async () => {
    mockFetchOnce({}, false, 500);

    expect(await fetchAppStoreApps()).toEqual([]);
  });

  it("returns an empty array when the fetch throws", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("network error"))
    );

    expect(await fetchAppStoreApps()).toEqual([]);
  });
});

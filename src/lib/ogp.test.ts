import { describe, it, expect, vi } from "vitest";

const ogsMock = vi.hoisted(() => vi.fn());
vi.mock("open-graph-scraper", () => ({ default: ogsMock }));

import { fetchOGP, githubCardImage } from "./ogp";

describe("githubCardImage", () => {
  const day = new Date("2026-11-03T12:00:00Z");

  it("builds the card image for a repository URL", () => {
    expect(githubCardImage("https://github.com/touyou/skills", day)).toBe(
      "https://opengraph.githubassets.com/20261103/touyou/skills",
    );
    expect(githubCardImage("https://github.com/touyou/flutter_intents/", day)).toBe(
      "https://opengraph.githubassets.com/20261103/touyou/flutter_intents",
    );
  });

  it("returns null for non-repository URLs", () => {
    expect(githubCardImage("https://github.com/touyou", day)).toBeNull();
    expect(githubCardImage("https://github.com/touyou/skills/pull/40", day)).toBeNull();
    expect(githubCardImage("https://example.com/touyou/skills", day)).toBeNull();
  });
});

describe("fetchOGP for GitHub repositories", () => {
  it("uses the cached text and a built image without scraping", async () => {
    const data = await fetchOGP("https://github.com/touyou/skills");
    expect(ogsMock).not.toHaveBeenCalled();
    expect(data.title).toContain("touyou/skills");
    expect(data.image).toMatch(/^https:\/\/opengraph\.githubassets\.com\/\d{8}\/touyou\/skills$/);
  });

  it("keeps a repository's own social image", async () => {
    const data = await fetchOGP("https://github.com/touyou/NeumorphismTab");
    expect(ogsMock).not.toHaveBeenCalled();
    expect(data.image).toContain("repository-images.githubusercontent.com");
  });
});

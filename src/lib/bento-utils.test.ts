import { describe, it, expect } from "vitest";
import {
  isYouTubeUrl,
  extractYouTubeVideoId,
  getFaviconUrl,
  platformColors,
  cardBase,
} from "./bento-utils";

describe("isYouTubeUrl", () => {
  it("returns true for youtube.com URLs", () => {
    expect(isYouTubeUrl("https://www.youtube.com/watch?v=abc123")).toBe(true);
    expect(isYouTubeUrl("https://youtube.com/watch?v=abc123")).toBe(true);
    expect(isYouTubeUrl("http://youtube.com/embed/abc123")).toBe(true);
  });

  it("returns true for youtu.be URLs", () => {
    expect(isYouTubeUrl("https://youtu.be/abc123")).toBe(true);
    expect(isYouTubeUrl("http://youtu.be/abc123")).toBe(true);
  });

  it("returns false for non-YouTube URLs", () => {
    expect(isYouTubeUrl("https://vimeo.com/123456")).toBe(false);
    expect(isYouTubeUrl("https://example.com")).toBe(false);
    expect(isYouTubeUrl("https://github.com/youtube")).toBe(false);
  });
});

describe("extractYouTubeVideoId", () => {
  it("extracts video ID from youtube.com/watch URLs", () => {
    expect(
      extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
    expect(
      extractYouTubeVideoId("https://youtube.com/watch?v=abc123def45")
    ).toBe("abc123def45");
  });

  it("extracts video ID from youtube.com/watch URLs with extra params", () => {
    expect(
      extractYouTubeVideoId(
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLtest"
      )
    ).toBe("dQw4w9WgXcQ");
    expect(
      extractYouTubeVideoId(
        "https://www.youtube.com/watch?t=10&v=dQw4w9WgXcQ"
      )
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtube.com/embed URLs", () => {
    expect(
      extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtu.be URLs", () => {
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(extractYouTubeVideoId("http://youtu.be/abc123def45")).toBe(
      "abc123def45"
    );
  });

  it("returns null for invalid URLs", () => {
    expect(extractYouTubeVideoId("https://vimeo.com/123456")).toBeNull();
    expect(extractYouTubeVideoId("https://example.com")).toBeNull();
    expect(extractYouTubeVideoId("not a url")).toBeNull();
  });

  it("returns null for URLs with short video ID", () => {
    // Video IDs must be exactly 11 characters
    expect(extractYouTubeVideoId("https://youtu.be/short")).toBeNull();
    expect(extractYouTubeVideoId("https://youtube.com/watch?v=abc")).toBeNull();
  });
});

describe("getFaviconUrl", () => {
  it("returns Google favicon URL for valid URLs", () => {
    expect(getFaviconUrl("https://github.com/user/repo")).toBe(
      "https://www.google.com/s2/favicons?domain=github.com&sz=64"
    );
    expect(getFaviconUrl("https://twitter.com/user")).toBe(
      "https://www.google.com/s2/favicons?domain=twitter.com&sz=64"
    );
  });

  it("handles URLs with subdomains", () => {
    expect(getFaviconUrl("https://www.example.com/page")).toBe(
      "https://www.google.com/s2/favicons?domain=www.example.com&sz=64"
    );
  });

  it("returns empty string for invalid URLs", () => {
    expect(getFaviconUrl("not a url")).toBe("");
    expect(getFaviconUrl("")).toBe("");
  });
});

describe("platformColors", () => {
  it("has colors for all social platforms", () => {
    expect(platformColors.twitter).toBeDefined();
    expect(platformColors.github).toBeDefined();
    expect(platformColors.youtube).toBeDefined();
    expect(platformColors.linkedin).toBeDefined();
    expect(platformColors.instagram).toBeDefined();
    expect(platformColors.bluesky).toBeDefined();
  });

  it("returns hover classes", () => {
    expect(platformColors.twitter).toContain("hover:");
    expect(platformColors.github).toContain("hover:");
    expect(platformColors.youtube).toContain("hover:");
  });
});

describe("cardBase", () => {
  it("contains essential card styles", () => {
    expect(cardBase).toContain("bg-white");
    expect(cardBase).toContain("rounded-2xl");
    expect(cardBase).toContain("shadow-");
    expect(cardBase).toContain("transition");
  });
});

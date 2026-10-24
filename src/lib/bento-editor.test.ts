import { describe, it, expect } from "vitest";
import type { BentoData } from "./bento-types";
import {
  moveLink,
  moveYouTubeVideo,
  updateYouTubeVideoFields,
} from "./bento-editor";

const link = (title: string) => ({
  url: `https://${title}.example`,
  title,
  cardType: "simple" as const,
});
const video = (title: string) => ({ url: "", title, videoId: "" });

function makeData(): BentoData {
  return {
    sections: [
      { id: "a", title: "A", links: [link("a0"), link("a1"), link("a2")] },
      { id: "b", title: "B", links: [link("b0")] },
    ],
    youtubeSections: [
      { id: "y", title: "Y", videos: [video("y0"), video("y1")] },
      { id: "z", title: "Z", videos: [] },
    ],
  } as BentoData;
}

const titles = (data: BentoData, id: string) =>
  data.sections.find((s) => s.id === id)!.links.map((l) => l.title);
const videoTitles = (data: BentoData, id: string) =>
  data.youtubeSections!.find((s) => s.id === id)!.videos.map((v) => v.title);

describe("moveLink", () => {
  it("reorders within a section", () => {
    const next = moveLink(
      makeData(),
      { sectionId: "a", index: 0 },
      { sectionId: "a", index: 2 },
    );
    expect(titles(next, "a")).toEqual(["a1", "a2", "a0"]);
  });

  it("moves to a position in another section", () => {
    const next = moveLink(
      makeData(),
      { sectionId: "a", index: 1 },
      { sectionId: "b", index: 0 },
    );
    expect(titles(next, "a")).toEqual(["a0", "a2"]);
    expect(titles(next, "b")).toEqual(["a1", "b0"]);
  });

  it("appends when no target index is given", () => {
    const next = moveLink(
      makeData(),
      { sectionId: "a", index: 0 },
      { sectionId: "b" },
    );
    expect(titles(next, "b")).toEqual(["b0", "a0"]);
  });

  it("returns the same object when nothing moves", () => {
    const data = makeData();
    expect(
      moveLink(
        data,
        { sectionId: "a", index: 1 },
        { sectionId: "a", index: 1 },
      ),
    ).toBe(data);
    expect(
      moveLink(data, { sectionId: "a", index: 9 }, { sectionId: "b" }),
    ).toBe(data);
  });

  it("does not mutate the input", () => {
    const data = makeData();
    moveLink(data, { sectionId: "a", index: 0 }, { sectionId: "b", index: 0 });
    expect(data).toEqual(makeData());
  });
});

describe("moveYouTubeVideo", () => {
  it("reorders within a section", () => {
    const next = moveYouTubeVideo(
      makeData(),
      { sectionId: "y", index: 1 },
      { sectionId: "y", index: 0 },
    );
    expect(videoTitles(next, "y")).toEqual(["y1", "y0"]);
  });

  it("moves into an empty section", () => {
    const next = moveYouTubeVideo(
      makeData(),
      { sectionId: "y", index: 0 },
      { sectionId: "z" },
    );
    expect(videoTitles(next, "y")).toEqual(["y1"]);
    expect(videoTitles(next, "z")).toEqual(["y0"]);
  });
});

describe("updateYouTubeVideoFields", () => {
  it("fills in the video ID when the URL changes", () => {
    const next = updateYouTubeVideoFields(video("v"), {
      url: "https://youtu.be/dQw4w9WgXcQ",
    });
    expect(next.videoId).toBe("dQw4w9WgXcQ");
  });

  it("keeps the previous video ID when the URL has none", () => {
    const next = updateYouTubeVideoFields(
      { ...video("v"), videoId: "dQw4w9WgXcQ" },
      { url: "https://example.com" },
    );
    expect(next.videoId).toBe("dQw4w9WgXcQ");
  });
});

// Pure state updates for the localhost-only Bento editor (/bento/edit)

import type { BentoData, BentoLink, YouTubeVideoData } from "./bento-types";
import { extractYouTubeVideoId } from "./bento-utils";

export interface ItemPosition {
  sectionId: string;
  index: number;
}

// Omitting `index` appends to the end of the target section
export interface ItemDestination {
  sectionId: string;
  index?: number;
}

// Removes the item first, then inserts it, so a same-section index is the
// position after removal (the same as Array.splice twice).
function moveBetween<S extends { id: string }, T>(
  sections: S[],
  items: (section: S) => T[],
  withItems: (section: S, items: T[]) => S,
  from: ItemPosition,
  to: ItemDestination,
): S[] {
  if (from.sectionId === to.sectionId && from.index === to.index)
    return sections;
  const source = sections.find((s) => s.id === from.sectionId);
  if (!source || from.index < 0 || from.index >= items(source).length)
    return sections;
  const moved = items(source)[from.index];

  const removed = sections.map((s) =>
    s.id === from.sectionId
      ? withItems(
          s,
          items(s).filter((_, i) => i !== from.index),
        )
      : s,
  );
  return removed.map((s) => {
    if (s.id !== to.sectionId) return s;
    const next = [...items(s)];
    next.splice(to.index ?? next.length, 0, moved);
    return withItems(s, next);
  });
}

export function moveLink(
  data: BentoData,
  from: ItemPosition,
  to: ItemDestination,
): BentoData {
  const sections = moveBetween(
    data.sections,
    (s) => s.links,
    (s, links) => ({ ...s, links }),
    from,
    to,
  );
  return sections === data.sections ? data : { ...data, sections };
}

export function moveYouTubeVideo(
  data: BentoData,
  from: ItemPosition,
  to: ItemDestination,
): BentoData {
  const current = data.youtubeSections || [];
  const youtubeSections = moveBetween(
    current,
    (s) => s.videos,
    (s, videos) => ({ ...s, videos }),
    from,
    to,
  );
  return youtubeSections === current ? data : { ...data, youtubeSections };
}

// A pasted URL fills in the video ID; a URL without one leaves the ID as it was
export function updateYouTubeVideoFields(
  video: YouTubeVideoData,
  updates: Partial<YouTubeVideoData>,
): YouTubeVideoData {
  const next = { ...video, ...updates };
  const videoId = updates.url ? extractYouTubeVideoId(updates.url) : null;
  return videoId ? { ...next, videoId } : next;
}

export const newLink = (): BentoLink => ({
  url: "https://example.com",
  title: "New Link",
  cardType: "simple",
});

export const newYouTubeVideo = (): YouTubeVideoData => ({
  url: "https://www.youtube.com/watch?v=",
  title: "New Video",
  videoId: "",
});

import Parser from "rss-parser";

export interface SpeakerDeckTalk {
  title: string;
  url: string;
  pubDate: string;
  thumbnail?: string;
  embedId?: string;
}

type CustomItem = {
  "media:thumbnail"?: { $?: { url?: string } };
  enclosure?: { url?: string; type?: string };
};

const parser: Parser<Record<string, unknown>, CustomItem> = new Parser({
  customFields: {
    item: [
      ["media:thumbnail", "media:thumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

const SPEAKERDECK_FEED_URL = "https://speakerdeck.com/touyou.atom";

// Extract embed ID from SpeakerDeck URL
function extractEmbedId(url: string): string | undefined {
  // URL format: https://speakerdeck.com/touyou/talk-slug
  const match = url.match(/speakerdeck\.com\/[^/]+\/([^/?#]+)/);
  return match?.[1];
}

export async function fetchSpeakerDeckTalks(): Promise<SpeakerDeckTalk[]> {
  try {
    const feed = await parser.parseURL(SPEAKERDECK_FEED_URL);

    const talks: SpeakerDeckTalk[] = feed.items.map((item) => {
      // Extract thumbnail from media:thumbnail or enclosure
      let thumbnail: string | undefined;
      const mediaThumbnail = item["media:thumbnail"];
      if (mediaThumbnail?.$?.url) {
        thumbnail = mediaThumbnail.$.url;
      }
      const enclosure = item.enclosure;
      if (!thumbnail && enclosure?.url && enclosure.type?.startsWith("image/")) {
        thumbnail = enclosure.url;
      }

      const url = item.link || "";
      const embedId = extractEmbedId(url);

      return {
        title: item.title || "Untitled",
        url,
        pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
        thumbnail,
        embedId,
      };
    });

    // Sort by date descending (newest first)
    talks.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return talks.length > 0 ? talks : getFallbackSpeakerDeckTalks();
  } catch (error) {
    console.error("Failed to fetch SpeakerDeck talks:", error);
    return getFallbackSpeakerDeckTalks();
  }
}

// Fallback: Return empty array or cached data
export function getFallbackSpeakerDeckTalks(): SpeakerDeckTalk[] {
  // Will be populated with cached data later
  return [];
}

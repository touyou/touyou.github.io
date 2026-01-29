import Parser from "rss-parser";

export interface SpeakerDeckTalk {
  title: string;
  url: string;
  pubDate: string;
  thumbnail?: string;
  embedId?: string;
  embedUrl?: string;
}

interface OEmbedResponse {
  html?: string;
  title?: string;
  thumbnail_url?: string;
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

// Extract embed URL from oEmbed HTML response
function extractEmbedUrlFromHtml(html: string): string | undefined {
  // Extract src from iframe: <iframe ... src="https://speakerdeck.com/player/..." ...>
  const match = html.match(/src="(https:\/\/speakerdeck\.com\/player\/[^"]+)"/);
  return match?.[1];
}

// Fetch oEmbed data for a SpeakerDeck talk
async function fetchOEmbed(url: string): Promise<OEmbedResponse | null> {
  try {
    const oembedUrl = `https://speakerdeck.com/oembed.json?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl, {
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 86400 } // Cache for 24 hours
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
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

    // Fetch oEmbed data for first 4 talks to get embed URLs
    const talksWithEmbed = await Promise.all(
      talks.slice(0, 4).map(async (talk) => {
        const oembed = await fetchOEmbed(talk.url);
        if (oembed?.html) {
          talk.embedUrl = extractEmbedUrlFromHtml(oembed.html);
          if (oembed.thumbnail_url && !talk.thumbnail) {
            talk.thumbnail = oembed.thumbnail_url;
          }
        }
        return talk;
      })
    );

    // Combine with remaining talks
    const result = [...talksWithEmbed, ...talks.slice(4)];

    return result.length > 0 ? result : getFallbackSpeakerDeckTalks();
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

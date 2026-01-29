import ogs from "open-graph-scraper";
import type { OGPData } from "./bento-types";

// Import pre-built OGP cache as fallback
let ogpCacheFile: Record<string, OGPData> = {};
try {
  // Dynamic import for the cached data (generated at build time)
  ogpCacheFile = require("@/data/ogp-cache.json");
} catch {
  // Cache file may not exist yet
}

// Runtime cache for OGP results
const ogpCache = new Map<string, OGPData>();

// Extract YouTube video ID from various URL formats
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Fetch YouTube data using oEmbed API (no API key required)
async function fetchYouTubeOEmbed(url: string): Promise<OGPData | null> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, {
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`oEmbed request failed: ${response.status}`);
    }

    const data = await response.json();

    // Use higher quality thumbnail by constructing URL directly
    // oEmbed returns hqdefault (480x360), we can try maxresdefault first
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      title: data.title || "",
      image: thumbnailUrl,
      description: data.author_name ? `by ${data.author_name}` : undefined,
    };
  } catch (error) {
    console.error(`Failed to fetch YouTube oEmbed for ${url}:`, error);
    return null;
  }
}

// Check if URL is YouTube
function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export async function fetchOGP(url: string): Promise<OGPData> {
  // Check runtime cache first
  if (ogpCache.has(url)) {
    return ogpCache.get(url)!;
  }

  // Use YouTube oEmbed API for YouTube URLs
  if (isYouTubeUrl(url)) {
    const youtubeData = await fetchYouTubeOEmbed(url);
    if (youtubeData && youtubeData.title) {
      ogpCache.set(url, youtubeData);
      return youtubeData;
    }

    // Fallback to cache if oEmbed fails
    if (ogpCacheFile[url]) {
      console.log(`Using cached OGP data for YouTube: ${url}`);
      return ogpCacheFile[url];
    }
  }

  try {
    const { result } = await ogs({
      url,
      timeout: 5000,
      fetchOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    });

    const ogpData: OGPData = {
      title: result.ogTitle || result.twitterTitle || "",
      image:
        result.ogImage?.[0]?.url ||
        result.twitterImage?.[0]?.url ||
        null,
      description: result.ogDescription || result.twitterDescription,
    };

    // Cache the result
    ogpCache.set(url, ogpData);

    return ogpData;
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);

    // Use pre-built cache as fallback
    if (ogpCacheFile[url]) {
      console.log(`Using cached OGP data for ${url}`);
      return ogpCacheFile[url];
    }

    // Return empty fallback data
    return {
      title: "",
      image: null,
    };
  }
}

export async function fetchMultipleOGP(
  urls: string[]
): Promise<Map<string, OGPData>> {
  const results = new Map<string, OGPData>();

  // Fetch all OGP data in parallel with some rate limiting
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (url) => {
        const ogp = await fetchOGP(url);
        return { url, ogp };
      })
    );
    batchResults.forEach(({ url, ogp }) => results.set(url, ogp));
  }

  return results;
}

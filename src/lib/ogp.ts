import ogs from "open-graph-scraper";
import type { OGPData } from "./bento-types";

// Cache OGP results to avoid refetching
const ogpCache = new Map<string, OGPData>();

export async function fetchOGP(url: string): Promise<OGPData> {
  // Check cache first
  if (ogpCache.has(url)) {
    return ogpCache.get(url)!;
  }

  try {
    const { result } = await ogs({
      url,
      timeout: 5000,
      fetchOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; OGPFetcher/1.0; +https://touyou.dev)",
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
    // Return fallback data
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

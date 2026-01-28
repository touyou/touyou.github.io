/**
 * OGP Cache Script
 * Run with: npx tsx scripts/cache-ogp.ts
 *
 * Pre-fetches OGP data for all URLs in bento-links.json
 * and saves them to src/data/ogp-cache.json
 */

import ogs from "open-graph-scraper";
import * as fs from "fs";
import * as path from "path";

interface OGPData {
  title: string;
  image: string | null;
  description?: string;
}

interface BentoLink {
  url: string;
  cardType: string;
}

interface BentoData {
  sections: { links: BentoLink[] }[];
}

async function fetchOGP(url: string): Promise<OGPData> {
  try {
    const { result } = await ogs({
      url,
      timeout: 10000,
      fetchOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      },
    });

    return {
      title: result.ogTitle || result.twitterTitle || "",
      image:
        result.ogImage?.[0]?.url ||
        result.twitterImage?.[0]?.url ||
        null,
      description: result.ogDescription || result.twitterDescription,
    };
  } catch (error) {
    console.error(`Failed to fetch OGP for ${url}:`, error);
    return {
      title: "",
      image: null,
    };
  }
}

async function main() {
  const bentoDataPath = path.join(process.cwd(), "src/data/bento-links.json");
  const cachePath = path.join(process.cwd(), "src/data/ogp-cache.json");

  const bentoData: BentoData = JSON.parse(fs.readFileSync(bentoDataPath, "utf-8"));

  // Collect all OGP URLs
  const ogpUrls = bentoData.sections
    .flatMap((section) => section.links)
    .filter((link) => link.cardType === "ogp")
    .map((link) => link.url);

  console.log(`Fetching OGP data for ${ogpUrls.length} URLs...`);

  const cache: Record<string, OGPData> = {};

  // Fetch with rate limiting
  for (let i = 0; i < ogpUrls.length; i++) {
    const url = ogpUrls[i];
    console.log(`[${i + 1}/${ogpUrls.length}] Fetching: ${url}`);

    const ogpData = await fetchOGP(url);
    cache[url] = ogpData;

    // Rate limit: wait 500ms between requests
    if (i < ogpUrls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Write cache
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`\nCache saved to ${cachePath}`);
  console.log(`Total entries: ${Object.keys(cache).length}`);
}

main().catch(console.error);

/**
 * OGP Cache Script
 * Run with: pnpm tsx scripts/cache-ogp.ts
 *
 * Pre-fetches OGP data for all URLs in bento-links.json and hatena-blog-posts.json
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

interface BlogPostsData {
  posts: { url: string; pubDate: string }[];
}

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

// Check if URL is YouTube
function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Fetch YouTube data using oEmbed API (no API key required)
async function fetchYouTubeOEmbed(url: string): Promise<OGPData> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return { title: "", image: null };
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    const response = await fetch(oembedUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`oEmbed request failed: ${response.status}`);
    }

    const data = await response.json();

    // Use higher quality thumbnail by constructing URL directly
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

    return {
      title: data.title || "",
      image: thumbnailUrl,
      description: data.author_name ? `by ${data.author_name}` : undefined,
    };
  } catch (error) {
    console.error(`Failed to fetch YouTube oEmbed for ${url}:`, error);
    return { title: "", image: null };
  }
}

async function fetchOGP(url: string): Promise<OGPData> {
  // Use YouTube oEmbed API for YouTube URLs
  if (isYouTubeUrl(url)) {
    return fetchYouTubeOEmbed(url);
  }

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
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || null,
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
  const blogPostsPath = path.join(
    process.cwd(),
    "src/data/hatena-blog-posts.json"
  );
  const cachePath = path.join(process.cwd(), "src/data/ogp-cache.json");

  // Load existing cache to preserve entries
  let existingCache: Record<string, OGPData> = {};
  if (fs.existsSync(cachePath)) {
    existingCache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
  }

  const bentoData: BentoData = JSON.parse(
    fs.readFileSync(bentoDataPath, "utf-8")
  );

  // Collect all OGP URLs from bento-links.json
  const ogpUrls = bentoData.sections
    .flatMap((section) => section.links)
    .filter((link) => link.cardType === "ogp")
    .map((link) => link.url);

  // Add blog post URLs from hatena-blog-posts.json
  if (fs.existsSync(blogPostsPath)) {
    const blogPosts: BlogPostsData = JSON.parse(
      fs.readFileSync(blogPostsPath, "utf-8")
    );
    const blogUrls = blogPosts.posts.map((post) => post.url);
    ogpUrls.push(...blogUrls);
  }

  // Remove duplicates
  const uniqueUrls = [...new Set(ogpUrls)];

  console.log(`Fetching OGP data for ${uniqueUrls.length} URLs...`);

  const cache: Record<string, OGPData> = { ...existingCache };

  // Fetch with rate limiting
  for (let i = 0; i < uniqueUrls.length; i++) {
    const url = uniqueUrls[i];
    console.log(`[${i + 1}/${uniqueUrls.length}] Fetching: ${url}`);

    const ogpData = await fetchOGP(url);

    // Only update if we got valid data or entry doesn't exist
    if (ogpData.title || ogpData.image || !cache[url]) {
      cache[url] = ogpData;
    }

    // Rate limit: wait 500ms between requests
    if (i < uniqueUrls.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  // Write cache
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + "\n");
  console.log(`\nCache saved to ${cachePath}`);
  console.log(`Total entries: ${Object.keys(cache).length}`);
}

main().catch(console.error);

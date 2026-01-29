import Parser from "rss-parser";
import bentoLinks from "@/data/bento-links.json";
import ogpCache from "@/data/ogp-cache.json";

export interface BlogPost {
  title: string;
  url: string;
  pubDate: string;
  thumbnail?: string;
}

type CustomItem = {
  enclosure?: { url?: string; type?: string };
  "content:encoded"?: string;
};

const parser: Parser<Record<string, unknown>, CustomItem> = new Parser({
  customFields: {
    item: [
      ["enclosure", "enclosure"],
      ["content:encoded", "content:encoded"],
    ],
  },
});

const BLOG_FEED_URL = "https://goodpatch-tech.hatenablog.com/rss";
const AUTHOR_CATEGORY = "touyou";
const HATENA_BLOG_DOMAIN = "goodpatch-tech.hatenablog.com";

export async function fetchHatenaBlogPosts(): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL(BLOG_FEED_URL);

    const posts: BlogPost[] = feed.items
      .filter((item) => {
        // Filter by author/category in URL or categories
        const hasAuthorCategory =
          item.link?.includes(`/category/${AUTHOR_CATEGORY}`) ||
          item.categories?.some(
            (cat) => cat.toLowerCase() === AUTHOR_CATEGORY.toLowerCase()
          );
        return hasAuthorCategory;
      })
      .map((item) => {
        // Extract thumbnail from enclosure or content
        let thumbnail: string | undefined;
        const enclosure = item.enclosure;
        if (enclosure?.url && enclosure.type?.startsWith("image/")) {
          thumbnail = enclosure.url;
        }
        // Try to extract from content:encoded
        if (!thumbnail && item["content:encoded"]) {
          const content = item["content:encoded"];
          const imgMatch = content.match(/<img[^>]+src="([^"]+)"/);
          if (imgMatch) {
            thumbnail = imgMatch[1];
          }
        }

        return {
          title: item.title || "Untitled",
          url: item.link || "",
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          thumbnail,
        };
      });

    // If RSS returned posts, merge with fallback to get full list
    if (posts.length > 0) {
      const fallback = getFallbackBlogPosts();
      const rssUrls = new Set(posts.map((p) => p.url));
      // Add fallback posts that aren't in RSS
      for (const post of fallback) {
        if (!rssUrls.has(post.url)) {
          posts.push(post);
        }
      }
    }

    // Sort by date descending
    posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return posts.length > 0 ? posts : getFallbackBlogPosts();
  } catch (error) {
    console.error("Failed to fetch hatena blog posts:", error);
    return getFallbackBlogPosts();
  }
}

// Fallback: Get blog posts from bento-links.json content section
export function getFallbackBlogPosts(): BlogPost[] {
  const contentSection = bentoLinks.sections.find((s) => s.id === "content");
  if (!contentSection) return [];

  const cache = ogpCache as Record<
    string,
    { title: string; image?: string; description?: string }
  >;

  const posts: BlogPost[] = contentSection.links
    .filter((link) => link.url.includes(HATENA_BLOG_DOMAIN))
    .map((link) => {
      const cachedData = cache[link.url];
      return {
        title: cachedData?.title || link.title,
        url: link.url,
        // Extract date from URL if possible (format: /entry/YYYY/MM/DD/ or /entry/slug)
        pubDate: extractDateFromUrl(link.url) || new Date().toISOString(),
        thumbnail: cachedData?.image,
      };
    });

  // Sort by date descending
  posts.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return posts;
}

function extractDateFromUrl(url: string): string | null {
  // Try to match date pattern in URL like /entry/2024/01/15/
  const dateMatch = url.match(/\/entry\/(\d{4})\/(\d{2})\/(\d{2})\//);
  if (dateMatch) {
    return new Date(
      `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
    ).toISOString();
  }
  return null;
}

// Get all hatena blog URLs for filtering from other sections
export function getHatenaBlogUrls(): Set<string> {
  const urls = new Set<string>();
  for (const section of bentoLinks.sections) {
    for (const link of section.links) {
      if (link.url.includes(HATENA_BLOG_DOMAIN)) {
        urls.add(link.url);
      }
    }
  }
  return urls;
}

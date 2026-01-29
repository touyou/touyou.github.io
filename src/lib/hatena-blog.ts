import Parser from "rss-parser";

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

    // Sort by date descending
    posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return posts;
  } catch (error) {
    console.error("Failed to fetch hatena blog posts:", error);
    return [];
  }
}

// Fallback: Fetch from cached JSON if RSS fails
export function getFallbackBlogPosts(): BlogPost[] {
  // Return posts from existing bento-links.json that match goodpatch-tech.hatenablog.com
  return [];
}

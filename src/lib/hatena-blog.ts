import Parser from "rss-parser";
import blogPostsData from "@/data/hatena-blog-posts.json";
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

// Author-specific RSS feed
const BLOG_FEED_URL = "https://goodpatch-tech.hatenablog.com/rss/author/touyou_Gp";

export async function fetchHatenaBlogPosts(): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL(BLOG_FEED_URL);

    const posts: BlogPost[] = feed.items.map((item) => {
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

    // Sort by date descending (newest first)
    posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return posts.length > 0 ? posts : getFallbackBlogPosts();
  } catch (error) {
    console.error("Failed to fetch hatena blog posts:", error);
    return getFallbackBlogPosts();
  }
}

// Fallback: Get blog posts from hatena-blog-posts.json
export function getFallbackBlogPosts(): BlogPost[] {
  const cache = ogpCache as Record<
    string,
    { title: string; image?: string; description?: string }
  >;

  const posts: BlogPost[] = blogPostsData.posts.map((post) => {
    const cachedData = cache[post.url];
    return {
      title: cachedData?.title || post.url.split("/").pop() || "Untitled",
      url: post.url,
      pubDate: new Date(post.pubDate).toISOString(),
      thumbnail: cachedData?.image,
    };
  });

  // Sort by date descending (newest first)
  posts.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return posts;
}

/**
 * Update Blog Posts Script
 * Run with: pnpm tsx scripts/update-blog-posts.ts
 *
 * Fetches blog posts from Hatena Blog RSS feed
 * and saves them to src/data/hatena-blog-posts.json
 */

import Parser from "rss-parser";
import * as fs from "fs";
import * as path from "path";

interface BlogPostEntry {
  url: string;
  pubDate: string;
}

interface BlogPostsData {
  posts: BlogPostEntry[];
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

const BLOG_FEED_URL =
  "https://goodpatch-tech.hatenablog.com/rss/author/touyou_Gp";

async function main() {
  const outputPath = path.join(
    process.cwd(),
    "src/data/hatena-blog-posts.json"
  );

  console.log(`Fetching blog posts from: ${BLOG_FEED_URL}`);

  try {
    const feed = await parser.parseURL(BLOG_FEED_URL);

    console.log(`Found ${feed.items.length} posts`);

    const posts: BlogPostEntry[] = feed.items.map((item) => {
      const pubDate = item.pubDate || item.isoDate || new Date().toISOString();
      // Format as YYYY-MM-DD
      const formattedDate = new Date(pubDate).toISOString().split("T")[0];

      return {
        url: item.link || "",
        pubDate: formattedDate,
      };
    });

    // Sort by date descending
    posts.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    const data: BlogPostsData = { posts };

    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2) + "\n");
    console.log(`\nSaved ${posts.length} posts to ${outputPath}`);

    // Print posts for verification
    console.log("\nPosts:");
    posts.forEach((post, i) => {
      console.log(`  ${i + 1}. [${post.pubDate}] ${post.url}`);
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    process.exit(1);
  }
}

main().catch(console.error);

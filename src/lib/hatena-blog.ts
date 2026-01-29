import blogPostsData from "@/data/hatena-blog-posts.json";
import ogpCache from "@/data/ogp-cache.json";

export interface BlogPost {
  title: string;
  url: string;
  pubDate: string;
  thumbnail?: string;
}

// Get blog posts from hatena-blog-posts.json
export async function fetchHatenaBlogPosts(): Promise<BlogPost[]> {
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

import { fetchHatenaBlogPosts } from "@/lib/hatena-blog";
import { BlogSection } from "./BlogSection";

interface AsyncBlogSectionProps {
  title?: string;
}

export async function AsyncBlogSection({
  title = "Tech Blog",
}: AsyncBlogSectionProps) {
  const blogPosts = await fetchHatenaBlogPosts();
  return <BlogSection posts={blogPosts} title={title} />;
}

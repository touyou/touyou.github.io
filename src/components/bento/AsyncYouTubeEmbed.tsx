import { fetchOGP } from "@/lib/ogp";
import { YouTubeEmbed } from "./YouTubeEmbed";

interface AsyncYouTubeEmbedProps {
  url: string;
  fallbackTitle: string;
}

export async function AsyncYouTubeEmbed({
  url,
  fallbackTitle,
}: AsyncYouTubeEmbedProps) {
  const ogpData = await fetchOGP(url);
  return <YouTubeEmbed url={url} title={ogpData?.title || fallbackTitle} />;
}

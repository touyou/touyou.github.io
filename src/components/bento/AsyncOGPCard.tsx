import { fetchOGP } from "@/lib/ogp";
import type { BentoLink } from "@/lib/bento-types";
import { OGPCard } from "./OGPCard";

interface AsyncOGPCardProps {
  link: BentoLink;
}

export async function AsyncOGPCard({ link }: AsyncOGPCardProps) {
  const ogpData = await fetchOGP(link.url);
  // Override only the image when a local thumbnail is provided. OGP title /
  // description are stable text and worth keeping fresh, but volatile image
  // URLs (e.g. GitHub's rotating opengraph hash) need a deploy-bundled local
  // fallback to stop the intermittent broken thumbnail.
  const cardData = link.thumbnailOverride
    ? { ...ogpData, image: link.thumbnailOverride }
    : ogpData;
  return <OGPCard link={link} ogpData={cardData} />;
}

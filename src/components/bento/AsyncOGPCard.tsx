import { fetchOGP } from "@/lib/ogp";
import type { BentoLink } from "@/lib/bento-types";
import { OGPCard } from "./OGPCard";

interface AsyncOGPCardProps {
  link: BentoLink;
}

export async function AsyncOGPCard({ link }: AsyncOGPCardProps) {
  const ogpData = await fetchOGP(link.url);
  return <OGPCard link={link} ogpData={ogpData} />;
}

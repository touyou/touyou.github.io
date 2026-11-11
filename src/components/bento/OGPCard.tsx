import type { BentoLink, OGPData } from "@/lib/bento-types";
import { cardBase } from "@/lib/bento-utils";
import { githubRepoCard } from "@/lib/github-card";
import { OGPImage } from "./OGPImage";

interface OGPCardProps {
  link: BentoLink;
  ogpData?: OGPData;
}

export function OGPCard({ link, ogpData }: OGPCardProps) {
  const displayTitle = ogpData?.title || link.title;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group col-span-2`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        <OGPImage
          src={ogpData?.image ?? null}
          githubCard={githubRepoCard(link.url, ogpData)}
        />
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">
          {displayTitle}
        </p>
      </div>
    </a>
  );
}

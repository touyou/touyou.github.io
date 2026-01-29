import Image from "next/image";
import type { BentoLink, OGPData } from "@/lib/bento-types";
import { cardBase } from "@/lib/bento-utils";

interface OGPCardProps {
  link: BentoLink;
  ogpData?: OGPData;
}

export function OGPCard({ link, ogpData }: OGPCardProps) {
  const displayTitle = ogpData?.title || link.title;
  const imageUrl = ogpData?.image;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex flex-col group col-span-2`}
    >
      <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">
          {displayTitle}
        </p>
      </div>
    </a>
  );
}

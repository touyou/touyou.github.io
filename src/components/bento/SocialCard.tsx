import Image from "next/image";
import type { BentoLink, SocialPlatform } from "@/lib/bento-types";
import { getFaviconUrl, platformColors, cardBase } from "@/lib/bento-utils";

interface SocialCardProps {
  link: BentoLink;
}

export function SocialCard({ link }: SocialCardProps) {
  const platform = link.platform as SocialPlatform | undefined;
  const hoverColor = platform ? platformColors[platform] : "hover:bg-gray-100";
  const faviconUrl = getFaviconUrl(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel={platform === "fedibird" ? "me noreferrer" : "noreferrer"}
      className={`${cardBase} flex items-center gap-3 p-4 group ${hoverColor}`}
    >
      {faviconUrl && (
        <Image
          src={faviconUrl}
          alt=""
          width={24}
          height={24}
          className="w-6 h-6 flex-shrink-0 rounded"
          unoptimized
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-white transition-colors">
          {link.title}
        </p>
        {link.username && (
          <p className="text-gray-500 text-xs truncate group-hover:text-white/80 transition-colors">
            {link.username}
          </p>
        )}
      </div>
    </a>
  );
}

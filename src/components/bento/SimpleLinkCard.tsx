import Image from "next/image";
import type { BentoLink } from "@/lib/bento-types";
import { getFaviconUrl, cardBase } from "@/lib/bento-utils";

interface SimpleLinkCardProps {
  link: BentoLink;
}

export function SimpleLinkCard({ link }: SimpleLinkCardProps) {
  const faviconUrl = getFaviconUrl(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className={`${cardBase} flex items-center gap-3 p-4 hover:bg-gray-50`}
    >
      {faviconUrl && (
        <Image
          src={faviconUrl}
          alt=""
          width={20}
          height={20}
          className="w-5 h-5 flex-shrink-0 rounded"
          unoptimized
        />
      )}
      <p className="font-medium text-gray-900 text-sm truncate">{link.title}</p>
    </a>
  );
}

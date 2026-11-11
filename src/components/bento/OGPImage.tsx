"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import type { GitHubRepoCard } from "@/lib/github-card";
import { GitHubCardPlaceholder } from "./GitHubCardPlaceholder";

interface OGPImageProps {
  src: string | null;
  githubCard: GitHubRepoCard | null;
}

export function OGPImage({ src, githubCard }: OGPImageProps) {
  const [failed, setFailed] = useState(false);

  // SSR の HTML で読み込みが先に失敗すると、hydration 前なので onError を取りこぼす
  const checkAlreadyFailed = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (src && !failed) {
    return (
      <Image
        ref={checkAlreadyFailed}
        src={src}
        alt=""
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        unoptimized
        onError={() => setFailed(true)}
      />
    );
  }

  if (githubCard) return <GitHubCardPlaceholder card={githubCard} />;

  return (
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
  );
}

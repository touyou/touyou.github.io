import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import { fetchMultipleOGP } from "@/lib/ogp";
import type { BentoData, BentoLink, OGPData, SocialPlatform } from "@/lib/bento-types";
import { ImageGallery } from "@/components/bento/ImageGallery";
import { YouTubeEmbed } from "@/components/bento/YouTubeEmbed";

// Check if URL is YouTube
function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// Get favicon URL from domain using Google's favicon service
function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

// Platform hover colors
const platformColors: Record<SocialPlatform, string> = {
  twitter: "hover:bg-gray-900",
  github: "hover:bg-gray-800",
  youtube: "hover:bg-red-500",
  linkedin: "hover:bg-blue-600",
  instagram: "hover:bg-gradient-to-tr hover:from-amber-400 hover:via-pink-500 hover:to-purple-600",
  facebook: "hover:bg-blue-500",
  threads: "hover:bg-gray-900",
  bluesky: "hover:bg-sky-500",
  fedibird: "hover:bg-indigo-500",
  zenn: "hover:bg-sky-400",
  qiita: "hover:bg-green-500",
  speakerdeck: "hover:bg-teal-600",
  gitlab: "hover:bg-orange-500",
  google: "hover:bg-blue-500",
  wantedly: "hover:bg-cyan-500",
  hoyolab: "hover:bg-blue-400",
  hatena: "hover:bg-sky-500",
};

// Base card styles
const cardBase = "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden";

// Social Card Component - uses favicon from URL domain
function SocialCard({ link }: { link: BentoLink }) {
  const platform = link.platform as SocialPlatform | undefined;
  const hoverColor = platform ? platformColors[platform] : "hover:bg-gray-100";
  const faviconUrl = getFaviconUrl(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
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
        <p className="font-medium text-gray-900 text-sm truncate group-hover:text-white transition-colors">{link.title}</p>
        {link.username && (
          <p className="text-gray-500 text-xs truncate group-hover:text-white/80 transition-colors">{link.username}</p>
        )}
      </div>
    </a>
  );
}

// OGP Card Component - aspect-video to match YouTube cards
function OGPCard({ link, ogpData }: { link: BentoLink; ogpData?: OGPData }) {
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
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">{displayTitle}</p>
      </div>
    </a>
  );
}

// Simple Link Card Component
function SimpleLinkCard({ link }: { link: BentoLink }) {
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

// Check if section contains only images
function isImageSection(links: BentoLink[]): boolean {
  return links.every((link) => link.cardType === "image");
}

// Section Header Component
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="col-span-2 md:col-span-4 text-gray-600 text-sm font-semibold mt-6 first:mt-0 px-1">
      {children}
    </h2>
  );
}

export default async function BentoPage() {
  const data = bentoData as BentoData;

  // Collect all OGP URLs
  const ogpUrls = data.sections
    .flatMap((section) => section.links)
    .filter((link) => link.cardType === "ogp")
    .map((link) => link.url);

  // Fetch all OGP data in parallel
  const ogpDataMap = await fetchMultipleOGP(ogpUrls);

  return (
    <main className="min-h-dvh">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg mb-4 ring-4 ring-white">
            <Image
              src={data.profile.avatar}
              alt={data.profile.name}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.profile.name}</h1>
          <div className="text-gray-600 text-center mt-2 space-y-1">
            {data.profile.bio.map((line, i) => (
              <p key={i} className={line === "" ? "h-2" : ""}>{line}</p>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.sections.map((section) => {
            // Handle image-only sections as galleries
            if (isImageSection(section.links)) {
              const images = section.links
                .filter((link) => link.imageSrc)
                .map((link) => ({
                  imageSrc: link.imageSrc!,
                  title: link.title,
                }));

              return (
                <ImageGallery key={section.id} images={images} />
              );
            }

            // Regular sections
            return (
              <div key={section.id} className="contents">
                {section.title && <SectionHeader>{section.title}</SectionHeader>}
                {section.links.map((link, index) => {
                  if (link.cardType === "social") {
                    return <SocialCard key={index} link={link} />;
                  }
                  if (link.cardType === "ogp") {
                    const ogpData = ogpDataMap.get(link.url);
                    if (isYouTubeUrl(link.url)) {
                      return <YouTubeEmbed key={index} url={link.url} title={ogpData?.title || link.title} />;
                    }
                    return <OGPCard key={index} link={link} ogpData={ogpData} />;
                  }
                  return <SimpleLinkCard key={index} link={link} />;
                })}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}

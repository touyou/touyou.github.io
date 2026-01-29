"use client";

import type { BentoData, BentoLink } from "@/lib/bento-types";
import { ImageGallery } from "./ImageGallery";
import { SocialCard } from "./SocialCard";
import { SimpleLinkCard } from "./SimpleLinkCard";
import { SectionHeader } from "./SectionHeader";
import { ProfileHeader } from "./ProfileHeader";
import { YouTubeSection } from "./YouTubeSection";
import { OGPCardSkeleton } from "./OGPCardSkeleton";
import { SpeakerDeckSectionSkeleton } from "./SpeakerDeckSectionSkeleton";
import { BlogSectionSkeleton } from "./BlogSectionSkeleton";

interface BentoPreviewProps {
  data: BentoData;
}

// Check if section contains only images
function isImageSection(links: BentoLink[]): boolean {
  return links.every((link) => link.cardType === "image");
}

// Simple OGP card for preview (no async fetching)
function OGPCardPreview({ link }: { link: BentoLink }) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      className="col-span-2 bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300"
    >
      <div className="aspect-video bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400 text-sm">OGP Preview</span>
      </div>
      <div className="p-4">
        <p className="font-medium text-gray-900 text-sm line-clamp-2">
          {link.title}
        </p>
        <p className="text-gray-400 text-xs mt-1 truncate">{link.url}</p>
      </div>
    </a>
  );
}

export function BentoPreview({ data }: BentoPreviewProps) {
  return (
    <div className="bg-white">
      {/* Sticky Back to home (visual only) */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <span className="inline-flex items-center gap-2 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Profile Header */}
        <ProfileHeader profile={data.profile} />

        {/* Bento Sections Container */}
        <div className="flex flex-col gap-6">
          {data.sections.map((section) => {
            // Skip empty sections
            if (section.links.length === 0) {
              return null;
            }

            // Handle image-only sections as galleries
            if (isImageSection(section.links)) {
              const images = section.links
                .filter((link) => link.imageSrc)
                .map((link) => ({
                  imageSrc: link.imageSrc!,
                  title: link.title,
                }));

              return (
                <div key={section.id} className="grid grid-cols-3 gap-3">
                  <ImageGallery images={images} />
                </div>
              );
            }

            // Regular sections
            return (
              <section key={section.id}>
                {section.title && <SectionHeader>{section.title}</SectionHeader>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {section.links.map((link, index) => {
                    if (link.cardType === "social") {
                      return <SocialCard key={index} link={link} />;
                    }
                    if (link.cardType === "ogp") {
                      return <OGPCardPreview key={index} link={link} />;
                    }
                    return <SimpleLinkCard key={index} link={link} />;
                  })}
                </div>
              </section>
            );
          })}

          {/* YouTube Sections - Defined in JSON */}
          {data.youtubeSections?.map((ytSection) => (
            <YouTubeSection
              key={ytSection.id}
              videos={ytSection.videos}
              title={ytSection.title}
            />
          ))}

          {/* SpeakerDeck Section - Skeleton in preview */}
          <SpeakerDeckSectionSkeleton />

          {/* Blog Section - Skeleton in preview */}
          <BlogSectionSkeleton />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}

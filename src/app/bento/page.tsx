import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import type { BentoData, BentoLink } from "@/lib/bento-types";
import { isYouTubeUrl } from "@/lib/bento-utils";
import { ImageGallery } from "@/components/bento/ImageGallery";
import { SocialCard } from "@/components/bento/SocialCard";
import { SimpleLinkCard } from "@/components/bento/SimpleLinkCard";
import { SectionHeader } from "@/components/bento/SectionHeader";
import { ProfileHeader } from "@/components/bento/ProfileHeader";
import { AsyncOGPCard } from "@/components/bento/AsyncOGPCard";
import { AsyncYouTubeEmbed } from "@/components/bento/AsyncYouTubeEmbed";
import { AsyncBlogSection } from "@/components/bento/AsyncBlogSection";
import { OGPCardSkeleton } from "@/components/bento/OGPCardSkeleton";
import { YouTubeEmbedSkeleton } from "@/components/bento/YouTubeEmbedSkeleton";
import { BlogSectionSkeleton } from "@/components/bento/BlogSectionSkeleton";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// Check if section contains only images
function isImageSection(links: BentoLink[]): boolean {
  return links.every((link) => link.cardType === "image");
}

export default function BentoPage() {
  const data = bentoData as BentoData;

  return (
    <main className="min-h-dvh">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Back to home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition mb-8"
        >
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
        </Link>

        {/* Profile Header */}
        <ProfileHeader profile={data.profile} />

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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

              return <ImageGallery key={section.id} images={images} />;
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
                    if (isYouTubeUrl(link.url)) {
                      return (
                        <Suspense key={index} fallback={<YouTubeEmbedSkeleton />}>
                          <AsyncYouTubeEmbed
                            url={link.url}
                            fallbackTitle={link.title}
                          />
                        </Suspense>
                      );
                    }
                    return (
                      <Suspense key={index} fallback={<OGPCardSkeleton />}>
                        <AsyncOGPCard link={link} />
                      </Suspense>
                    );
                  }
                  return <SimpleLinkCard key={index} link={link} />;
                })}
              </div>
            );
          })}

          {/* Blog Section - Auto-collected from Hatena Blog */}
          <Suspense fallback={<BlogSectionSkeleton />}>
            <AsyncBlogSection title="Goodpatch Tech Blog" />
          </Suspense>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}

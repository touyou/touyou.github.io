import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import type { BentoData, BentoLink } from "@/lib/bento-types";
import { fetchHatenaBlogPosts } from "@/lib/hatena-blog";
import { fetchSpeakerDeckTalks } from "@/lib/speakerdeck";
import { ImageGallery } from "@/components/bento/ImageGallery";
import { SocialCard } from "@/components/bento/SocialCard";
import { SimpleLinkCard } from "@/components/bento/SimpleLinkCard";
import { SectionHeader } from "@/components/bento/SectionHeader";
import { ProfileHeader } from "@/components/bento/ProfileHeader";
import { AsyncOGPCard } from "@/components/bento/AsyncOGPCard";
import { OGPCardSkeleton } from "@/components/bento/OGPCardSkeleton";
import { SuspenseBlogSection } from "@/components/bento/SuspenseBlogSection";
import { BlogSectionSkeleton } from "@/components/bento/BlogSectionSkeleton";
import { SuspenseSpeakerDeckSection } from "@/components/bento/SuspenseSpeakerDeckSection";
import { SpeakerDeckSectionSkeleton } from "@/components/bento/SpeakerDeckSectionSkeleton";
import { YouTubeSection } from "@/components/bento/YouTubeSection";

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

  // Start fetching promises (don't await - pass to Suspense children)
  const blogPromise = fetchHatenaBlogPosts();
  const speakerDeckPromise = fetchSpeakerDeckTalks();

  return (
    <main className="min-h-dvh">
      {/* Sticky Back to home */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition"
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
                      return (
                        <Suspense key={index} fallback={<OGPCardSkeleton />}>
                          <AsyncOGPCard link={link} />
                        </Suspense>
                      );
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

          {/* SpeakerDeck Section - Auto-collected from RSS */}
          <Suspense fallback={<SpeakerDeckSectionSkeleton />}>
            <SuspenseSpeakerDeckSection
              talksPromise={speakerDeckPromise}
              title="Speaker Deck"
            />
          </Suspense>

          {/* Blog Section - Auto-collected from Hatena Blog */}
          <Suspense fallback={<BlogSectionSkeleton />}>
            <SuspenseBlogSection
              blogPromise={blogPromise}
              title="Goodpatch Tech Blog"
            />
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

import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import type { BentoData, BentoLink } from "@/lib/bento-types";
import { isYouTubeUrl, extractYouTubeVideoId } from "@/lib/bento-utils";
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
import { YouTubeSection, type YouTubeVideo } from "@/components/bento/YouTubeSection";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// Check if section contains only images
function isImageSection(links: BentoLink[]): boolean {
  return links.every((link) => link.cardType === "image");
}

// Extract YouTube videos from links
function extractYouTubeVideos(links: BentoLink[]): YouTubeVideo[] {
  return links
    .filter((link) => link.cardType === "ogp" && isYouTubeUrl(link.url))
    .map((link) => ({
      url: link.url,
      title: link.title,
      videoId: extractYouTubeVideoId(link.url) || "",
    }))
    .filter((video) => video.videoId !== "");
}

export default function BentoPage() {
  const data = bentoData as BentoData;

  // Start fetching promises (don't await - pass to Suspense children)
  const blogPromise = fetchHatenaBlogPosts();
  const speakerDeckPromise = fetchSpeakerDeckTalks();

  // Collect all YouTube videos from all sections
  const allYouTubeVideos: YouTubeVideo[] = [];
  data.sections.forEach((section) => {
    const videos = extractYouTubeVideos(section.links);
    allYouTubeVideos.push(...videos);
  });

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

            // Filter out YouTube links (will be shown in dedicated section)
            const nonYouTubeLinks = section.links.filter(
              (link) => !(link.cardType === "ogp" && isYouTubeUrl(link.url))
            );

            // Skip if no links remain after filtering
            if (nonYouTubeLinks.length === 0) {
              return null;
            }

            // Regular sections
            return (
              <div key={section.id} className="contents">
                {section.title && <SectionHeader>{section.title}</SectionHeader>}
                {nonYouTubeLinks.map((link, index) => {
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
            );
          })}

          {/* YouTube Section - Collected from all sections */}
          {allYouTubeVideos.length > 0 && (
            <YouTubeSection videos={allYouTubeVideos} title="YouTube" />
          )}

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

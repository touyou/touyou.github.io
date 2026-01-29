import { Metadata } from "next";
import Link from "next/link";
import bentoData from "@/data/bento-links.json";
import { fetchMultipleOGP } from "@/lib/ogp";
import {
  fetchHatenaBlogPosts,
  getHatenaBlogUrls,
} from "@/lib/hatena-blog";
import type { BentoData, BentoLink } from "@/lib/bento-types";
import { isYouTubeUrl } from "@/lib/bento-utils";
import { ImageGallery } from "@/components/bento/ImageGallery";
import { YouTubeEmbed } from "@/components/bento/YouTubeEmbed";
import { SocialCard } from "@/components/bento/SocialCard";
import { OGPCard } from "@/components/bento/OGPCard";
import { SimpleLinkCard } from "@/components/bento/SimpleLinkCard";
import { SectionHeader } from "@/components/bento/SectionHeader";
import { ProfileHeader } from "@/components/bento/ProfileHeader";
import { BlogSection } from "@/components/bento/BlogSection";

export const metadata: Metadata = {
  title: "Bento | touyou.dev",
  description: "Yosuke Fujii - Design Engineer at Goodpatch Inc.",
};

// Check if section contains only images
function isImageSection(links: BentoLink[]): boolean {
  return links.every((link) => link.cardType === "image");
}

export default async function BentoPage() {
  const rawData = bentoData as BentoData;

  // Get hatena blog URLs to filter from content section
  const hatenaBlogUrls = getHatenaBlogUrls();

  // Filter hatena blog posts from sections (they'll be shown in BlogSection)
  const data: BentoData = {
    ...rawData,
    sections: rawData.sections.map((section) => ({
      ...section,
      links: section.links.filter((link) => !hatenaBlogUrls.has(link.url)),
    })),
  };

  // Collect all OGP URLs (excluding hatena blog)
  const ogpUrls = data.sections
    .flatMap((section) => section.links)
    .filter((link) => link.cardType === "ogp")
    .map((link) => link.url);

  // Fetch all OGP data and blog posts in parallel
  const [ogpDataMap, blogPosts] = await Promise.all([
    fetchMultipleOGP(ogpUrls),
    fetchHatenaBlogPosts(),
  ]);

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
                    const ogpData = ogpDataMap.get(link.url);
                    if (isYouTubeUrl(link.url)) {
                      return (
                        <YouTubeEmbed
                          key={index}
                          url={link.url}
                          title={ogpData?.title || link.title}
                        />
                      );
                    }
                    return <OGPCard key={index} link={link} ogpData={ogpData} />;
                  }
                  return <SimpleLinkCard key={index} link={link} />;
                })}
              </div>
            );
          })}

          {/* Blog Section - Auto-collected from Hatena Blog */}
          <BlogSection posts={blogPosts} title="Goodpatch Tech Blog" />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Copyrights © 2015- touyou. All Rights Reserved.</p>
        </footer>
      </div>
    </main>
  );
}

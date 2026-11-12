import "./globals.css";

import { Metadata, Viewport } from "next";
import Script from "next/script";

const siteName = "touyou.dev";
const description = "touyou (Fujii Yosuke) / Japanese Software Engineer";
const siteUrl = "https://touyou.dev";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteName}`),
  authors: [{ name: "touyou" }],
  keywords: ["touyou", "touyoubuntu", "とうよう", "とーよー"],
  title: siteName,
  description,
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    locale: "ja_JP",
    type: "website",
    images: [
      {
        url: "/ogp.jpg",
        width: 1200,
        height: 628,
      },
      {
        url: "/ogp_facebook.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "favicon/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
};

const GA_TRACKING_ID = "UA-136500666-1";

// 同じサイト内のリンクに 200ms ほど指を置くと、次のページを裏で取りに行き、描ける環境では描いておく（対応していないブラウザは無視する）。
// 書き込みや下書きの画面、画像の書き出し用のページは先読みしない
const speculationTarget = {
  and: [
    { href_matches: "/*" },
    { not: { href_matches: "/api/*" } },
    { not: { href_matches: "/bento/edit" } },
    { not: { href_matches: "/bento/preview" } },
    { not: { href_matches: "/preview/*" } },
    { not: { href_matches: "/store/*" } },
  ],
};
const speculationRules = {
  prefetch: [{ where: speculationTarget, eagerness: "moderate" }],
  prerender: [{ where: speculationTarget, eagerness: "moderate" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="bg-background">
      <head>
        <link rel="me" href="https://fedibird.com/@touyou" />
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speculationRules) }}
        />
      </head>
      <body className="bg-background">{children}</body>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="gtag-init"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('config', '${GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
            `,
        }}
      />
    </html>
  );
}

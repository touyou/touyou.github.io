import "./globals.css";

import { Metadata, Viewport } from "next";
import Script from "next/script";

const siteName = "touyou.dev";
const description = "touyou (Fujii Yosuke) / Japanese Software Engineer";
const siteUrl = "https://touyou.dev";

export const metadata: Metadata = {
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
  maximumScale: 1,
};

const GA_TRACKING_ID = "UA-136500666-1";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
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

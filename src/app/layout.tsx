import { randomBytes } from 'crypto'
import './globals.css'

import NextHead from 'next/head'

const siteName = 'touyou.dev'
const description = 'touyou (Fujii Yosuke) / Japanese Software Engineer'
const siteUrl = 'https://touyou.dev'

export const metadata = {
  title: siteName,
  description,
  openGraph: {
    title: siteName,
    description,
    url: siteUrl,
    siteName,
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description,
  }
}

const GA_TRACKING_ID = "UA-136500666-1";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nonce = randomBytes(128).toString("base64");
  const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http: 'nonce-${nonce}' 'strict-dynamic'`;

  return (
    <html lang='ja'>
      <NextHead>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <script
          async
          nonce={nonce}
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <script
          nonce={nonce}
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
      </NextHead>
      <body>
        {children}
      </body>
    </html>
  )
}

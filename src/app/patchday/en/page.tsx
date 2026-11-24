import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  AppNav,
  AppPage,
  Band,
  Faq,
  type FaqItem,
  Heading,
  MakerNote,
  PillLink,
  SafeAreaColor,
  type Screen,
  ScreenStrip,
  Tile,
} from "@/components/app-lp";
import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";

/**
 * Patchday の英語の紹介ページ。文言は App Store の英語の説明文（Patchday リポジトリの docs/app-store/listing.md の English）に合わせる。
 * 機能を変えたら日本語のページと一緒に直す。
 */

const SUPPORT_URL = "/patchday/support";
const APP_STORE_URL = "https://apps.apple.com/us/app/id6831397385";
const MAC_APP_STORE_URL = `${APP_STORE_URL}?platform=mac`;

const screens: Screen[] = [
  { src: "/patchday/screens/en-02-deadlines.webp", alt: "Patchday screen: deadlines", caption: "Soonest deadline first" },
  { src: "/patchday/screens/en-03-detail.webp", alt: "Patchday screen: a vulnerability with its CSIRT progress", caption: "Your team's progress" },
  { src: "/patchday/screens/en-04-new.webp", alt: "Patchday screen: new vulnerabilities", caption: "New for your products" },
];

const features = [
  {
    title: "A calendar of deadlines",
    body: "KEV entries use CISA's due date. JVN entries count days from publication by severity: Critical 7, High 14, Medium 30, Low 90, all adjustable.",
  },
  {
    title: "Only what matters",
    body: "Watch vendors or products, mute what doesn't apply right from a vulnerability's detail, and filter by severity, source and product type.",
  },
  {
    title: "Your team's progress",
    body: "Not Started, Announced, Discussed, Done or Not Applicable, with dated notes. Synced through your iCloud across iPhone, iPad and Mac.",
  },
  {
    title: "Desktop apps and Apple's OSes too",
    body: "iOS, macOS, Xcode, Chrome, Firefox, Acrobat Reader, Java, Node.js, Git, curl, OpenSSL and more from the NVD, grouped per product per day.",
  },
  {
    title: "Planned releases on the same calendar",
    body: "Node.js security release pre-announcements, Microsoft Patch Tuesday and Oracle Critical Patch Updates, marked separately from deadlines.",
  },
  {
    title: "Widgets and Shortcuts",
    body: "This week's count on your Home Screen and Lock Screen. Ask Siri “What's due this week in Patchday”, or record progress and add notes from Shortcuts.",
  },
];

const faq: FaqItem[] = [
  {
    q: "How are deadlines decided?",
    a: "CISA KEV entries use the due date CISA publishes. JVN and NVD entries count days from publication by severity. Both can be matched to your own policy in Settings › Deadline Rules.",
  },
  {
    q: "Won't it fill up with products I don't use?",
    a: "Mute a product or vendor from a vulnerability's detail. Watch the ones you care about, and only those show up.",
  },
  {
    q: "Does my progress sync to my other devices?",
    a: "Progress and notes sync through iCloud across the iPhone, iPad and Mac signed in to the same Apple Account. Watch and mute settings stay on each device.",
  },
  {
    q: "Is it only for Japanese teams?",
    a: "No. CISA KEV and the NVD are global, and the app is available in English. JVN adds the advisories published in Japan.",
  },
];

export const viewport: Viewport = { themeColor: "#ffffff" };

export const metadata: Metadata = {
  title: "Patchday — Vulnerability deadlines, in your team's hands",
  description:
    "See CISA KEV, JVN and NVD vulnerabilities on a deadline calendar. Watch only the products you care about, and record what your CSIRT announced and discussed.",
  alternates: { languages: { ja: "https://www.touyou.dev/patchday", en: "https://www.touyou.dev/patchday/en" } },
  openGraph: {
    title: "Patchday",
    description: "Vulnerability deadlines, in your team's hands.",
    url: "https://www.touyou.dev/patchday/en",
    siteName: "touyou.dev",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/patchday.png", width: 1200, height: 630, alt: "Patchday" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patchday",
    description: "Vulnerability deadlines, in your team's hands.",
    images: ["https://www.touyou.dev/og/patchday.png"],
  },
};

export default function PatchdayEnglishPage() {
  return (
    <AppPage lang="en">
      <SafeAreaColor top="#ffffff" bottom="#F5F5F7" />
      <AppNav icon={<PatchdayIcon className="h-6 w-6 shadow-none" alt="Patchday icon" />} name="Patchday" home="/patchday/en">
        <Link href="/patchday" lang="ja" hrefLang="ja" className="hover:text-neutral-900">
          日本語
        </Link>
        <PillLink href={APP_STORE_URL} size="sm">
          Get
        </PillLink>
      </AppNav>
      <main id="main" tabIndex={-1} className="outline-none">
        <Band className="items-center text-center">
          <PatchdayIcon className="h-28 w-28" alt="Patchday icon" />
          <h1 className="max-w-3xl text-[clamp(36px,7vw,64px)] font-bold leading-[1.1] tracking-[-0.02em] [text-wrap:balance]">
            Vulnerability deadlines, in your team&apos;s hands.
          </h1>
          <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.6] text-neutral-600">
            See CISA KEV, JVN and NVD vulnerabilities on a deadline calendar. Watch only the products you care about, and record what you announced and discussed.
          </p>
          <PillLink href={APP_STORE_URL}>Download on the App Store</PillLink>
          <p className="text-sm text-neutral-500">
            For iPhone, iPad and Mac (
            <a href={MAC_APP_STORE_URL} className="text-[#0066CC] underline-offset-4 hover:underline">
              View in the Mac App Store
            </a>
            ).
          </p>
        </Band>
        <section className="pb-24">
          <ScreenStrip screens={screens} label="Patchday screens" />
        </section>
        <Band tone="gray">
          <Heading title={["What to look at,", "in deadline order."]} />
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((feature) => (
              <Tile key={feature.title} title={feature.title} body={feature.body} className="bg-white" />
            ))}
          </div>
        </Band>
        <Band>
          <Heading title={["The calendar,", "with details beside it."]}>
            Tabs on iPhone. On iPad in landscape, on Mac and on an unfolded iPhone Duo, the calendar takes the room and the selected vulnerability opens on the right.
          </Heading>
          <div className="mx-auto w-full max-w-[760px] overflow-hidden rounded-[14px] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)] ring-1 ring-black/5">
            <Image src="/patchday/mac-calendar-en.jpg" alt="Patchday's calendar and detail on Mac" width={1600} height={994} className="w-full" />
          </div>
        </Band>
        <Band tone="gray">
          <Heading title={["No server.", "No account."]}>
            Patchday only connects to CISA, JVN, the NVD and the Node.js release feed. Your records are stored in your own iCloud and are never sent to the developer.
          </Heading>
          <p className="text-center text-sm text-neutral-500">
            Sources: CISA Known Exploited Vulnerabilities Catalog / JVN and JVN iPedia (IPA, JPCERT/CC) / NIST National Vulnerability Database / Node.js Security Releases. This product uses data
            from the NVD API but is not endorsed or certified by the NVD. Patchday is an independent app and is not affiliated with CISA, IPA, JPCERT/CC, NIST or the OpenJS Foundation.
          </p>
        </Band>
        <Band>
          <Heading title={["Before you roll it out."]} />
          <Faq items={faq} moreHref={SUPPORT_URL} lang="en" />
        </Band>
        <Band tone="gray">
          <MakerNote contactHref={SUPPORT_URL} lang="en">
            Patchday is made by one person in Japan. If your team uses different deadline rules, or there is a product you want followed, please let me know.
          </MakerNote>
        </Band>
        <section className="flex flex-col items-center gap-6 px-6 py-24 text-center">
          <PatchdayIcon className="h-20 w-20" alt="Patchday icon" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">Meet the next deadline, calmly.</h2>
          <PillLink href={APP_STORE_URL}>Download on the App Store</PillLink>
          <span className="text-[13px] text-neutral-500">
            iOS 27, iPadOS 27, macOS 27 or later (
            <a href={MAC_APP_STORE_URL} className="text-[#0066CC] underline-offset-4 hover:underline">
              Mac App Store
            </a>
            )
          </span>
        </section>
      </main>
      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-black/10 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={SUPPORT_URL} className="hover:text-neutral-900">
              Support
            </Link>
            <Link href="/patchday/privacy" className="hover:text-neutral-900">
              Privacy Policy
            </Link>
            <Link href="/press" className="hover:text-neutral-900">
              Press kit
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              touyou.dev
            </Link>
          </div>
          <p>Screens are examples. The vulnerabilities shown change as the sources update. The support and privacy pages are in Japanese.</p>
          <p>Apple, iPhone, iPad, Mac, Siri, iCloud and App Store are trademarks of Apple Inc.</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </AppPage>
  );
}

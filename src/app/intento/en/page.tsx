import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";

import { AppNav, AppPage, Band, DeviceFrame, Faq, type FaqItem, Heading, MakerNote, PillLink, SafeAreaColor } from "@/components/app-lp";
import { IntentoIcon } from "@/components/intento/IntentoIcon";

/**
 * Intento の英語の紹介ページ。文言は App Store の英語の説明文（IntentTodo/metadata/ios/version/<バージョン>/en-US.json）に合わせる。
 * 日本語のページにある声のデモやウィジェットの見本は日本語の文言を持つ部品なので、ここでは実機の画面だけで見せる。
 */

const APP_STORE_URL = "https://apps.apple.com/us/app/intento/id6788623037";
const SUPPORT_URL = "/intento/support";
const PRIVACY_URL = "/intento/privacy";


const surfaces = [
  ["Widgets", "Every size, with a checkbox on each row."],
  ["Control Center", "Add in one tap, see how many are left, finish the most urgent one."],
  ["Lock Screen", "A Live Activity for whatever is in progress."],
  ["Apple Watch", "A complication with the count and the next due date."],
  ["Spotlight", "Search your todos, including from what your camera or your screen is looking at."],
  ["Shortcuts", "25 actions: get the list, find the ones that match, complete a batch."],
];

const faq: FaqItem[] = [
  { q: "How do I use it with Siri?", a: "Say “Add a todo in Intento” or “Complete XXX in Intento”. The todo's name goes straight into the phrase." },
  { q: "Does it work with Shortcuts?", a: "Yes. Search for Intento in the Shortcuts app to find 25 actions, including add, complete and search." },
  { q: "Does it sync between my devices?", a: "Your todos sync through iCloud across the iPhone, iPad, Mac, Apple Watch and Apple Vision Pro signed in to the same Apple Account." },
  { q: "How much does it cost?", a: "Intento is free, with no in-app purchases." },
];

export const viewport: Viewport = { themeColor: "#ffffff" };

export const metadata: Metadata = {
  title: "Intento — A todo list you don't have to open",
  description:
    "Add, complete and snooze todos just by asking Siri. The same actions work from widgets, Control Center, the Lock Screen, Apple Watch and Spotlight.",
  alternates: { languages: { ja: "https://www.touyou.dev/intento", en: "https://www.touyou.dev/intento/en" } },
  openGraph: {
    title: "Intento",
    description: "A todo list you don't have to open.",
    url: "https://www.touyou.dev/intento/en",
    siteName: "touyou.dev",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/intento.png", width: 1200, height: 630, alt: "Intento" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intento",
    description: "A todo list you don't have to open.",
    images: ["https://www.touyou.dev/og/intento.png"],
  },
};

export default function IntentoEnglishPage() {
  return (
    <AppPage lang="en">
      <SafeAreaColor top="#ffffff" bottom="#F5F5F7" />
      <AppNav icon={<IntentoIcon className="h-6 w-6 shadow-none" alt="Intento icon" />} name="Intento" home="/intento/en">
        <Link href="/intento" lang="ja" hrefLang="ja" className="hover:text-neutral-900">
          日本語
        </Link>
        <PillLink href={APP_STORE_URL} size="sm">
          Get
        </PillLink>
      </AppNav>

      <main id="main" tabIndex={-1} className="flex flex-col outline-none">
        <section className="flex flex-col items-center gap-6 px-6 pb-16 pt-16 text-center sm:pt-24">
          <IntentoIcon className="h-24 w-24 sm:h-28 sm:w-28" alt="Intento icon" />
          <p className="text-xl font-semibold text-neutral-500">Intento</p>
          <h1 className="max-w-3xl text-[clamp(34px,7vw,60px)] font-bold leading-[1.1] tracking-[-0.02em] [text-wrap:balance]">
            A todo list you don&apos;t have to open.
          </h1>
          <p className="max-w-2xl text-[clamp(17px,2.2vw,21px)] leading-[1.6] text-neutral-600">
            Add something, finish it, or push it to later just by asking Siri. Opening the app is for when you actually want to sit and look at the list.
          </p>
          <div className="flex flex-col items-center gap-3">
            <PillLink href={APP_STORE_URL}>Download on the App Store</PillLink>
            <span className="text-[13px] text-neutral-500">Free · No in-app purchases</span>
          </div>
        </section>

        <Band tone="gray">
          <Heading title={["Say it, and it's done."]}>Todo names go straight into the phrase, so there is no picker to work through afterwards.</Heading>
          <ul className="flex flex-wrap justify-center gap-3">
            {[
              "Add a todo in Intento",
              "Complete XXX in Intento",
              "Snooze XXX in Intento",
              "How many todos do I have in Intento",
              "Complete my most urgent todo in Intento",
            ].map((phrase) => (
              <li key={phrase} className="rounded-full bg-white px-5 py-2.5 text-[15px] shadow-sm ring-1 ring-black/5">
                &ldquo;{phrase}&rdquo;
              </li>
            ))}
          </ul>
        </Band>

        <Band>
          <Heading title={["From the Home Screen.", "From the Lock Screen."]}>Wherever you touch it, the same action works the same way.</Heading>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {surfaces.map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 rounded-[28px] bg-[#F5F5F7] p-7">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-[15px] leading-[1.7] text-neutral-600">{body}</p>
              </li>
            ))}
          </ul>
        </Band>

        <Band tone="gray">
          <Heading title={["Add it on iPhone.", "Clear it on Mac."]}>
            iPhone, iPad, Mac, Apple Watch and Apple Vision Pro, kept in step through iCloud.
          </Heading>
          <div className="relative mx-auto w-full max-w-[440px]">
            <DeviceFrame device="ipad">
              <Image src="/intento/ipad-list-en.jpg" alt="Intento's todo list on iPad" width={750} height={1000} />
            </DeviceFrame>
            <Image src="/intento/screens/en-01-list.webp" alt="Intento's todo list on iPhone" width={600} height={1224} className="absolute -bottom-6 -left-2 h-auto w-[38%] sm:-left-20" />
          </div>
        </Band>

        <Band>
          <Heading title={["Your todos stay", "in your iCloud."]}>No account, no ads, no tracking.</Heading>
          <ul className="grid gap-4 sm:grid-cols-3">
            {[
              ["No account", "No sign-in, no email address."],
              ["No ads, no tracking", "There are no ads or analytics in the app."],
              ["Your own iCloud", "Todos are stored on your devices and in your own iCloud. The developer never receives them."],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 rounded-[28px] bg-[#F5F5F7] p-7">
                <h3 className="text-lg font-bold">{title}</h3>
                <p className="text-[15px] leading-[1.7] text-neutral-600">{body}</p>
              </li>
            ))}
          </ul>
          <a href={PRIVACY_URL} className="self-center text-[15px] text-[#0066CC] hover:underline">
            Privacy Policy (Japanese) ›
          </a>
        </Band>

        <Band tone="gray">
          <Heading title={["Before you ask."]} />
          <Faq items={faq} moreHref={SUPPORT_URL} lang="en" />
        </Band>

        <Band>
          <MakerNote contactHref={SUPPORT_URL} lang="en">
            Intento is made by one person in Japan. If Siri didn&apos;t understand something you said, please tell me the phrase. I&apos;ll make it work.
          </MakerNote>
        </Band>

        <section className="flex flex-col items-center gap-6 bg-[#F5F5F7] px-6 py-24 text-center">
          <IntentoIcon className="h-20 w-20" alt="Intento icon" />
          <h2 className="text-[clamp(28px,5vw,40px)] font-bold tracking-tight">Think of it. Say it.</h2>
          <PillLink href={APP_STORE_URL}>Download on the App Store</PillLink>
          <span className="text-[13px] text-neutral-500">Free · iOS 27, iPadOS 27, macOS 27, watchOS 27, visionOS 27 or later</span>
        </section>
      </main>

      <footer className="bg-[#F5F5F7]">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 border-t border-black/10 px-6 py-8 text-xs leading-[1.8] text-neutral-500">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SUPPORT_URL} className="hover:text-neutral-900">
              Support
            </a>
            <a href={PRIVACY_URL} className="hover:text-neutral-900">
              Privacy Policy
            </a>
            <Link href="/press" className="hover:text-neutral-900">
              Press kit
            </Link>
            <Link href="/" className="hover:text-neutral-900">
              touyou.dev
            </Link>
          </div>
          <p>The support and privacy pages are in Japanese.</p>
          <p>
            Apple, iPhone, iPad, Mac, Apple Watch, Apple Vision Pro, Siri, Spotlight, iCloud and App Store are trademarks of Apple Inc.
          </p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </AppPage>
  );
}

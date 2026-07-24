// Google Play app list.
//
// Unlike the App Store (iTunes Lookup API in app-store.ts), Google Play has no
// public API that lists a developer's apps, so package IDs are maintained by
// hand below. App name and icon are scraped from each store page's OGP tags
// (og:title / og:image) at request time, so metadata stays fresh without
// manual asset management.

import type { AppStoreApp } from "./app-store";

interface GooglePlayEntry {
  packageId: string;
  // Play pages don't expose a release date via OGP, so this is maintained by
  // hand and only used to position the app in the merged grid (sorted newest
  // first alongside App Store apps).
  releaseDate: string;
}

const GOOGLE_PLAY_APPS: GooglePlayEntry[] = [
  { packageId: "dev.touyou.graphica", releaseDate: "2026-07-24" },
  { packageId: "dev.touyou.checkitoutandroid", releaseDate: "2019-11-30" },
];

const TITLE_SUFFIXES = [" - Google Play のアプリ", " - Apps on Google Play"];

function decodeEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function metaContent(html: string, property: string): string | null {
  const match = html.match(
    new RegExp(`<meta property="${property}" content="([^"]*)"`)
  );
  return match ? decodeEntities(match[1]) : null;
}

export function parseGooglePlayApp(
  html: string
): { name: string; iconUrl: string } | null {
  const title = metaContent(html, "og:title");
  const iconUrl = metaContent(html, "og:image");
  if (!title || !iconUrl) return null;

  let name = title;
  for (const suffix of TITLE_SUFFIXES) {
    if (name.endsWith(suffix)) {
      name = name.slice(0, -suffix.length);
      break;
    }
  }

  return { name, iconUrl };
}

function storeUrl(packageId: string): string {
  return `https://play.google.com/store/apps/details?id=${packageId}`;
}

async function fetchGooglePlayApp(
  entry: GooglePlayEntry
): Promise<AppStoreApp | null> {
  try {
    const response = await fetch(`${storeUrl(entry.packageId)}&hl=ja`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      signal: AbortSignal.timeout(5000),
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      console.error(
        `Google Play page for ${entry.packageId} returned ${response.status}`
      );
      return null;
    }

    const parsed = parseGooglePlayApp(await response.text());
    if (!parsed) {
      console.error(`No OGP tags found for ${entry.packageId}`);
      return null;
    }

    return {
      name: parsed.name,
      url: storeUrl(entry.packageId),
      iconUrl: parsed.iconUrl,
      version: "",
      releaseDate: entry.releaseDate,
      platform: "android",
    };
  } catch (error) {
    console.error(`Failed to fetch Google Play app ${entry.packageId}:`, error);
    return null;
  }
}

export async function fetchGooglePlayApps(): Promise<AppStoreApp[]> {
  const apps = await Promise.all(GOOGLE_PLAY_APPS.map(fetchGooglePlayApp));
  return apps.filter((app): app is AppStoreApp => app !== null);
}

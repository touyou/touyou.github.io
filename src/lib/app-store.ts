// App Store app list, auto-collected from the iTunes Lookup API

export interface AppStoreApp {
  name: string;
  url: string;
  iconUrl: string;
  version: string;
  releaseDate: string;
}

const APPLE_DEVELOPER_ID = "1089595725";

interface ITunesLookupResult {
  wrapperType: string;
  trackName?: string;
  trackViewUrl?: string;
  artworkUrl512?: string;
  version?: string;
  currentVersionReleaseDate?: string;
}

export async function fetchAppStoreApps(): Promise<AppStoreApp[]> {
  try {
    // country is fixed to "jp" since the site targets a Japanese audience;
    // apps unavailable on the JP storefront won't show up here.
    //
    // Apple fronts this endpoint with Akamai, which caches responses for
    // up to ~24h (cache-control: max-age=85888) independent of our own
    // `next.revalidate` below. Bucketing the cache-busting param by hour
    // forces Akamai to treat each hour as a new URL, so a fresh app/version
    // shows up within our own revalidate window instead of Apple's.
    const cacheBust = Math.floor(Date.now() / 3_600_000);
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${APPLE_DEVELOPER_ID}&entity=software&country=jp&limit=200&_=${cacheBust}`,
      {
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) {
      console.error(`iTunes Lookup API returned ${response.status}`);
      return [];
    }

    const data: { results: ITunesLookupResult[] } = await response.json();

    return data.results
      .filter((r) => r.wrapperType === "software")
      .map((r) => ({
        name: r.trackName ?? "",
        url: r.trackViewUrl ?? "",
        iconUrl: r.artworkUrl512 ?? "",
        version: r.version ?? "",
        releaseDate: r.currentVersionReleaseDate ?? "",
      }))
      .filter((app) => app.name && app.url && app.iconUrl)
      .sort((a, b) => b.releaseDate.localeCompare(a.releaseDate));
  } catch (error) {
    console.error("Failed to fetch App Store apps:", error);
    return [];
  }
}

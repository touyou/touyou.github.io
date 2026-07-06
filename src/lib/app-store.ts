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
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${APPLE_DEVELOPER_ID}&entity=software&country=jp&limit=200`,
      {
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) return [];

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
  } catch {
    return [];
  }
}

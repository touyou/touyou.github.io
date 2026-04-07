// Mastodon/Fedibird API integration

export interface MastodonPost {
  id: string;
  url: string;
  content: string; // HTML content
  createdAt: string;
  reblog: boolean;
  mediaAttachments: {
    type: string;
    url: string;
    previewUrl: string;
    description: string | null;
  }[];
}

interface MastodonApiMediaAttachment {
  type: string;
  url: string;
  preview_url: string;
  description?: string;
}

interface MastodonApiStatus {
  id: string;
  url: string;
  content: string;
  created_at: string;
  reblog: unknown;
  media_attachments?: MastodonApiMediaAttachment[];
}

const FEDIBIRD_INSTANCE = "https://fedibird.com";
const FEDIBIRD_USERNAME = "touyou";

export async function fetchMastodonPosts(
  limit = 5
): Promise<MastodonPost[]> {
  try {
    // Lookup account by username
    const lookupRes = await fetch(
      `${FEDIBIRD_INSTANCE}/api/v1/accounts/lookup?acct=${FEDIBIRD_USERNAME}`,
      { next: { revalidate: 3600 } }
    );
    if (!lookupRes.ok) return [];

    const account = await lookupRes.json();
    const accountId: string = account.id;

    // Fetch recent statuses (exclude replies and boosts)
    const statusRes = await fetch(
      `${FEDIBIRD_INSTANCE}/api/v1/accounts/${accountId}/statuses?limit=${limit}&exclude_replies=true&exclude_reblogs=true`,
      { next: { revalidate: 3600 } }
    );
    if (!statusRes.ok) return [];

    const statuses: MastodonApiStatus[] = await statusRes.json();

    return statuses.map((s) => ({
      id: s.id,
      url: s.url,
      content: s.content,
      createdAt: s.created_at,
      reblog: !!s.reblog,
      mediaAttachments: (s.media_attachments ?? []).map(
        (m) => ({
          type: m.type,
          url: m.url,
          previewUrl: m.preview_url,
          description: m.description ?? null,
        })
      ),
    }));
  } catch {
    return [];
  }
}

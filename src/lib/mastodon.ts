// Mastodon/Fedibird API integration

export interface MastodonAccount {
  displayName: string;
  acct: string; // e.g. "touyou@fedibird.com"
  avatarStatic: string;
  url: string;
}

export interface MastodonCard {
  url: string;
  title: string;
  description: string;
  image: string | null;
  type: string; // "link" | "photo" | "video" | "rich"
}

export interface MastodonPost {
  id: string;
  url: string;
  content: string; // HTML content
  createdAt: string;
  reblog: boolean;
  account: MastodonAccount;
  card: MastodonCard | null;
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

interface MastodonApiCard {
  url: string;
  title: string;
  description: string;
  image?: string | null;
  type: string;
}

interface MastodonApiAccount {
  display_name: string;
  acct: string;
  avatar_static: string;
  url: string;
}

interface MastodonApiStatus {
  id: string;
  url: string;
  content: string;
  created_at: string;
  reblog: unknown;
  account: MastodonApiAccount;
  card?: MastodonApiCard | null;
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
      account: {
        displayName: s.account.display_name || s.account.acct,
        acct: s.account.acct.includes("@")
          ? s.account.acct
          : `${s.account.acct}@fedibird.com`,
        avatarStatic: s.account.avatar_static,
        url: s.account.url,
      },
      card: s.card
        ? {
            url: s.card.url,
            title: s.card.title,
            description: s.card.description,
            image: s.card.image ?? null,
            type: s.card.type,
          }
        : null,
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

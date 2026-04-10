// Client-side Mastodon API for load-more functionality
import type { MastodonPost } from "./mastodon";

const FEDIBIRD_INSTANCE = "https://fedibird.com";
const FEDIBIRD_USERNAME = "touyou";

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

function mapStatus(s: MastodonApiStatus): MastodonPost {
  return {
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
    mediaAttachments: (s.media_attachments ?? []).map((m) => ({
      type: m.type,
      url: m.url,
      previewUrl: m.preview_url,
      description: m.description ?? null,
    })),
  };
}

export async function fetchMastodonPostsClient(
  limit = 5,
  maxId?: string
): Promise<MastodonPost[]> {
  const lookupRes = await fetch(
    `${FEDIBIRD_INSTANCE}/api/v1/accounts/lookup?acct=${FEDIBIRD_USERNAME}`
  );
  if (!lookupRes.ok) return [];

  const account = await lookupRes.json();
  const accountId: string = account.id;

  const params = new URLSearchParams({
    limit: String(limit),
    exclude_replies: "true",
    exclude_reblogs: "true",
  });
  if (maxId) params.set("max_id", maxId);

  const statusRes = await fetch(
    `${FEDIBIRD_INSTANCE}/api/v1/accounts/${accountId}/statuses?${params}`
  );
  if (!statusRes.ok) return [];

  const statuses: MastodonApiStatus[] = await statusRes.json();
  return statuses.map(mapStatus);
}

// App Store Connect の「キャンペーン」に LP ごとのストア閲覧数と DL 数を出すための目印。
// pt はアカウント（提供元）で 1 つ、ct は 40 文字以内。Cookie も外部サービスも使わない
export const APP_STORE_PROVIDER_TOKEN = "118141122";

export function appStoreLink(
  base: string,
  campaign: string,
  extra: Record<string, string> = {},
): string {
  const url = new URL(base);
  for (const [key, value] of Object.entries(extra)) url.searchParams.set(key, value);
  url.searchParams.set("pt", APP_STORE_PROVIDER_TOKEN);
  url.searchParams.set("ct", campaign);
  url.searchParams.set("mt", "8");
  return url.toString();
}

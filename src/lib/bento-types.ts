// Bento page link data types

export type CardType = "social" | "ogp" | "simple" | "image";

export type SocialPlatform =
  | "twitter"
  | "github"
  | "youtube"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "threads"
  | "bluesky"
  | "fedibird"
  | "zenn"
  | "qiita"
  | "speakerdeck"
  | "gitlab"
  | "google"
  | "wantedly"
  | "hoyolab"
  | "hatena";

export interface BentoLink {
  url: string;
  title: string;
  cardType: CardType;
  platform?: SocialPlatform;
  username?: string; // for social cards
  imageSrc?: string; // for image cards
  span?: number; // grid column span (default: 1)
  aspectRatio?: string; // e.g., "1/1", "4/3", "16/9" for image cards
}

export interface BentoSection {
  id: string;
  title: string;
  links: BentoLink[];
}

export interface BentoProfile {
  name: string;
  avatar: string;
  bio: string[];
}

export interface BentoData {
  profile: BentoProfile;
  sections: BentoSection[];
}

// OGP data fetched dynamically
export interface OGPData {
  title: string;
  image: string | null;
  description?: string;
}

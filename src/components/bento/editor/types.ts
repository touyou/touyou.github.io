import type { CardType, SocialPlatform } from "@/lib/bento-types";

export type PreviewMode = "pc" | "sp";

export type ItemKind = "link" | "youtube";

export interface DragState {
  type: ItemKind;
  sectionId: string;
  itemIndex: number;
}

export type EditingState =
  | { type: "link"; sectionId: string; linkIndex: number }
  | { type: "youtube"; sectionId: string; videoIndex: number }
  | null;

export interface SaveMessage {
  type: "success" | "error";
  text: string;
}

export const cardTypeOptions: { value: CardType; label: string }[] = [
  { value: "social", label: "Social" },
  { value: "ogp", label: "OGP" },
  { value: "image", label: "Image" },
  { value: "simple", label: "Simple" },
];

export const platformOptions: { value: SocialPlatform; label: string }[] = [
  { value: "twitter", label: "Twitter" },
  { value: "github", label: "GitHub" },
  { value: "devnull", label: "/dev/null" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "threads", label: "Threads" },
  { value: "bluesky", label: "Bluesky" },
  { value: "fedibird", label: "Fedibird" },
  { value: "zenn", label: "Zenn" },
  { value: "qiita", label: "Qiita" },
  { value: "speakerdeck", label: "SpeakerDeck" },
  { value: "gitlab", label: "GitLab" },
  { value: "google", label: "Google" },
  { value: "wantedly", label: "Wantedly" },
  { value: "hoyolab", label: "HoYoLAB" },
  { value: "hatena", label: "Hatena" },
  { value: "lapras", label: "Lapras" },
  { value: "gmark", label: "GOOD DESIGN AWARD" },
];

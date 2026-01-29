import type { SocialPlatform } from "./bento-types";

// Check if URL is YouTube
export function isYouTubeUrl(url: string): boolean {
  return url.includes("youtube.com") || url.includes("youtu.be");
}

// Get favicon URL from domain using Google's favicon service
export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

// Platform hover colors
export const platformColors: Record<SocialPlatform, string> = {
  twitter: "hover:bg-gray-900",
  github: "hover:bg-gray-800",
  youtube: "hover:bg-red-500",
  linkedin: "hover:bg-blue-600",
  instagram:
    "hover:bg-gradient-to-tr hover:from-amber-400 hover:via-pink-500 hover:to-purple-600",
  facebook: "hover:bg-blue-500",
  threads: "hover:bg-gray-900",
  bluesky: "hover:bg-sky-500",
  fedibird: "hover:bg-indigo-500",
  zenn: "hover:bg-sky-400",
  qiita: "hover:bg-green-500",
  speakerdeck: "hover:bg-teal-600",
  gitlab: "hover:bg-orange-500",
  google: "hover:bg-blue-500",
  wantedly: "hover:bg-cyan-500",
  hoyolab: "hover:bg-blue-400",
  hatena: "hover:bg-sky-500",
};

// Base card styles
export const cardBase =
  "bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 overflow-hidden";

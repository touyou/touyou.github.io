import { cn } from "@/lib/utils";

/**
 * 月屏風のアイコン。アプリ側は ByobuRenderer で描いた金地・銀の月・すすきを使うが、
 * ここでは同じ構図を SVG で起こしている（アイコンの PNG を Web 側に持ち込まずに済ませるため）。
 */
export function TsukibyobuIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-[22.5%] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
        className,
      )}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full" role="img" aria-label="月屏風のアイコン">
        <rect width="64" height="64" fill="#b68c3c" />
        <rect width="64" height="64" fill="url(#byobu-haku)" />
        <circle cx="40" cy="22" r="11" fill="#cfd3d6" />
        <circle cx="40" cy="22" r="11" fill="none" stroke="#6b6f74" strokeWidth="0.8" />
        <g stroke="#3b4a52" strokeWidth="1.1" strokeLinecap="round" fill="none">
          <path d="M14 60 C 15 48, 13 40, 10 34" />
          <path d="M22 60 C 22 47, 24 39, 29 33" />
          <path d="M30 60 C 29 50, 30 44, 33 39" />
        </g>
        <defs>
          <linearGradient id="byobu-haku" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d7ab57" stopOpacity="0.55" />
            <stop offset="0.5" stopColor="#8f6a28" stopOpacity="0.15" />
            <stop offset="1" stopColor="#e6c478" stopOpacity="0.5" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
}

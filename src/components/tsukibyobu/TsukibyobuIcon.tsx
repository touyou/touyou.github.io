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
      {/* 24px 程度まで縮むので、線は太めにして埋もれないようにする */}
      <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true" focusable="false">
        <rect width="64" height="64" fill="#b68c3c" />
        <rect width="64" height="64" fill="url(#byobu-haku)" />
        <circle cx="40" cy="22" r="13" fill="#cfd3d6" stroke="#5d6267" strokeWidth="1.6" />
        <g stroke="#2f3c44" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M13 62 C 14 48, 11 40, 7 33" />
          <path d="M23 62 C 23 46, 26 38, 32 31" />
          <path d="M33 62 C 32 50, 33 44, 37 38" />
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

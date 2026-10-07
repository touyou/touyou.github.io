import { cn } from "@/lib/utils";

/** アプリアイコン（Toreta/AppIcon.icon の 2 枚のカード）を Web 用に平面で描き直したもの */
export function ToretaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" className={cn("rounded-[22.5%] shadow-lg", className)} role="img" aria-label="Toreta のアイコン">
      <defs>
        <linearGradient id="toreta-icon-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5A8BF7" />
          <stop offset="1" stopColor="#2F6BF2" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" fill="url(#toreta-icon-bg)" />
      <g transform="rotate(-14 512 512)" opacity="0.75">
        <rect x="300" y="222" width="400" height="560" rx="44" fill="#FFFFFF" />
      </g>
      <g transform="rotate(9 512 512) translate(40 24)">
        <rect x="300" y="222" width="400" height="560" rx="44" fill="#FFFFFF" />
        <rect x="336" y="300" width="328" height="300" rx="22" fill="#2F6BF2" fillOpacity="0.85" />
        <rect x="336" y="632" width="200" height="34" rx="17" fill="#2F6BF2" fillOpacity="0.55" />
        <rect x="336" y="688" width="136" height="34" rx="17" fill="#2F6BF2" fillOpacity="0.35" />
      </g>
    </svg>
  );
}

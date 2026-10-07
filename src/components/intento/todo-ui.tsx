import { cn } from "@/lib/utils";

/** アプリの一覧の行を HTML で描き直すための小さな部品。色は iOS のシステムカラーに合わせる */

export const SYSTEM_BLUE = "#0A84FF";
export const SYSTEM_GREEN = "#34C759";
export const STAR_GOLD = "#FFC400";

export function CheckCircle({ done, className }: { done: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-300",
        done ? "border-transparent" : "border-[#8E939B]",
        className,
      )}
      style={done ? { background: SYSTEM_GREEN } : undefined}
    >
      <svg viewBox="0 0 24 24" className={cn("h-3/5 w-3/5 transition-transform duration-300", done ? "scale-100" : "scale-0")} aria-hidden>
        <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Star({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("shrink-0 transition-transform duration-300", filled && "scale-110", className)} aria-hidden>
      <path
        d="M12 3.2l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.5l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7z"
        fill={filled ? STAR_GOLD : "none"}
        stroke={filled ? STAR_GOLD : "#8E939B"}
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CalendarGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={cn("shrink-0", className)} aria-hidden>
      <rect x="2" y="3" width="12" height="11" rx="2" fill="none" stroke="currentColor" strokeWidth={1.2} />
      <path d="M2 6.5h12" stroke="currentColor" strokeWidth={1.2} />
    </svg>
  );
}

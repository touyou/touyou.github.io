import { cn } from "@/lib/utils";

import type { DummyCard } from "./dummy-cards";

/** 架空のカード 1 枚。画像は使わず CSS だけで描く */
export function TradingCard({ card, size = "sm", className }: { card: DummyCard; size?: "sm" | "lg"; className?: string }) {
  const large = size === "lg";
  return (
    <div
      className={cn(
        "relative flex aspect-[5/7] flex-col overflow-hidden text-white shadow-sm",
        large ? "rounded-2xl p-4" : "rounded-[7px] p-[5px]",
        card.owned === 0 && !large && "opacity-40 grayscale",
        className,
      )}
      style={{ background: `linear-gradient(155deg, ${card.colors[0]}, ${card.colors[1]})` }}
    >
      <div className={cn("flex items-center justify-between font-bold leading-none", large ? "text-base" : "text-[7px]")}>
        <span>{card.number}</span>
        <span>{card.rarity}</span>
      </div>
      <div
        className={cn(
          "relative flex-1 overflow-hidden bg-white/25",
          large ? "my-3 rounded-xl" : "my-[3px] rounded-[3px]",
        )}
      >
        {/* 絵柄の代わりの抽象的な模様 */}
        <div className="absolute -right-1/4 -top-1/4 aspect-square w-3/4 rounded-full bg-white/30" />
        <div className="absolute -bottom-1/3 -left-1/4 aspect-square w-full rounded-full bg-white/15" />
        <svg viewBox="0 0 24 24" className="absolute left-1/2 top-1/2 w-1/3 -translate-x-1/2 -translate-y-1/2 fill-white/80" aria-hidden>
          <path d="M12 2l2.6 6.6L21 9.3l-5 4.6 1.4 6.9L12 17.3 6.6 20.8 8 13.9 3 9.3l6.4-.7z" />
        </svg>
      </div>
      <div className={cn("truncate text-center font-bold leading-none", large ? "text-lg" : "text-[7px]")}>{card.name}</div>
    </div>
  );
}

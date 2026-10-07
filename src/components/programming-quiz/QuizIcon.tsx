import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * アプリアイコン。QuizLiT/AppIcon.icon の前景（ワードマーク）を、アイコンと同じ薄いグレーの地に載せる。
 * 素材はワードマークが左下に寄っているので、Icon Composer の translation-in-points [86.5, -58.83]（1024pt 基準）と同じだけ右上へずらす。
 * Icon Composer のガラスや影までは再現しない。
 */
export function QuizIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative block overflow-hidden rounded-[22.5%] bg-[#F2F2F7] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5", className)}
    >
      <Image
        src="/programming-quiz/icon-foreground.png"
        alt="Programming Quiz のアイコン"
        fill
        sizes="128px"
        className="translate-x-[8.45%] translate-y-[-5.75%] object-contain"
      />
    </span>
  );
}

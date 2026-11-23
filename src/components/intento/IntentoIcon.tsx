import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * アプリアイコン。IntentTodo/AppIcon-Assets の前景（チェック・行・星）を、アイコンと同じ薄いグレーの地に載せる。
 * Icon Composer のガラスや影までは再現しない。
 */
export function IntentoIcon({ className, alt = "Intento のアイコン" }: { className?: string; alt?: string }) {
  return (
    <span
      className={cn("relative block overflow-hidden rounded-[22.5%] bg-[#F2F2F7] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5", className)}
    >
      <Image src="/intento/icon-foreground.png" alt={alt} fill sizes="128px" className="object-contain" />
    </span>
  );
}

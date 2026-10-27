import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * 月屏風のアプリアイコン。アプリと同じ画像(ByobuRenderer の --icon light で描いた 1024px を 512px に縮めたもの)をそのまま使う。
 */
export function TsukibyobuIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative block overflow-hidden rounded-[22.5%] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
        className,
      )}
    >
      <Image src="/tsukibyobu/icon.png" alt="月屏風のアイコン" fill sizes="128px" className="object-cover" />
    </span>
  );
}

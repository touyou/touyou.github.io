import Image from "next/image";

import { cn } from "@/lib/utils";

/** 月屏風のアプリアイコン。ByobuRenderer で書き出したアプリと同じ 1024px の画像を縮めて使う */
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

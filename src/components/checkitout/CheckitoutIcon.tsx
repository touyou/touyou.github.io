import Image from "next/image";

import { cn } from "@/lib/utils";

/** アプリアイコン（CheckItOut の AppIcon.appiconset の 1024px を 512px に縮めたもの）。角丸は iOS のアイコンに近づける */
export function CheckitoutIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative block overflow-hidden rounded-[22.5%] bg-black shadow-[0_8px_24px_rgba(0,0,0,0.18)]", className)}>
      <Image src="/checkitout/icon.png" alt="チェケラのアイコン" fill sizes="128px" className="object-cover" />
    </span>
  );
}

import Image from "next/image";

import { cn } from "@/lib/utils";

/** アプリアイコン（FFMultiply/resource/ffmultiicon2.png を 512px に縮めたもの） */
export function FFIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative block overflow-hidden rounded-[22.5%] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ring-1 ring-black/5", className)}>
      <Image src="/ffmultiplier/icon.png" alt="FFMultiplier のアイコン" fill sizes="128px" className="object-cover" />
    </span>
  );
}

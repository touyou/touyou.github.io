import Image from "next/image";

import { cn } from "@/lib/utils";

/** Patchday のアプリアイコン（アプリの AppIcon-1024.png を 256px に縮めたもの） */
export function PatchdayIcon({ className, alt = "Patchday のアイコン" }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/patchday/icon.png"
      alt={alt}
      width={256}
      height={256}
      className={cn("rounded-[22.5%] shadow-lg", className)}
    />
  );
}

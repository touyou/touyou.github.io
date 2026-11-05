import Image from "next/image";

import { cn } from "@/lib/utils";

/** Patchday のアプリアイコン（アプリの AppIcon-1024.png を 256px に縮めたもの） */
export function PatchdayIcon({ className }: { className?: string }) {
  return (
    <Image
      src="/patchday/icon.png"
      alt="Patchday のアイコン"
      width={256}
      height={256}
      className={cn("rounded-[22.5%] shadow-lg", className)}
    />
  );
}

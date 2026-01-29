import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

export function YouTubeEmbedSkeleton() {
  return (
    <div className={`${cardBase} col-span-2`}>
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

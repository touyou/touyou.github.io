import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

export function OGPCardSkeleton() {
  return (
    <div className={`${cardBase} flex flex-col col-span-2`}>
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function OGPSectionSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <OGPCardSkeleton key={index} />
      ))}
    </>
  );
}

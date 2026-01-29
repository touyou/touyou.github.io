import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

function YouTubeCardSkeleton() {
  return (
    <div className={`${cardBase} col-span-2`}>
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function YouTubeSectionSkeleton() {
  return (
    <>
      {/* Section Header Skeleton */}
      <div className="col-span-2 md:col-span-4 flex items-center justify-between mt-6 px-1">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:contents">
        {Array.from({ length: 2 }).map((_, index) => (
          <YouTubeCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="col-span-2 md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="min-w-[320px] snap-start">
              <YouTubeCardSkeleton />
            </div>
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

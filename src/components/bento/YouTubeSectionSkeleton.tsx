import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

function YouTubeCardSkeleton() {
  return (
    <div className={cardBase}>
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4">
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function YouTubeSectionSkeleton() {
  return (
    <section>
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between px-1 mb-3">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 gap-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <YouTubeCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="min-w-[320px] snap-start">
              <YouTubeCardSkeleton />
            </div>
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

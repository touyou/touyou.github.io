import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

function MastodonCardSkeleton() {
  return (
    <div className={`${cardBase} flex flex-col min-w-[280px] md:min-w-0`}>
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
        <Skeleton className="h-3 w-20 mt-2" />
      </div>
    </div>
  );
}

export function MastodonSectionSkeleton() {
  return (
    <section>
      {/* Section Header Skeleton */}
      <div className="flex items-center justify-between px-1 mb-3">
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MastodonCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {Array.from({ length: 3 }).map((_, index) => (
            <MastodonCardSkeleton key={index} />
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

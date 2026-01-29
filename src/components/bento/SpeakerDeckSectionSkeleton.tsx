import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

function SpeakerDeckCardSkeleton() {
  return (
    <div
      className={`${cardBase} flex flex-col min-w-[280px] md:min-w-0 md:col-span-2 snap-start`}
    >
      <Skeleton className="w-full aspect-video rounded-none" />
      <div className="p-4 flex-1 flex flex-col">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-2" />
        <Skeleton className="h-3 w-20 mt-auto" />
      </div>
    </div>
  );
}

export function SpeakerDeckSectionSkeleton() {
  return (
    <>
      {/* Section Header Skeleton */}
      <div className="col-span-2 md:col-span-4 flex items-center justify-between mt-6 px-1">
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:contents">
        {Array.from({ length: 4 }).map((_, index) => (
          <SpeakerDeckCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile Horizontal Scroll Carousel */}
      <div className="col-span-2 md:hidden -mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 snap-x snap-mandatory scroll-pl-4 scroll-pr-4 scrollbar-hide">
          {Array.from({ length: 4 }).map((_, index) => (
            <SpeakerDeckCardSkeleton key={index} />
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

function MastodonCardSkeleton() {
  return (
    <div className="min-w-[300px] md:min-w-0 bg-[#1f2b3e] rounded-xl border border-[#2e3a4e] overflow-hidden">
      <div className="p-4 flex flex-col gap-3">
        {/* Account header skeleton */}
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full flex-shrink-0 bg-[#2e3a4e]" />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3.5 w-28 bg-[#2e3a4e]" />
            <Skeleton className="h-3 w-36 bg-[#2e3a4e]" />
          </div>
        </div>
        {/* Post content skeleton */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full bg-[#2e3a4e]" />
          <Skeleton className="h-3.5 w-5/6 bg-[#2e3a4e]" />
          <Skeleton className="h-3.5 w-4/6 bg-[#2e3a4e]" />
        </div>
        {/* Timestamp skeleton */}
        <Skeleton className="h-3 w-24 bg-[#2e3a4e]" />
      </div>
    </div>
  );
}

export function MastodonSectionSkeleton() {
  return (
    <section>
      {/* Section Header Skeleton */}
      <div className="flex items-center gap-2 px-1 mb-3">
        <Skeleton className="h-4 w-4 rounded bg-gray-200" />
        <Skeleton className="h-4 w-28 bg-gray-200" />
      </div>

      {/* Desktop: stacked column */}
      <div className="hidden md:flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <MastodonCardSkeleton key={index} />
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
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

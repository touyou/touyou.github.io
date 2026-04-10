import { Skeleton } from "@/components/ui/skeleton";

function MastodonCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div className={compact
      ? "bg-white overflow-hidden"
      : "min-w-[300px] bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden"
    }>
      <div className={`flex flex-col gap-3 ${compact ? "p-3" : "p-4"}`}>
        <div className="flex items-center gap-3">
          <Skeleton className={`rounded-full flex-shrink-0 ${compact ? "w-8 h-8" : "w-10 h-10"}`} />
          <div className="flex flex-col gap-1.5 flex-1">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
          <Skeleton className="h-3.5 w-4/6" />
        </div>
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}

export function MastodonSectionSkeleton({ layout = "carousel" }: { layout?: "sidebar" | "carousel" }) {
  if (layout === "sidebar") {
    return (
      <div className="bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="px-4 py-3 border-b border-gray-100">
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="flex-1 flex flex-col divide-y divide-gray-100">
          {Array.from({ length: 3 }).map((_, index) => (
            <MastodonCardSkeleton key={index} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <div className="px-1 mb-3">
        <Skeleton className="h-4 w-28" />
      </div>
      <div className="-mx-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-4 no-scrollbar">
          {Array.from({ length: 3 }).map((_, index) => (
            <MastodonCardSkeleton key={index} />
          ))}
          <div className="shrink-0 w-px" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

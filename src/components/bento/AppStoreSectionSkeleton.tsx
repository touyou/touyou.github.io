import { Skeleton } from "@/components/ui/skeleton";
import { cardBase } from "@/lib/bento-utils";

export function AppStoreSectionSkeleton() {
  return (
    <section>
      <div className="px-1 mb-3">
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className={`${cardBase} aspect-square`}>
            <Skeleton className="w-full h-full rounded-none" />
          </div>
        ))}
      </div>
    </section>
  );
}

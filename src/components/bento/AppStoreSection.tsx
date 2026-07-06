import Image from "next/image";
import type { AppStoreApp } from "@/lib/app-store";
import { cardBase } from "@/lib/bento-utils";
import { SectionHeader } from "@/components/bento/SectionHeader";

interface AppStoreSectionProps {
  apps: AppStoreApp[];
  title?: string;
}

export function AppStoreSection({ apps, title }: AppStoreSectionProps) {
  if (apps.length === 0) return null;

  return (
    <section>
      {title && <SectionHeader>{title}</SectionHeader>}
      <div className="grid grid-cols-3 gap-3">
        {apps.map((app) => (
          <a
            key={app.url}
            href={app.url}
            target="_blank"
            rel="noreferrer"
            className={`${cardBase} relative aspect-square group`}
          >
            <Image
              src={app.iconUrl}
              alt=""
              fill
              sizes="(min-width: 768px) 33vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-2 px-2">
              <p className="text-white text-xs font-medium text-center line-clamp-2 drop-shadow">
                {app.name}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

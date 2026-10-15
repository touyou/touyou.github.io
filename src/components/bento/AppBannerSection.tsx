import { SectionHeader } from "@/components/bento/SectionHeader";
import { AppBannerCard, AppCarousel } from "@/components/home/AppCarousel";
import { appBanners } from "@/components/home/app-banners";

/** YouTube 欄と同じく、PC はグリッド、スマホはトップページと同じ横スクロールで並べる */
export function AppBannerSection({ title }: { title?: string }) {
  return (
    <section>
      {title && <SectionHeader>{title}</SectionHeader>}
      <div className="hidden grid-cols-2 gap-3 md:grid lg:grid-cols-3">
        {appBanners.map((app) => (
          <AppBannerCard key={app.id} app={app} className="aspect-[8/5] w-full" />
        ))}
      </div>
      <div className="md:hidden">
        <AppCarousel compact />
      </div>
    </section>
  );
}

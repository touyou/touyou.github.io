import { SectionHeader } from "@/components/bento/SectionHeader";
import { AppBannerCard } from "@/components/home/AppCarousel";
import { appBanners } from "@/components/home/app-banners";

/** トップページのカルーセルと同じ絵のカードで、各アプリの紹介ページへ案内する */
export function AppBannerSection({ title }: { title?: string }) {
  return (
    <section>
      {title && <SectionHeader>{title}</SectionHeader>}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {appBanners.map((app) => (
          <AppBannerCard key={app.id} app={app} className="aspect-[8/5] w-full" />
        ))}
      </div>
    </section>
  );
}

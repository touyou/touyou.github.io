import { SectionHeader } from "@/components/bento/SectionHeader";
import { AppCarousel } from "@/components/home/AppCarousel";

/** トップページと同じカルーセルで、各アプリの紹介ページへ案内する */
export function AppBannerSection({ title }: { title?: string }) {
  return (
    <section>
      {title && <SectionHeader>{title}</SectionHeader>}
      <AppCarousel compact />
    </section>
  );
}

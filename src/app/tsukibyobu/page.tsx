import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Phrases } from "@/components/app-lp";
import { TsukibyobuIcon } from "@/components/tsukibyobu/TsukibyobuIcon";
import { cn } from "@/lib/utils";

/**
 * 月屏風（Tsukibyobu リポジトリの iPhone アプリ）の紹介ページ。
 * 見た目はアプリに合わせる（夜の紺の地、金箔の線、明朝）。Apple の製品ページ風の app-lp の帯は使わない。
 * 文言は App Store の説明文（Tsukibyobu/metadata/ios/version/<バージョン>/ja.json）に合わせ、絵はすべて byobu-render で書き出したアプリと同じ画素を使う。
 */

const APP_STORE_URL = "https://apps.apple.com/jp/app/id6826440511";
const SUPPORT_URL = "/tsukibyobu/support";
const PRIVACY_URL = "/tsukibyobu/privacy";

const GOLD = "#C9A55A";

export const metadata: Metadata = {
  title: "月屏風 — 満ちては欠ける、てのひらの屏風",
  description:
    "閉じれば朔、ひらけば望。折りたたみの iPhone をひらく角度が、そのまま月の満ち欠けになる屏風絵のアプリ。通知も、広告も、ログインもありません。",
  // 紹介画像は public/og/tsukibyobu.png（byobu-render で書き出した 1200×630）
  openGraph: {
    title: "月屏風",
    description: "満ちては欠ける、てのひらの屏風。",
    url: "https://www.touyou.dev/tsukibyobu",
    siteName: "touyou.dev",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "https://www.touyou.dev/og/tsukibyobu.png", width: 1200, height: 630, alt: "月屏風の紹介画像" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "月屏風",
    description: "満ちては欠ける、てのひらの屏風。",
    images: ["https://www.touyou.dev/og/tsukibyobu.png"],
  },
};

const places = [
  { src: "/tsukibyobu/places/fuji-autumn.jpg", name: "富士と湖", note: "秋" },
  { src: "/tsukibyobu/places/higashiyama-spring.jpg", name: "東山", note: "春" },
  { src: "/tsukibyobu/places/matsubara-winter.jpg", name: "松原", note: "冬" },
  { src: "/tsukibyobu/seasons/yamazato-autumn.jpg", name: "山里", note: "秋" },
];

const seasons = [
  { src: "/tsukibyobu/seasons/yamazato-spring.jpg", name: "春", note: "梅" },
  { src: "/tsukibyobu/seasons/yamazato-summer.jpg", name: "夏", note: "燕子花" },
  { src: "/tsukibyobu/seasons/yamazato-autumn.jpg", name: "秋", note: "すすき" },
  { src: "/tsukibyobu/seasons/yamazato-winter.jpg", name: "冬", note: "雪をかぶった笹" },
];

/** 月齢の移り変わりを、朔から望まで 8 つの丸で見せる。lit は右から照らされる割合 */
function MoonPhases() {
  const phases = [0, 0.12, 0.3, 0.5, 0.65, 0.8, 0.92, 1];
  return (
    <ol role="img" aria-label="朔から望までの月の満ち欠け" className="flex items-center gap-3 sm:gap-4">
      {phases.map((lit) => (
        <li key={lit}>
          <svg viewBox="0 0 20 20" className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="#1b1d2c" stroke="#3a3d52" strokeWidth="0.8" />
            {lit > 0 && (
              <path
                d={moonPath(lit)}
                fill="#E4E2DA"
              />
            )}
          </svg>
        </li>
      ))}
    </ol>
  );
}

/** 右側が照らされた月の形。lit が 0.5 で上弦、1 で望 */
function moonPath(lit: number) {
  const r = 9;
  const bulge = Math.abs(1 - 2 * lit) * r;
  const sweep = lit < 0.5 ? 0 : 1;
  return `M10 1 A${r} ${r} 0 0 1 10 19 A${bulge} ${r} 0 0 ${sweep} 10 1Z`;
}

function Section({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn("mx-auto flex w-full max-w-5xl flex-col gap-12 px-6 py-24 sm:py-32", className)}>{children}</section>
  );
}

function Heading({ title, children }: { title: string[]; children?: ReactNode }) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
      <h2 className="text-[clamp(26px,4.6vw,42px)] font-semibold leading-[1.4] tracking-[0.04em]">
        <Phrases phrases={title} />
      </h2>
      {children && <p className="text-[clamp(15px,1.9vw,18px)] leading-[2] text-[#B9B6C8]">{children}</p>}
    </div>
  );
}

/** 金の細い線。屏風の縁の金具のように、章の区切りに置く */
function GoldRule() {
  return <span aria-hidden="true" className="mx-auto block h-px w-16" style={{ background: GOLD }} />;
}

function StoreLink({ size = "lg" }: { size?: "sm" | "lg" }) {
  return (
    <a
      href={APP_STORE_URL}
      className={cn(
        "rounded-full font-medium text-[#0b0c18] transition hover:brightness-110",
        size === "lg" ? "px-7 py-3 text-[17px]" : "px-3 py-1 text-[12px]",
      )}
      style={{ background: GOLD }}
    >
      {size === "lg" ? "App Store で入手" : "入手"}
    </a>
  );
}

function Painting({ src, alt, name, note }: { src: string; alt: string; name: string; note: string }) {
  return (
    <figure className="flex flex-col gap-3">
      <Image src={src} alt={alt} width={1200} height={844} className="w-full" sizes="(min-width: 640px) 480px, 100vw" />
      <figcaption className="flex items-baseline gap-3 px-1">
        <span className="text-lg tracking-[0.08em]">{name}</span>
        <span className="text-[13px] text-[#8E8BA0]">{note}</span>
      </figcaption>
    </figure>
  );
}

export default function TsukibyobuPage() {
  return (
    <div className="min-h-screen bg-[#0B0C18] font-['Hiragino_Mincho_ProN','Yu_Mincho','YuMincho','Noto_Serif_JP',serif] text-[#ECE9DF] antialiased [word-break:auto-phrase]">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0B0C18]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 w-full max-w-5xl items-center justify-between px-6">
          <a href="/tsukibyobu" className="flex items-center gap-2 text-[15px] tracking-[0.08em]">
            <TsukibyobuIcon className="h-6 w-6 shadow-none" />
            月屏風
          </a>
          <nav className="flex items-center gap-5 text-[13px] text-[#B9B6C8]">
            <a href={SUPPORT_URL} className="hidden hover:text-white sm:inline">
              サポート
            </a>
            <a href={PRIVACY_URL} className="hidden hover:text-white sm:inline">
              プライバシー
            </a>
            <StoreLink size="sm" />
          </nav>
        </div>
      </header>

      <main className="flex flex-col">
        {/* ヒーロー */}
        <section className="flex flex-col items-center gap-14 px-6 pb-20 pt-16 text-center sm:pt-24">
          <div className="flex flex-col items-center gap-6">
            <TsukibyobuIcon className="h-24 w-24 sm:h-28 sm:w-28" />
            <div className="flex flex-col items-center gap-5">
              <p className="text-lg tracking-[0.3em] text-[#B9B6C8]">月屏風</p>
              <h1 className="text-[clamp(30px,6.4vw,56px)] font-semibold leading-[1.45] tracking-[0.04em]">
                <Phrases phrases={["満ちては欠ける、"]} />
                <br />
                <Phrases phrases={["てのひらの屏風。"]} />
              </h1>
              <p className="text-[clamp(16px,2vw,20px)] tracking-[0.12em] text-[#B9B6C8]">閉じれば朔、ひらけば望。</p>
            </div>
            <MoonPhases />
            <div className="flex flex-col items-center gap-3">
              <StoreLink />
              <span className="font-sans text-[13px] text-[#8E8BA0]">無料・「音の箱」は買い切り</span>
            </div>
          </div>
          <Image
            src="/tsukibyobu/hero-duo-open.webp"
            alt="ひらいた iPhone Duo に、富士と湖の秋の屏風絵と満ちかけた月"
            width={2400}
            height={1743}
            priority
            className="w-full max-w-4xl"
            sizes="(min-width: 1024px) 896px, 100vw"
          />
        </section>

        <GoldRule />

        <Section>
          <Heading title={["ひらく角度が、", "そのまま月に。"]}>
            折りたたみの iPhone では、ひらく角度がそのまま月の満ち欠けになります。少しひらけば三日月が、半ばで上弦が、まっすぐ広げれば望月がのぼります。閉じれば朔。星がいちばん多い夜になります。
          </Heading>
          <div className="mx-auto grid w-full max-w-3xl grid-cols-[2fr_3fr] items-end gap-6 sm:gap-10">
            <figure className="flex flex-col gap-3">
              <Image
                src="/tsukibyobu/duo-closed.webp"
                alt="閉じた iPhone Duo。外の画面の月は地球照で輪郭だけが見える"
                width={1200}
                height={1672}
                className="w-full"
                sizes="(min-width: 640px) 290px, 40vw"
              />
              <figcaption className="text-center text-[13px] tracking-[0.1em] text-[#8E8BA0]">閉じれば、朔</figcaption>
            </figure>
            <figure className="flex flex-col gap-3">
              <Image
                src="/tsukibyobu/duo-open-full.webp"
                alt="まっすぐひらいた iPhone Duo に、望月がのぼる"
                width={2400}
                height={1743}
                className="w-full"
                sizes="(min-width: 640px) 440px, 60vw"
              />
              <figcaption className="text-center text-[13px] tracking-[0.1em] text-[#8E8BA0]">ひらけば、望</figcaption>
            </figure>
          </div>
          <p className="mx-auto max-w-2xl text-center text-[15px] leading-[2] text-[#B9B6C8]">
            半分ひらいて机に立てれば、二枚の画面が二曲の屏風になります。折りたたみでない iPhone では、画面の下のスライダーで月をひらきます。
          </p>
        </Section>

        <GoldRule />

        <Section>
          <Heading title={["黒漆の床に、", "夜がうつる。"]}>
            屏風を床に立てました。縦長の画面では屏風の下に黒漆の床がのび、夜の絵がほのかに映ります。足もとはくっきりと、離れるほど淡く。iPhone Duo を横に持てば、上の画面に屏風、下の画面に床。ひらき具合で映り方が変わります。
          </Heading>
          <div className="mx-auto grid w-full max-w-3xl grid-cols-[46fr_73fr] items-end gap-6 sm:gap-10">
            <figure className="flex flex-col gap-3">
              {/* iPhone の端末枠の画像は無いので、角丸の縁だけを CSS で付ける */}
              <div className="overflow-hidden rounded-[22px] border-[5px] border-[#26252c] bg-black sm:rounded-[34px] sm:border-[7px]">
                <Image
                  src="/tsukibyobu/iphone-portrait-floor.webp"
                  alt="縦向きの iPhone。富士と湖の秋の屏風の下に黒漆の床がのび、絵が淡く映る"
                  width={1320}
                  height={2868}
                  className="w-full"
                  sizes="(min-width: 640px) 270px, 38vw"
                />
              </div>
              <figcaption className="text-center text-[13px] tracking-[0.1em] text-[#8E8BA0]">縦の iPhone</figcaption>
            </figure>
            <figure className="flex flex-col gap-3">
              <Image
                src="/tsukibyobu/duo-landscape-floor.webp"
                alt="横に持った iPhone Duo。上の画面に富士と湖の屏風、下の画面の黒漆の床にその絵が映る"
                width={2600}
                height={3578}
                className="w-full"
                sizes="(min-width: 640px) 440px, 60vw"
              />
              <figcaption className="text-center text-[13px] tracking-[0.1em] text-[#8E8BA0]">横に持った Duo</figcaption>
            </figure>
          </div>
          <p className="mx-auto max-w-2xl text-center text-[15px] leading-[2] text-[#B9B6C8]">
            眺めているあいだは、ボタンが静かに溶けて消えます。月のほかに触れれば戻ります。
          </p>
        </Section>

        <GoldRule />

        <Section>
          <Heading title={["金の霞に、", "銀の月。"]}>
            絵は琳派の屏風に倣いました。くすんだ金箔の霞、群青と緑青の山、銀箔の月、夜空に散らした金砂子。景色は四つから選べます。
          </Heading>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {places.map((p) => (
              <Painting key={p.src} src={p.src} alt={`${p.name}の屏風絵（${p.note}）`} name={p.name} note={p.note} />
            ))}
          </div>
        </Section>

        <GoldRule />

        <Section>
          <Heading title={["梅に燕子花、", "すすきに雪の笹。"]}>
            季節ごとに、手前に描かれる草木が変わります。はじめは今の季節が選ばれています。
          </Heading>
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2">
            {seasons.map((s) => (
              <Painting key={s.src} src={s.src} alt={`山里の${s.name}。手前に${s.note}`} name={s.name} note={s.note} />
            ))}
          </div>
        </Section>

        <GoldRule />

        <Section>
          <Heading title={["なにもしない、", "月見の夜。"]}>
            月に触れると、その夜の月にちなんだ話をひとつ。音を入れれば、箏のような音がかすかに鳴ります。音階は季節ごとに変わり、春は明るく、冬は静かに。買い切りの「音の箱」を開ければ、湖の水音や東山の鐘といった場所の音と、笙・尺八の音色も選べます。置いて、眺めて、閉じれば夜が終わります。
          </Heading>
          <ul className="grid gap-4 font-sans sm:grid-cols-3">
            {[
              ["通知も広告もなし", "知らせが鳴ることも、広告が出ることもありません。"],
              ["ログインなし", "アカウント登録はありません。開いたらすぐに夜です。"],
              ["端末の中だけで", "絵も音も端末の中で描き、通信はしません。集めるデータもありません。"],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-2 rounded-[20px] border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-[17px] font-semibold">{title}</h3>
                <p className="text-[14px] leading-[1.9] text-[#B9B6C8]">{body}</p>
              </li>
            ))}
          </ul>
          <a href={PRIVACY_URL} className="self-center font-sans text-[15px] hover:underline" style={{ color: GOLD }}>
            プライバシーポリシー ›
          </a>
        </Section>

        <section className="flex flex-col items-center gap-6 border-t border-white/5 px-6 py-24 text-center">
          <TsukibyobuIcon className="h-20 w-20" />
          <h2 className="text-[clamp(26px,4.6vw,38px)] font-semibold tracking-[0.06em]">月屏風は無料です。</h2>
          <StoreLink />
          <span className="font-sans text-[13px] text-[#8E8BA0]">iOS 27 以降の iPhone。ひらく角度を読むのは iOS 27.1 以降の iPhone Duo です。</span>
        </section>
      </main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-8 font-sans text-xs leading-[1.8] text-[#8E8BA0]">
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <a href={SUPPORT_URL} className="hover:text-white">
              サポート
            </a>
            <a href={PRIVACY_URL} className="hover:text-white">
              プライバシーポリシー
            </a>
            <Link href="/" className="hover:text-white">
              touyou.dev
            </Link>
          </div>
          <p>このページの絵は、アプリと同じ描き方で書き出したものです。</p>
          <p>Apple、iPhone、App Store は Apple Inc. の商標です。</p>
          <p>© 2026 touyou</p>
        </div>
      </footer>
    </div>
  );
}

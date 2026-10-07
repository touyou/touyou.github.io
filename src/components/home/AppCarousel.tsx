"use client";

import Image from "next/image";
import { useRef } from "react";

import { IntentoIcon } from "@/components/intento/IntentoIcon";
import { ToretaIcon } from "@/components/toreta/ToretaIcon";
import { cn } from "@/lib/utils";

import { appBanners, type AppBanner } from "./app-banners";

/**
 * トップページの、アプリの紹介ページへのバナーを横に並べたカルーセル。
 * 横スクロールとスクロールスナップで動かし、広い画面では左右のボタンでも送れるようにする。
 */
export function AppCarousel() {
  const scroller = useRef<HTMLUListElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section aria-labelledby="apps-heading" className="flex w-full flex-col gap-6">
      <div className="mx-auto flex w-full max-w-6xl items-end justify-between gap-4 px-6">
        <h2 id="apps-heading" className="text-2xl font-bold tracking-tight">
          つくったアプリ
        </h2>
        <div className="hidden gap-2 sm:flex">
          <ArrowButton label="前のアプリへ" onClick={() => scrollByPage(-1)} direction={-1} />
          <ArrowButton label="次のアプリへ" onClick={() => scrollByPage(1)} direction={1} />
        </div>
      </div>
      <ul
        ref={scroller}
        className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] sm:scroll-px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
      >
        {appBanners.map((app) => (
          <li key={app.id} className="snap-start">
            <Banner app={app} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function Banner({ app }: { app: AppBanner }) {
  const light = app.foreground === "light";
  const external = app.href.startsWith("http");
  return (
    <a
      href={app.href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group flex h-[340px] w-[260px] flex-col gap-5 overflow-hidden rounded-[28px] p-6 ring-1 ring-black/5 transition-transform motion-safe:hover:-translate-y-1 sm:w-[280px]",
        light ? "text-white" : "text-[#1d1d1f]",
      )}
      style={{ background: app.background }}
    >
      <BannerIcon app={app} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">{app.name}</span>
          {app.status && (
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", light ? "bg-white/20" : "bg-black/10")}>{app.status}</span>
          )}
        </div>
        <p className={cn("text-[15px] font-medium leading-[1.6] [word-break:auto-phrase]", light ? "text-white/85" : "text-[#1d1d1f]/80")}>{app.catchcopy}</p>
      </div>
      <div className="mt-auto flex flex-col gap-3">
        <ul className="flex flex-wrap gap-1.5" aria-label="対応している端末">
          {app.platforms.map((platform) => (
            <li
              key={platform}
              className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", light ? "bg-white/15 text-white/90" : "bg-black/[0.07] text-[#1d1d1f]/80")}
            >
              {platform}
            </li>
          ))}
        </ul>
        <span className={cn("text-sm font-semibold", light ? "text-white" : "text-[#0066CC]")}>
          詳しく見る <span className="inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5">›</span>
        </span>
      </div>
    </a>
  );
}

function BannerIcon({ app }: { app: AppBanner }) {
  const size = "h-16 w-16";
  if (app.icon.kind === "component") {
    return app.icon.name === "toreta" ? <ToretaIcon className={cn(size, "shadow-md")} /> : <IntentoIcon className={cn(size, "shadow-md")} />;
  }
  const { src, background, offset } = app.icon;
  return (
    <span className={cn("relative block shrink-0 overflow-hidden rounded-[22.5%] shadow-md ring-1 ring-white/10", size)} style={{ background }}>
      <Image
        src={src}
        alt={`${app.name} のアイコン`}
        fill
        sizes="64px"
        className="object-cover"
        style={offset ? { transform: `translate(${offset[0]}, ${offset[1]})` } : undefined}
      />
    </span>
  );
}

function ArrowButton({ label, onClick, direction }: { label: string; onClick: () => void; direction: 1 | -1 }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 text-lg text-neutral-700 transition-colors hover:bg-black/10"
    >
      <span aria-hidden>{direction === 1 ? "›" : "‹"}</span>
    </button>
  );
}

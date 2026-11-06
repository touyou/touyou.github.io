import Image from "next/image";
import { notFound } from "next/navigation";

import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";

/**
 * Patchday の紹介画像（public/og/patchday.png）の元の絵。1200×630 の枠を撮って書き出す。
 * 開発のときだけ開ける（本番では 404）。
 */
export default function PatchdayOgPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      {/* 開発サーバーのインジケータを撮り込まない */}
      <style>{`nextjs-portal { display: none !important; }`}</style>
      <div
        id="og"
        className="relative flex h-[630px] w-[1200px] items-center overflow-hidden bg-[linear-gradient(100deg,#FBFBFD,#EAF1F3)] px-[88px] text-[#1d1d1f] [font-feature-settings:'palt']"
      >
        <div className="relative z-10 flex w-[560px] flex-col gap-8">
          <div className="flex items-center gap-4">
            <PatchdayIcon className="h-[88px] w-[88px]" />
            <span className="text-[30px] font-bold text-neutral-500">
              Patchday
            </span>
          </div>
          <h1 className="text-[58px] font-bold leading-[1.2] tracking-[-0.02em]">
            脆弱性の対応期限を、
            <br />
            チームの手元に。
          </h1>
          <p className="text-[22px] text-neutral-500">
            CISA KEV・JVN・NVD ／ iPhone・iPad・Mac
          </p>
        </div>
        <div className="absolute right-[-170px] top-[96px] w-[700px] rotate-[-3deg] overflow-hidden rounded-[14px] shadow-[0_30px_80px_-24px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
          <Image
            src="/patchday/mac-calendar.jpg"
            alt=""
            width={1600}
            height={993}
            priority
            className="w-full"
          />
        </div>
      </div>
    </>
  );
}

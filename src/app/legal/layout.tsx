import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";

/** 全アプリの特定商取引法に基づく表記の枠。アプリごとの紹介ページと同じ文書ページの書体にそろえる */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={null} name="touyou.dev" home="/">
          <Link href="/press" className="hover:text-neutral-900">
            プレス
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/">touyou.dev</Link>
          <Link href="/legal">特定商取引法に基づく表記</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

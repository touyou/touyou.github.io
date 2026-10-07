import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { IntentoIcon } from "@/components/intento/IntentoIcon";

/** Intento のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function IntentoDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<IntentoIcon className="h-6 w-6 shadow-none" />} name="Intento" home="/intento">
          <Link href="/intento/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/intento/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/intento">Intento</Link>
          <Link href="/intento/support">サポート</Link>
          <Link href="/intento/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

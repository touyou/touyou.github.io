import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { ToretaIcon } from "@/components/toreta/ToretaIcon";

/** Toreta（iOS アプリ）のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function ToretaDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<ToretaIcon className="h-6 w-6 shadow-none" />} name="Toreta" home="/toreta">
          <Link href="/toreta/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/toreta/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/toreta">Toreta</Link>
          <Link href="/toreta/support">サポート</Link>
          <Link href="/toreta/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

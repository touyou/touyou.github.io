import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { CheckitoutIcon } from "@/components/checkitout/CheckitoutIcon";

/** チェケラのサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function CheckitoutDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<CheckitoutIcon className="h-6 w-6 shadow-none" />} name="チェケラ" home="/checkitout">
          <Link href="/checkitout/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/checkitout/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/checkitout">チェケラ</Link>
          <Link href="/checkitout/support">サポート</Link>
          <Link href="/checkitout/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

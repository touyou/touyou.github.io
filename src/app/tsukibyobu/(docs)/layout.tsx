import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { TsukibyobuIcon } from "@/components/tsukibyobu/TsukibyobuIcon";

/** 月屏風のサポートとプライバシーポリシーの共通レイアウト。他のアプリのページと同じ体裁にそろえる */
export default function TsukibyobuDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav
          icon={<TsukibyobuIcon className="h-6 w-6 shadow-none" />}
          name="月屏風"
          home="/tsukibyobu/support"
        >
          <Link href="/tsukibyobu/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/tsukibyobu/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/tsukibyobu/support">サポート</Link>
          <Link href="/tsukibyobu/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

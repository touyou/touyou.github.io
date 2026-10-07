import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { FFIcon } from "@/components/ffmultiplier/FFIcon";

/** FFMultiplier のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function FFMultiplierDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<FFIcon className="h-6 w-6 shadow-none" />} name="FFMultiplier" home="/ffmultiplier">
          <Link href="/ffmultiplier/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/ffmultiplier/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/ffmultiplier">FFMultiplier</Link>
          <Link href="/ffmultiplier/support">サポート</Link>
          <Link href="/ffmultiplier/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { PatchdayIcon } from "@/components/patchday/PatchdayIcon";

/** Patchday のサポート・プライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function PatchdayDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<PatchdayIcon className="h-6 w-6 shadow-none" />} name="Patchday" home="/patchday">
          <Link href="/patchday/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/patchday/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/patchday">Patchday</Link>
          <Link href="/patchday/support">サポート</Link>
          <Link href="/patchday/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

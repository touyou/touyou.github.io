import Link from "next/link";
import type { ReactNode } from "react";

import { DocsShell } from "@/components/app-lp";
import { FFIcon } from "@/components/ffmultiplier/FFIcon";
import { FFNav } from "@/components/ffmultiplier/lp";

/** FFMultiplier のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションにそろえ、本文は読みやすさを優先して DocsShell の書体のままにする */
export default function FFMultiplierDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <FFNav icon={<FFIcon className="h-6 w-6 shadow-none" />}>
          <Link href="/ffmultiplier/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/ffmultiplier/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </FFNav>
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

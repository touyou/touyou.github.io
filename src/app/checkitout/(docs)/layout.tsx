import Link from "next/link";
import type { ReactNode } from "react";

import { CheckitoutIcon } from "@/components/checkitout/CheckitoutIcon";
import { CkDocsShell, CkNav } from "@/components/checkitout/lp";

/** チェケラのサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じ暗い地・ナビゲーション・書体にそろえる */
export default function CheckitoutDocsLayout({ children }: { children: ReactNode }) {
  return (
    <CkDocsShell
      nav={
        <CkNav icon={<CheckitoutIcon className="h-6 w-6 shadow-none" />} name="チェケラ" home="/checkitout">
          <Link href="/checkitout/support">
            サポート
          </Link>
          <Link href="/checkitout/privacy">
            プライバシー
          </Link>
        </CkNav>
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
    </CkDocsShell>
  );
}

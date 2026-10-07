import Link from "next/link";
import type { ReactNode } from "react";

import { AppNav, DocsShell } from "@/components/app-lp";
import { QuizIcon } from "@/components/programming-quiz/QuizIcon";

/** Programming Quiz のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションと書体にそろえる */
export default function ProgrammingQuizDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <AppNav icon={<QuizIcon className="h-6 w-6 shadow-none" />} name="Programming Quiz" home="/programming-quiz">
          <Link href="/programming-quiz/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/programming-quiz/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </AppNav>
      }
      footer={
        <>
          <Link href="/programming-quiz">Programming Quiz</Link>
          <Link href="/programming-quiz/support">サポート</Link>
          <Link href="/programming-quiz/privacy">プライバシーポリシー</Link>
          <Link href="/">touyou.dev</Link>
        </>
      }
    >
      {children}
    </DocsShell>
  );
}

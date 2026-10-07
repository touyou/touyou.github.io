import Link from "next/link";
import type { ReactNode } from "react";

import { DocsShell } from "@/components/app-lp";
import { QuizNav } from "@/components/programming-quiz/lp";

/** Programming Quiz のサポートとプライバシーポリシーの共通レイアウト。紹介ページと同じナビゲーションを使う。本文は審査担当が読む経路なので、DocsShell の素直な文書の形のままにする */
export default function ProgrammingQuizDocsLayout({ children }: { children: ReactNode }) {
  return (
    <DocsShell
      nav={
        <QuizNav>
          <Link href="/programming-quiz/support" className="hover:text-neutral-900">
            サポート
          </Link>
          <Link href="/programming-quiz/privacy" className="hover:text-neutral-900">
            プライバシー
          </Link>
        </QuizNav>
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

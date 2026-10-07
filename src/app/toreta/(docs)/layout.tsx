import type { ReactNode } from "react";

/**
 * Toreta（iOS アプリ）のサポートとプライバシーポリシーの共通レイアウト。
 * App Store の審査担当が確認する経路なので、装飾を抑え「見出し → 本文」が機械的に読める構造に保つ。
 */
export default function ToretaLayout({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 leading-relaxed [&_a]:underline [&_h1]:mb-2 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:font-bold [&_li]:mb-1 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </main>
  );
}

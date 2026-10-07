import { type CategoryId, CategoryRow, INDIGO, PURPLE, Sparkles } from "./quiz-ui";

/**
 * 紹介ページの図として描き直したアプリの画面（スクリーンショットではない）。
 * 文言は QuizLiT/Quiz/Views/HomeView.swift・QuizView.swift の表記に合わせる。
 */

/** ホーム画面の「AIにおまかせ出題」の欄 */
export function AiSection({ className }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="ホーム画面の「AIにおまかせ出題」の欄。テーマを入れて「AIで問題を作る」を押す">
      <div className="flex flex-col gap-3 rounded-[28px] bg-[#F2F2F7] p-5 text-left sm:p-6" aria-hidden>
        <span className="flex items-center gap-1.5 text-[15px] font-bold">
          <Sparkles className="h-4 w-4" />
          AIにおまかせ出題
        </span>
        <span className="text-[11px] leading-[1.6] text-neutral-500">
          テーマを入力すると、オンデバイスAIがオリジナル問題を作ります。問題文・選択肢・正誤は自動生成のため誤りを含むことがあり、正しさは保証されません。
        </span>
        <span className="rounded-[14px] bg-white px-3.5 py-3 text-[13px]">再帰</span>
        <span className="flex items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-bold text-white" style={{ background: PURPLE }}>
          <Sparkles className="h-3.5 w-3.5" color="white" />
          AIで問題を作る
        </span>
      </div>
    </div>
  );
}

/** AI が作った問題を解いているときの、進み具合の欄 */
export function AiProgress({ className }: { className?: string }) {
  return (
    <div className={className} role="img" aria-label="AI が作った問題の画面の上部。「AI出題・再帰」「第 1 問 / 5 問」と、内容に誤りを含む場合がある旨の注意が出る">
      <div className="flex flex-col gap-2 rounded-[28px] bg-[#F2F2F7] p-5 text-left sm:p-6" aria-hidden>
        <div className="flex items-center justify-between text-[11px] font-bold text-neutral-500">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" color="#8E8E93" />
            AI出題・再帰
          </span>
          <span>第 1 問 / 5 問</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-black/10">
          <div className="h-full w-1/5 rounded-full" style={{ background: INDIGO }} />
        </div>
        <span className="text-[10px] text-neutral-500">AI生成のため、内容に誤りを含む場合があります。</span>
      </div>
    </div>
  );
}

const HOME_SELECTION: Record<CategoryId, boolean> = { basic: true, iphone: false, algorithm: true };

/** iPad のホーム画面（縦向き）。アプリの readableWidth と同じく、中身は幅 640pt（11 インチの縦向きで約 78%）に収まって中央に並ぶ */
export function IpadHome() {
  return (
    <div
      className="mx-auto w-full max-w-[440px] overflow-hidden rounded-[26px] bg-[#1d1d1f] p-3 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.4)]"
      role="img"
      aria-label="iPad のホーム画面。カテゴリの選択、スタートボタン、AIにおまかせ出題が中央に並び、下端にバナー広告が出る"
    >
      <div className="flex aspect-[3/4] flex-col items-center gap-3 overflow-hidden rounded-[12px] bg-[#F2F2F7] pt-6 sm:pt-12" aria-hidden>
        <div className="flex w-[78%] flex-col gap-2.5 sm:gap-3">
          <span className="pb-1 text-center text-[10px] text-neutral-500 sm:text-[11px]">挑戦するジャンルを選んでスタート</span>
          {(Object.keys(HOME_SELECTION) as CategoryId[]).map((id) => (
            <CategoryRow key={id} id={id} selected={HOME_SELECTION[id]} className="py-2.5 sm:py-3.5" />
          ))}
          <span className="rounded-full py-2 text-center text-[13px] font-bold text-white sm:py-2.5" style={{ background: INDIGO }}>
            スタート
          </span>
          <span className="flex items-center gap-1 pt-1 text-[12px] font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            AIにおまかせ出題
          </span>
          <span className="rounded-[12px] bg-white px-3 py-2 text-[11px] text-neutral-400 sm:py-2.5">例: SwiftUI、再帰、正規表現</span>
          <span className="rounded-full py-2 text-center text-[12px] font-bold text-white sm:py-2.5" style={{ background: PURPLE }}>
            AIで問題を作る
          </span>
        </div>
        {/* ホーム画面の下端に出るバナー広告の場所 */}
        <span className="mb-3 mt-auto flex h-6 w-[52%] items-center justify-center rounded bg-black/[0.06] text-[9px] text-neutral-400 sm:h-8">広告</span>
      </div>
    </div>
  );
}

import { cn } from "@/lib/utils";

/**
 * 画面の描き直しに使う小さな部品。
 * 色はアプリ（QuizLiT/Quiz/Models/Question.swift の QuizCategory.tint、各画面の .tint）に合わせて、iOS のシステムカラーの値を使う。
 * アイコンは SF Symbols をそのまま載せられないので、形の近い線画で描く。
 */

export const INDIGO = "#5856D6";
export const PURPLE = "#AF52DE";
export const GREEN = "#34C759";
export const RED = "#FF3B30";

export type CategoryId = "basic" | "iphone" | "algorithm";

export const CATEGORIES: Record<CategoryId, { title: string; color: string; count: number }> = {
  basic: { title: "プログラミング知識編", color: "#007AFF", count: 10 },
  iphone: { title: "iPhoneアプリ開発編", color: GREEN, count: 10 },
  algorithm: { title: "アルゴリズム編", color: "#FF9500", count: 7 },
};

/** カテゴリのアイコン（本・iPhone・点を結んだ三角形） */
export function CategoryGlyph({ id, className }: { id: CategoryId; className?: string }) {
  const color = CATEGORIES[id].color;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      {id === "basic" && (
        <>
          <path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z" fill={color} fillOpacity={0.9} />
          <path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" />
        </>
      )}
      {id === "iphone" && (
        <>
          <rect x="6.5" y="2.5" width="11" height="19" rx="2.5" />
          <path d="M10.5 5h3" />
        </>
      )}
      {id === "algorithm" && (
        <>
          <path d="M12 5 5.5 18h13z" strokeDasharray="2 2.5" strokeWidth={1.6} />
          <circle cx="12" cy="5" r="2.2" fill={color} />
          <circle cx="5.5" cy="18" r="2.2" fill={color} />
          <circle cx="18.5" cy="18" r="2.2" fill={color} />
        </>
      )}
    </svg>
  );
}

/** チェックの丸。checked のときは塗る */
export function CheckCircle({ checked, color, className }: { checked: boolean; color: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {checked ? (
        <>
          <circle cx="12" cy="12" r="10" fill={color} />
          <path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <circle cx="12" cy="12" r="9.2" fill="none" stroke="#C7C7CC" strokeWidth={1.6} />
      )}
    </svg>
  );
}

/** 正解・不正解の丸いマーク */
export function ResultMark({ correct, className }: { correct: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="10" fill={correct ? GREEN : RED} />
      {correct ? (
        <path d="m7.5 12.3 3 3 6-6.3" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m8.5 8.5 7 7m0-7-7 7" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" />
      )}
    </svg>
  );
}

/** 結果画面の王冠（全問正解のとき） */
export function Crown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M3 8.5 7.5 12 12 5l4.5 7L21 8.5 19 18H5z" fill={INDIGO} strokeLinejoin="round" />
      <rect x="5" y="19" width="14" height="2" rx="1" fill={INDIGO} />
    </svg>
  );
}

/** 結果画面の星（全問正解ではないとき） */
export function StarMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="m12 2.8 2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill={INDIGO} />
    </svg>
  );
}

/** AI 出題のきらめき */
export function Sparkles({ className, color = PURPLE }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={color}>
      <path d="M10 3c.5 3.6 2.4 5.5 6 6-3.6.5-5.5 2.4-6 6-.5-3.6-2.4-5.5-6-6 3.6-.5 5.5-2.4 6-6z" />
      <path d="M18 13c.3 2 1.2 2.9 3 3.2-1.8.3-2.7 1.2-3 3.2-.3-2-1.2-2.9-3-3.2 1.8-.3 2.7-1.2 3-3.2z" />
    </svg>
  );
}

/** ホーム画面のカテゴリ選択カード（HomeView の CategoryCard） */
export function CategoryRow({ id, selected, className }: { id: CategoryId; selected: boolean; className?: string }) {
  const { title, color } = CATEGORIES[id];
  return (
    <div
      className={cn("flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5", className)}
      style={{ boxShadow: selected ? `inset 0 0 0 2px ${color}` : undefined }}
    >
      <CategoryGlyph id={id} className="h-5 w-5 shrink-0" />
      <span className="flex-1 truncate text-[13px] font-semibold">{title}</span>
      <CheckCircle checked={selected} color={color} className="h-5 w-5 shrink-0" />
    </div>
  );
}

"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

import { CheckCircle, Star, SYSTEM_BLUE } from "./todo-ui";

/**
 * アプリの外の「触れる場所」をタイルで並べる。ウィジェット・コントロール・ライブアクティビティ・集中モードは押して試せる。
 * どれも実機の画面写真ではなく、雰囲気を HTML で描き直したもの。
 */

function Tile({ title, body, className, children, dark = false }: { title: string; body: string; className?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-6 overflow-hidden rounded-[28px] p-7", dark ? "bg-[#1d1d1f] text-white" : "bg-[#F5F5F7]", className)}>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className={cn("text-[15px] leading-[1.8]", dark ? "text-neutral-400" : "text-neutral-600")}>{body}</p>
      </div>
      <div className="flex flex-1 items-center justify-center">{children}</div>
    </div>
  );
}

function TapHint({ dark = false }: { dark?: boolean }) {
  return <span className={cn("text-xs", dark ? "text-neutral-500" : "text-neutral-400")}>押して試せます</span>;
}

const WIDGET_TODOS = ["登壇のリハーサルをする", "1.0 のビルドを提出する", "歯医者を予約する"];

function WidgetTile() {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const left = done.filter((d) => !d).length;
  return (
    <Tile title="ウィジェット" body="今日のやることをホーム画面に。チェックはその場でつけられます。" className="md:col-span-2">
      <div className="flex flex-col items-center gap-3">
        <div className="w-full max-w-[320px] rounded-[24px] bg-white p-4 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.2)]">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[13px] font-semibold" style={{ color: SYSTEM_BLUE }}>
              やること
            </span>
            <span className="text-[13px] tabular-nums text-neutral-400">残り {left}</span>
          </div>
          <ul className="flex flex-col">
            {WIDGET_TODOS.map((title, i) => (
              <li key={title}>
                <button
                  type="button"
                  onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                  className="flex w-full items-center gap-2.5 py-1.5 text-left"
                  aria-pressed={done[i]}
                >
                  <CheckCircle done={done[i]} className="h-5 w-5" />
                  <span className={cn("truncate text-[14px] transition-colors", done[i] ? "text-neutral-400" : "text-neutral-900")}>{title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <TapHint />
      </div>
    </Tile>
  );
}

function ControlTile() {
  const [count, setCount] = useState(3);
  return (
    <Tile title="コントロールセンター" body="ワンタップで追加。残りの数も、いちばん急ぎのものの完了も。" dark>
      <div className="flex flex-col items-center gap-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCount((c) => c + 1)}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white/15 text-3xl font-light text-white backdrop-blur transition active:scale-90"
            aria-label="やることを追加"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-white text-[#1d1d1f] transition active:scale-90"
            aria-label="いちばん急ぎのやることを完了"
          >
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
              <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="col-span-2 flex h-[72px] items-center justify-between rounded-[36px] bg-white/15 px-6 backdrop-blur" aria-live="polite">
            <span className="text-sm text-neutral-300">未完了</span>
            <span key={count} className="text-3xl font-semibold tabular-nums motion-safe:animate-in motion-safe:zoom-in-75">
              {count}
            </span>
          </div>
        </div>
        <TapHint dark />
      </div>
    </Tile>
  );
}

function LiveActivityTile() {
  const [state, setState] = useState<"active" | "done" | "snoozed">("active");
  return (
    <Tile title="ロック画面" body="進めているやることを、ライブアクティビティで追いかけます。" dark>
      <div className="flex w-full flex-col items-center gap-3">
        <div className="relative flex w-full max-w-[300px] flex-col items-center gap-6 overflow-hidden rounded-[32px] bg-gradient-to-b from-[#2c3e66] via-[#5b4a8a] to-[#c0708a] px-4 pb-4 pt-8">
          <span className="text-5xl font-semibold tracking-tight text-white/90">9:41</span>
          <div className="w-full rounded-[22px] bg-black/45 p-3.5 backdrop-blur" aria-live="polite">
            <div className="flex items-center gap-2.5">
              <CheckCircle done={state === "done"} className="h-6 w-6 border-white/60" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className={cn("truncate text-[14px] font-semibold", state === "done" ? "text-white/50" : "text-white")}>登壇のリハーサルをする</span>
                <span className="text-[11px] text-white/60">
                  {state === "active" ? "今日 17:00 まで" : state === "done" ? "完了しました" : "スヌーズしました"}
                </span>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setState(state === "done" ? "active" : "done")}
                className="rounded-full bg-white/20 py-1.5 text-[12px] font-semibold text-white transition active:scale-95"
              >
                {state === "done" ? "元に戻す" : "完了"}
              </button>
              <button
                type="button"
                onClick={() => setState(state === "snoozed" ? "active" : "snoozed")}
                className="rounded-full bg-white/20 py-1.5 text-[12px] font-semibold text-white transition active:scale-95"
              >
                {state === "snoozed" ? "元に戻す" : "スヌーズ"}
              </button>
            </div>
          </div>
        </div>
        <TapHint dark />
      </div>
    </Tile>
  );
}

function SpotlightTile() {
  return (
    <Tile title="Spotlight" body="やることのタイトルで検索。カメラを向けた先や、画面の中身からも探せます。">
      <div className="flex w-full max-w-[320px] flex-col gap-2">
        <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-[15px] shadow-sm ring-1 ring-black/5">
          <svg viewBox="0 0 24 24" className="h-4 w-4 text-neutral-400" aria-hidden>
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth={2} />
            <path d="M16 16l4 4" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
          </svg>
          <span>
            歯医者
            <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-[#0A84FF] motion-safe:animate-pulse" />
          </span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-black/5">
          <CheckCircle done={false} className="h-5 w-5" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-[14px]">歯医者を予約する</span>
            <span className="text-[11px] text-neutral-400">Intento ・ 10月9日</span>
          </div>
          <Star filled={false} className="h-4 w-4" />
        </div>
      </div>
    </Tile>
  );
}

const FOCUS_TODOS = [
  { title: "1.0 のビルドを提出する", tag: "仕事", urgent: true },
  { title: "会場からのメールに返信する", tag: "仕事", urgent: false },
  { title: "歯医者を予約する", tag: "暮らし", urgent: false },
  { title: "オーツミルクを買う", tag: "暮らし", urgent: false },
];
const FOCUS_MODES = ["なし", "仕事", "暮らし"] as const;

function FocusTile() {
  const [mode, setMode] = useState<(typeof FOCUS_MODES)[number]>("なし");
  const visible = FOCUS_TODOS.filter((t) => mode === "なし" || t.tag === mode);
  return (
    <Tile title="集中モード" body="モードに合わせて、いま見るべきやることだけを残します。">
      <div className="flex w-full max-w-[320px] flex-col gap-3">
        <div className="flex gap-1 self-center rounded-full bg-white p-1 shadow-sm ring-1 ring-black/5" role="group" aria-label="集中モード">
          {FOCUS_MODES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={cn("rounded-full px-3.5 py-1 text-[13px] font-medium transition-colors", mode === m ? "bg-[#1d1d1f] text-white" : "text-neutral-600")}
            >
              {m}
            </button>
          ))}
        </div>
        <ul className="flex min-h-[176px] flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
          {visible.map((t) => (
            <li key={t.title} className="flex items-center gap-3 border-b border-neutral-100 px-4 py-2.5 last:border-0 motion-safe:animate-in motion-safe:fade-in">
              <CheckCircle done={false} className="h-5 w-5" />
              <span className="flex-1 truncate text-[14px]">{t.title}</span>
              <span className="text-[11px] text-neutral-400">{t.tag}</span>
            </li>
          ))}
        </ul>
      </div>
    </Tile>
  );
}

function WatchTile() {
  return (
    <Tile title="Apple Watch" body="文字盤のコンプリケーションに、残りの数と次の期限。手首の上で追加も完了も。">
      <div className="rounded-[46px] bg-[#1d1d1f] p-2.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]">
        <div className="relative h-[214px] w-[176px] overflow-hidden rounded-[38px] bg-black">
          <Image src="/intento/watch-list.jpg" alt="Apple Watch の Intento の一覧画面" fill sizes="176px" className="object-cover" />
        </div>
      </div>
    </Tile>
  );
}

// 名前はアプリの日本語ローカライズ（ショートカット App に出る名前）に合わせる
const ACTIONS = [
  "やることを追加",
  "やることの完了を切り替え",
  "やることをスヌーズ",
  "お気に入りを切り替え",
  "やることを表示",
  "やることとカテゴリを検索",
  "やることをまとめて完了",
  "やることの件数を表示",
  "やることの概要を取得",
  "やることを更新",
  "やることを並べ替え",
  "リストを作成",
];

function ShortcutsTile() {
  return (
    <Tile
      title="ショートカット"
      body="25 種類のアクションを公開しています。ほかのアプリと組み合わせて、自分だけの自動化に。"
      className="md:col-span-2"
    >
      <div className="flex w-full flex-col items-center gap-6">
        <span className="bg-gradient-to-br from-[#FF2D55] via-[#AF52DE] to-[#0A84FF] bg-clip-text text-[96px] font-bold leading-none tracking-tighter text-transparent">
          25
        </span>
        {/* 横に流れるアクションの列。動きを減らす設定では止まる */}
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max gap-2 pr-2 motion-safe:animate-[intento-marquee_40s_linear_infinite]">
            {[...ACTIONS, ...ACTIONS].map((action, i) => (
              <span
                key={i}
                aria-hidden={i >= ACTIONS.length}
                className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-[13px] font-medium shadow-sm ring-1 ring-black/5"
              >
                {action}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tile>
  );
}

export function Surfaces() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <WidgetTile />
      <ControlTile />
      <LiveActivityTile />
      <SpotlightTile />
      <FocusTile />
      <WatchTile />
      <ShortcutsTile />
    </div>
  );
}

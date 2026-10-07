"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

import { CalendarGlyph, CheckCircle, Star } from "./todo-ui";

/**
 * 話しかけると一覧が変わる様子を、ループするアニメーションで見せる。
 * フレーズは IntentTodo/AppShortcuts.xcstrings の日本語に合わせる（「Intento で〇〇を完了」など）。
 * 動きを減らす設定のときは、アニメーションせずに最後の状態とフレーズの一覧を出す。
 */

type Todo = { id: string; title: string; date?: string; starred: boolean; done: boolean };

const INITIAL: Todo[] = [
  { id: "rehearsal", title: "登壇のリハーサルをする", date: "10月7日", starred: true, done: false },
  { id: "build", title: "1.0 のビルドを提出する", date: "10月8日", starred: true, done: false },
  { id: "dentist", title: "歯医者を予約する", date: "10月9日", starred: false, done: false },
  { id: "mail", title: "会場からのメールに返信する", starred: false, done: false },
];

type Step = { say: string; reply?: string; answer?: string; apply: (todos: Todo[]) => Todo[]; target: string };

const STEPS: Step[] = [
  {
    say: "Intento でやることを追加",
    reply: "何を追加しますか？",
    answer: "傘を持っていく",
    target: "umbrella",
    apply: (todos) => [{ id: "umbrella", title: "傘を持っていく", starred: false, done: false }, ...todos],
  },
  {
    say: "Intento で歯医者を予約するを完了",
    target: "dentist",
    apply: (todos) => todos.map((t) => (t.id === "dentist" ? { ...t, done: true } : t)),
  },
  {
    say: "Intento の会場からのメールに返信するにスターを付ける",
    target: "mail",
    apply: (todos) => todos.map((t) => (t.id === "mail" ? { ...t, starred: true } : t)),
  },
];

const FINAL = STEPS.reduce((todos, step) => step.apply(todos), INITIAL);

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException("aborted", "AbortError"));
    };
    // ループ中に何度も呼ぶので、終わった待ち時間の listener は外して溜めない
    const id = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal.addEventListener("abort", onAbort, { once: true });
  });

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** 動きを減らす設定。サーバーでは分からないので、アニメーションする前提で描く */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export function VoiceDemo() {
  const [animatedTodos, setTodos] = useState<Todo[]>(INITIAL);
  const [spoken, setSpoken] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();
  const todos = reduced ? FINAL : animatedTodos;

  useEffect(() => {
    if (reduced) return;
    const controller = new AbortController();
    const { signal } = controller;

    const type = async (text: string) => {
      for (let i = 1; i <= text.length; i++) {
        setSpoken(text.slice(0, i));
        await sleep(55, signal);
      }
    };

    (async () => {
      while (!signal.aborted) {
        setTodos(INITIAL);
        await sleep(1200, signal);
        for (const step of STEPS) {
          setReply(null);
          await type(step.say);
          await sleep(500, signal);
          if (step.reply && step.answer) {
            setReply(step.reply);
            await sleep(900, signal);
            setReply(null);
            await type(step.answer);
            await sleep(400, signal);
          }
          setTodos((current) => step.apply(current));
          setHighlight(step.target);
          await sleep(1800, signal);
          setHighlight(null);
          setSpoken("");
          await sleep(500, signal);
        }
        await sleep(1500, signal);
      }
    })().catch(() => {});

    return () => controller.abort();
  }, [reduced]);

  return (
    <div className="flex flex-col items-center gap-8">
      {/* 話しかけた言葉 */}
      {/* 吹き出しが 1 行でも 2 行でも下の iPhone が上下に動かないよう、高さを固定する */}
      <div className="flex h-24 w-full max-w-md items-center justify-center" aria-hidden={!reduced}>
        {reduced ? (
          <ul className="flex flex-col items-center gap-2 text-sm text-neutral-600">
            {STEPS.map((step) => (
              <li key={step.say}>「{step.say}」</li>
            ))}
          </ul>
        ) : (
          <div
            className={cn(
              "relative rounded-[30px] p-[2px] transition-opacity duration-300",
              spoken || reply ? "opacity-100" : "opacity-0",
            )}
            style={{ background: "conic-gradient(from 180deg, #5AC8FA, #AF52DE, #FF2D55, #FF9500, #5AC8FA)" }}
          >
            <div className="line-clamp-2 rounded-[28px] bg-white px-5 py-3 text-[15px] font-medium leading-snug text-neutral-900 shadow-lg">
              {reply ? <span className="text-neutral-500">{reply}</span> : <>「{spoken}」</>}
            </div>
          </div>
        )}
      </div>

      {/* iPhone */}
      <div
        className="relative aspect-[9/19.5] w-full max-w-[300px] overflow-hidden rounded-[52px] border-[11px] border-[#1d1d1f] bg-[#1d1d1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]"
        role="img"
        aria-label="Intento の一覧画面。話しかけると、やることが追加されたり完了したりする"
      >
        <div className="flex h-full flex-col overflow-hidden rounded-[41px] bg-[#F2F2F7] text-left" aria-hidden>
          <div className="flex items-center justify-between px-7 pt-3.5 text-[12px] font-semibold">
            <span>9:41</span>
            <span className="h-[24px] w-[80px] rounded-full bg-[#1d1d1f]" />
            <span className="h-[10px] w-[22px] rounded-[3px] bg-[#1d1d1f]" />
          </div>
          <div className="flex justify-end gap-2 px-4 pt-4">
            <span className="h-8 w-8 rounded-full bg-white shadow-sm ring-1 ring-black/5" />
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A84FF] text-lg leading-none text-white">+</span>
          </div>
          <div className="px-5 pt-2 text-[28px] font-bold tracking-tight">やること</div>
          <ul className="mx-3 mt-3 overflow-hidden rounded-[18px] bg-white">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 transition-colors duration-500 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2",
                  highlight === todo.id && "bg-[#0A84FF]/10",
                )}
              >
                <CheckCircle done={todo.done} className="h-[22px] w-[22px]" />
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={cn("truncate text-[13px] transition-colors duration-300", todo.done ? "text-neutral-400" : "text-neutral-900")}>
                    {todo.title}
                  </span>
                  {todo.date && (
                    <span className="flex items-center gap-1 text-[10px] text-neutral-400">
                      <CalendarGlyph className="h-2.5 w-2.5" />
                      2026年{todo.date}
                    </span>
                  )}
                </div>
                <Star filled={todo.starred} className="h-4 w-4" />
              </li>
            ))}
          </ul>
          {/* 実機と同じく、ホームインジケータの分だけ下を空ける */}
          <div className="mt-auto px-4 pb-9">
            <div className="rounded-full bg-white/80 px-4 py-2.5 text-[12px] text-neutral-400 shadow-sm ring-1 ring-black/5">やることを検索</div>
          </div>
        </div>
      </div>
    </div>
  );
}

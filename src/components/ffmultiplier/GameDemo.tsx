"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

import { answerOf, HEX_DIGITS, hexDigit, MAX_INPUT_LENGTH, nextProblem, POINTS_FAILED, pointsForCorrect, type Problem } from "./hex";
import { SevenSeg } from "./SevenSeg";

/**
 * ゲーム画面（FFMultiply/Views/GameView.swift）を描き直し、ブラウザで遊べるようにしたもの。
 * 出題・採点の決まりはアプリと同じ（hex.ts）。アプリは 60 秒だが、ページの中で試すには長いので 30 秒にしている。
 * 画面の文字（DELETE・DONE・accepted など）はアプリの表示に合わせて英語のままにする。
 */

const DURATION_SECONDS = 30;

/** 始める前に見せておく問題。サーバーとブラウザで同じものを描くため、乱数は使わない */
const SAMPLE: Problem = { left: 10, right: 7 };

type Feedback = { id: number; ok: boolean; message: string };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** 動きを減らす設定。サーバーでは分からないので、動かす前提で描く */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

export function GameDemo() {
  // endAt が null のあいだは始まる前。残り時間は endAt と now の差から求める
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [problem, setProblem] = useState<Problem>(SAMPLE);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  const remaining = endAt === null ? DURATION_SECONDS : Math.max(0, Math.ceil((endAt - now) / 1000));
  const playing = endAt !== null && remaining > 0;
  const finished = endAt !== null && remaining === 0;

  // 遊んでいるあいだだけ時計を進める。時間切れになったら止める
  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) clearInterval(id);
    }, 200);
    return () => clearInterval(id);
  }, [endAt]);

  useEffect(() => () => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
  }, []);

  const start = () => {
    const t = Date.now();
    setNow(t);
    setEndAt(t + DURATION_SECONDS * 1000);
    setProblem(nextProblem(null));
    setInput("");
    setScore(0);
    setCombo(0);
    setAnswered(0);
    setFeedback(null);
    setToastVisible(false);
    // 開始ボタンが消えるので、キーボードで続けて入力できるよう画面にフォーカスを移す
    screenRef.current?.focus();
  };

  const type = (digit: string) => {
    if (!playing) return;
    setInput((current) => (current.length < MAX_INPUT_LENGTH ? current + digit : current));
  };

  const remove = () => {
    if (!playing) return;
    setInput((current) => current.slice(0, -1));
  };

  const submit = () => {
    if (!playing) return;
    const answer = answerOf(problem);
    const ok = input === answer;
    const question = `${hexDigit(problem.left)} × ${hexDigit(problem.right)}`;
    if (ok) {
      const points = pointsForCorrect(combo);
      setScore((s) => s + points);
      setCombo((c) => c + 1);
      setFeedback({ id: answered, ok, message: `正解です。${question} = ${answer}、${points} 点入りました。` });
    } else {
      setScore((s) => s + POINTS_FAILED);
      setCombo(0);
      setFeedback({ id: answered, ok, message: `${question} は ${answer} です。${-POINTS_FAILED} 点減りました。` });
    }
    setAnswered((n) => n + 1);
    setInput("");
    setProblem((current) => nextProblem(current));

    // アプリと同じく、答えるたびに accepted / failed を少しだけ出す
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 700);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!playing || event.metaKey || event.ctrlKey || event.altKey) return;
    const key = event.key.toUpperCase();
    if ((HEX_DIGITS as readonly string[]).includes(key)) {
      event.preventDefault();
      type(key);
    } else if (event.key === "Backspace" || event.key === "Delete") {
      event.preventDefault();
      remove();
    } else if (event.key === "Enter") {
      // フォーカスのあるキーが Enter で押されてしまわないよう、既定の動作は止める
      event.preventDefault();
      submit();
    }
  };

  const status = finished
    ? `時間切れです。${answered} 問に答えて、${score} 点でした。`
    : (feedback?.message ?? (playing ? "" : "スタートを押すと始まります。"));

  return (
    <div className="flex w-full flex-col items-center gap-5" onKeyDown={onKeyDown}>
      {/* iPhone。中身が増えても枠からはみ出さないよう overflow-hidden にする */}
      <div className="relative aspect-[9/19.5] w-full max-w-[300px] overflow-hidden rounded-[52px] border-[11px] border-[#1d1d1f] bg-[#1d1d1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div
          ref={screenRef}
          tabIndex={-1}
          role="group"
          aria-label="FFMultiplier のゲーム画面"
          className="relative flex h-full flex-col overflow-hidden rounded-[41px] bg-[#111111] text-[#F9F8F5] outline-none"
        >
          {/* 上: 閉じる（飾り）と残り時間 */}
          <div className="relative flex h-14 shrink-0 items-end justify-center pb-1">
            <span className="absolute bottom-1 left-6 text-[22px] leading-none text-[#F9F8F5]/80" aria-hidden>
              ✕
            </span>
            <SevenSeg text={String(remaining)} digits={2} label={`残り ${remaining} 秒`} className="text-[18px] text-[#85BF5D]" />
          </div>

          {/* 問題と入力 */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <div className="flex items-center gap-3" role="img" aria-label={`問題: ${hexDigit(problem.left)} × ${hexDigit(problem.right)}`}>
              <Operand value={problem.left} />
              <span className="text-[30px] leading-none" aria-hidden>
                ×
              </span>
              <Operand value={problem.right} />
            </div>
            <SevenSeg text={input || "--"} digits={2} label={input ? `入力中: ${input}` : "未入力"} className="text-[34px]" />
          </div>

          {/* 操作バー: DELETE / 点数 / DONE */}
          <div className="flex shrink-0 items-center justify-between gap-2 px-3 pb-3">
            <button
              type="button"
              onClick={remove}
              disabled={!playing}
              aria-label="1 文字消す"
              className="rounded-full bg-[#B33737] px-3.5 py-2 text-[11px] font-bold tracking-wide text-white motion-safe:transition active:brightness-90"
            >
              DELETE
            </button>
            <span className="flex h-8 min-w-[64px] items-center justify-center rounded-md bg-[#333333] px-2">
              <SevenSeg text={String(score)} label={`${score} 点`} className="text-[15px]" />
            </span>
            <button
              type="button"
              onClick={submit}
              disabled={!playing}
              aria-label="答え合わせ"
              className="rounded-full bg-[#85BF5D] px-3.5 py-2 text-[11px] font-bold tracking-wide text-white motion-safe:transition active:brightness-90"
            >
              DONE
            </button>
          </div>

          {/* 16 進数のキーパッド。高さを固定して、表示が変わっても位置がずれないようにする */}
          <div className="grid h-[44%] shrink-0 grid-cols-4 grid-rows-4 border-t border-white/5 pb-5">
            {HEX_DIGITS.map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => type(digit)}
                disabled={!playing}
                aria-label={`${digit} を入力`}
                className="flex items-center justify-center text-[#BBBBBB] motion-safe:transition-colors active:bg-white/10"
              >
                <SevenSeg text={digit} ghost={false} className="pointer-events-none text-[24px]" />
              </button>
            ))}
          </div>

          {/* accepted / failed の表示（アプリのトーストと同じ文言） */}
          {feedback && toastVisible && (
            <div className="pointer-events-none absolute inset-x-0 top-[17%] flex justify-center" aria-hidden>
              <span
                key={feedback.id}
                className={cn(
                  "rounded-full px-4 py-1.5 text-[13px] font-bold text-white shadow-lg",
                  feedback.ok ? "bg-[#85BF5D]" : "bg-[#B33737]",
                  !reduced && "animate-in fade-in zoom-in-90 duration-150",
                )}
              >
                {feedback.ok ? "accepted" : "failed"}
              </span>
            </div>
          )}

          {/* 始める前と、終わったあと */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 px-6">
              <div className="flex w-full flex-col items-center gap-4 rounded-[24px] bg-[#F9F8F5] px-5 py-6 text-center text-[#1d1d1f]">
                {finished ? (
                  <>
                    <span className="text-[17px] font-bold">Result</span>
                    <span className="flex w-full justify-center rounded-2xl bg-[#111111] py-4 text-[#85BF5D]">
                      <SevenSeg text={String(score)} label={`${score} 点`} className="text-[44px]" />
                    </span>
                    <span className="text-[13px] text-neutral-600">{answered} 問に答えました</span>
                    <button
                      type="button"
                      onClick={start}
                      className="w-full rounded-full bg-[#85BF5D] py-2.5 text-[15px] font-bold text-white motion-safe:transition hover:brightness-95"
                    >
                      もう一度
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-[15px] font-bold leading-snug">
                      16 進数で答えてください
                    </span>
                    <span className="text-[13px] leading-relaxed text-neutral-600">A × 7 なら 46 です。ここでは {DURATION_SECONDS} 秒で試せます。</span>
                    <button
                      type="button"
                      onClick={start}
                      className="w-full rounded-full bg-[#85BF5D] py-2.5 text-[15px] font-bold text-white motion-safe:transition hover:brightness-95"
                    >
                      スタート
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 結果の読み上げ。文の長さが変わっても下が動かないよう、高さを固定する */}
      <div className="flex h-12 w-full max-w-sm items-center justify-center text-center text-[14px] leading-snug text-neutral-600" role="status" aria-live="polite">
        {status}
      </div>
      <p className="hidden text-xs text-neutral-400 sm:block">キーボードの 0〜9・A〜F・Enter・Backspace でも入力できます</p>
    </div>
  );
}

function Operand({ value }: { value: number }) {
  return (
    <span className="flex h-[68px] w-[60px] items-center justify-center rounded-lg bg-[#F9F8F5] text-[#111111]">
      <SevenSeg text={hexDigit(value)} label={hexDigit(value)} className="text-[42px]" />
    </span>
  );
}

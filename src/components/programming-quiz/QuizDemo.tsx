"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";

import { cn } from "@/lib/utils";

import { CATEGORIES, CategoryGlyph, type CategoryId, Crown, GREEN, INDIGO, RED, ResultMark, StarMark } from "./quiz-ui";

/**
 * ページの上で実際に解ける 3 問の体験版。画面のつくりはアプリの QuizView / ResultView に合わせる。
 * 問題はアプリの QuizData.swift から、時間がたっても答えが変わらないものを各カテゴリ 1 問ずつ選んでいる。
 * 動きは Tailwind の motion-safe でだけ付けるので、動きを減らす設定のときは切り替えだけになる。
 */

type Question = { category: CategoryId; text: string; choices: string[]; answer: number };

const QUESTIONS: Question[] = [
  {
    category: "basic",
    text: "プログラミング言語Pythonの名前の由来となったとされるGuido van Rossumの大好きな番組といえば？",
    choices: ["空飛ぶモンティ・パイソン", "山登りモンティ・パイソン", "宇宙に行くモンティ・パイソン"],
    answer: 0,
  },
  {
    category: "iphone",
    text: "Swiftにおいて配列の大きさを取得するために書くのは？",
    choices: [".count", ".size", ".length"],
    answer: 0,
  },
  {
    category: "algorithm",
    text: "再帰関数を用いて木の根をたどるように探索するアルゴリズムといえば？",
    choices: ["深さ優先探索", "幅優先探索", "木の根探索"],
    answer: 0,
  },
];

/** 正解率に応じたコメント。ResultView.swift の comment と同じ区切り */
function commentFor(correct: number, total: number) {
  const ratio = correct / total;
  if (ratio === 1) return "パーフェクト！あなたはプログラミング博士だ！";
  if (ratio >= 0.7) return "お見事！かなりの実力者です。";
  if (ratio >= 0.4) return "いい調子！もう一歩でマスター。";
  return "これから伸びしろたっぷり！復習してみよう。";
}

export function QuizDemo() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [announcement, setAnnouncement] = useState("");

  const nextRef = useRef<HTMLButtonElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const finished = index >= QUESTIONS.length;
  const question = QUESTIONS[Math.min(index, QUESTIONS.length - 1)];
  const answered = selected !== null;
  const isLast = index === QUESTIONS.length - 1;

  // 選んだあとは選択肢が押せなくなるので、フォーカスを「次の問題へ」に移してから読み上げる
  const choose = (choice: number) => {
    if (answered) return;
    const correct = choice === question.answer;
    flushSync(() => {
      setSelected(choice);
      if (correct) setCorrectCount((count) => count + 1);
      setAnnouncement(correct ? "正解です。" : `不正解です。正解は「${question.choices[question.answer]}」です。`);
    });
    nextRef.current?.focus();
  };

  const advance = () => {
    const nextIndex = index + 1;
    const done = nextIndex >= QUESTIONS.length;
    flushSync(() => {
      setSelected(null);
      setIndex(nextIndex);
      // 結果画面では見出しにフォーカスが移るので、点数とコメントは読み上げで伝える
      setAnnouncement(done ? `${correctCount} / ${QUESTIONS.length} 問正解。${commentFor(correctCount, QUESTIONS.length)}` : "");
    });
    (done ? resultRef : questionRef).current?.focus();
  };

  const restart = () => {
    flushSync(() => {
      setIndex(0);
      setSelected(null);
      setCorrectCount(0);
      setAnnouncement("");
    });
    questionRef.current?.focus();
  };

  return (
    <section aria-label="Programming Quiz の体験版。3 問の 3 択クイズを解けます" className="flex w-full flex-col items-center gap-4">
      {/* iPhone。中身の文字量が変わっても枠が伸びないよう、比率で高さを決めてはみ出しは切る。画面の角丸は 52 − 11 = 41px */}
      <div className="relative aspect-[9/19.5] w-full max-w-[300px] overflow-hidden rounded-[52px] border-[11px] border-[#1d1d1f] bg-[#1d1d1f] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
        <div className="relative flex h-full flex-col overflow-hidden rounded-[41px] bg-[#F2F2F7] text-left">
          {/* ホームインジケータ。画面の中身は pb-9（36px）でここから離す */}
          <span className="absolute bottom-2 left-1/2 h-[5px] w-[38%] -translate-x-1/2 rounded-full bg-[#1d1d1f]" aria-hidden />
          <div className="flex items-center justify-between px-7 pt-3.5 text-[12px] font-semibold" aria-hidden>
            <span>9:41</span>
            <span className="h-[24px] w-[80px] rounded-full bg-[#1d1d1f]" />
            <span className="h-[10px] w-[22px] rounded-[3px] bg-[#1d1d1f]" />
          </div>

          {finished ? (
            <div key="result" className="flex flex-1 flex-col items-center gap-5 px-4 pb-9 pt-10 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95">
              {correctCount === QUESTIONS.length ? <Crown className="h-14 w-14" /> : <StarMark className="h-14 w-14" />}
              <h3 ref={resultRef} tabIndex={-1} className="text-[22px] font-bold outline-none">
                結果発表
              </h3>
              <div className="flex w-full flex-col gap-2 rounded-[22px] bg-white px-4 py-6">
                <p className="text-[30px] font-extrabold tracking-tight [font-family:ui-rounded,-apple-system,sans-serif]">
                  {correctCount} / {QUESTIONS.length} 問正解
                </p>
                <p className="h-10 text-[12px] font-semibold leading-[1.6] text-neutral-500">{commentFor(correctCount, QUESTIONS.length)}</p>
              </div>
              <button
                type="button"
                onClick={restart}
                className="mt-auto w-full rounded-full py-3 text-[15px] font-bold text-white hover:brightness-110 motion-safe:transition motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ background: INDIGO, outlineColor: INDIGO }}
              >
                もう一度チャレンジ
              </button>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 px-4 pb-9 pt-6">
              {/* 進み具合 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-neutral-500">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <CategoryGlyph id={question.category} className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{CATEGORIES[question.category].title}</span>
                  </span>
                  <span className="shrink-0">
                    第 {index + 1} 問 / {QUESTIONS.length} 問
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-black/10" aria-hidden>
                  <div
                    className="h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500"
                    style={{ width: `${((index + 1) / QUESTIONS.length) * 100}%`, background: INDIGO }}
                  />
                </div>
              </div>

              {/* 問題文。長さが違っても選択肢の位置が動かないよう、高さを固定する */}
              <p
                ref={questionRef}
                tabIndex={-1}
                key={`q-${index}`}
                className="flex h-[132px] items-center overflow-hidden rounded-[18px] bg-white px-4 text-[14px] font-semibold leading-[1.6] outline-none motion-safe:animate-in motion-safe:fade-in"
              >
                {question.text}
              </p>

              <div className="flex flex-col gap-2.5" role="group" aria-label="選択肢">
                {question.choices.map((choice, i) => {
                  const tint = !answered ? null : i === question.answer ? GREEN : i === selected ? RED : null;
                  return (
                    <button
                      key={`${index}-${choice}`}
                      type="button"
                      onClick={() => choose(i)}
                      disabled={answered}
                      className={cn(
                        "flex h-12 items-center justify-between gap-2 rounded-[14px] bg-white px-4 text-left text-[13px] font-semibold motion-safe:transition-colors",
                        !answered && "hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                        answered && !tint && "text-neutral-400",
                      )}
                      style={
                        tint
                          ? { background: `${tint}2E`, color: tint === GREEN ? "#248A3D" : "#D70015", boxShadow: `inset 0 0 0 2px ${tint}` }
                          : { outlineColor: INDIGO }
                      }
                    >
                      <span className="truncate">{choice}</span>
                      {tint && <ResultMark correct={tint === GREEN} className="h-5 w-5 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* 正誤の一言。読み上げは下の aria-live に任せるので、ここは見た目だけ。高さは固定 */}
              <div className="flex h-8 items-center justify-center" aria-hidden>
                {answered && (
                  <span
                    key={`v-${index}`}
                    className="text-[17px] font-bold motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-90"
                    style={{ color: selected === question.answer ? "#248A3D" : "#D70015" }}
                  >
                    {selected === question.answer ? "正解！" : "残念！"}
                  </span>
                )}
              </div>

              {/* 答えたあとにだけ見せる。場所は最初から取っておき、出たときに画面がずれないようにする */}
              <button
                ref={nextRef}
                type="button"
                onClick={advance}
                className={cn(
                  "mt-auto w-full rounded-full py-3 text-[15px] font-bold text-white hover:brightness-110 motion-safe:transition motion-safe:active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  answered ? "visible motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2" : "invisible",
                )}
                style={{ background: INDIGO, outlineColor: INDIGO }}
              >
                {isLast ? "結果を見る" : "次の問題へ"}
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}

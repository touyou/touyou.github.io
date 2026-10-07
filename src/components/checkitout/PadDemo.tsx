"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

import { Phrases } from "@/components/app-lp";
import { cn } from "@/lib/utils";

import { glow, RAISED } from "./lp";
import { MiniModeControls, SoundRow } from "./mini-ui";
import {
  APP_BACKGROUND,
  DEMO_PADS,
  LOOP_BPM,
  LOOP_PATTERN,
  PAD_COLORS,
  PAD_FILL,
  PAD_FILL_PRESSED,
  padIndexForKey,
  stepSeconds,
} from "./pads";
import { PadSynth } from "./synth";

/**
 * ヒーローの、押して鳴らせるパッド。アプリの縦長レイアウト（ContentView.swift の PortraitLayout）を描き直したもの。
 * 音はアプリに入っている音ではなく、ブラウザの中で合成したドラム・ベース・和音・メロディ。人の声は使わない。
 * 「ループ」はこのページだけのおまけで、アプリの機能ではない。
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/** 動きを減らす設定。サーバーでは分からないので、動く前提で描く */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/** パッドを押した色にしておく時間 */
const FLASH_MS = 140;

export function PadDemo() {
  const synthRef = useRef<PadSynth | null>(null);
  // パッドごとに、最後に光らせた回の番号を持つ。連打したとき、前の回のタイマーで早く消えないようにする
  const flashTokens = useRef<number[]>(Array(16).fill(0));
  // 光を消すタイマー。アンマウントのときにまとめて止める
  const flashTimers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const [lit, setLit] = useState<ReadonlySet<number>>(() => new Set());
  const [looping, setLooping] = useState(false);
  const [lastPad, setLastPad] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  const synth = useCallback(() => {
    synthRef.current ??= new PadSynth();
    return synthRef.current;
  }, []);

  const flash = useCallback((index: number) => {
    const token = ++flashTokens.current[index];
    setLit((current) => new Set(current).add(index));
    const timers = flashTimers.current;
    const id = setTimeout(() => {
      timers.delete(id);
      if (flashTokens.current[index] !== token) return;
      setLit((current) => {
        const next = new Set(current);
        next.delete(index);
        return next;
      });
    }, FLASH_MS);
    timers.add(id);
  }, []);

  const trigger = useCallback(
    (index: number) => {
      synth().play(DEMO_PADS[index].voice);
      flash(index);
      setLastPad(index);
    },
    [flash, synth],
  );

  // キーボードの 1〜4・Q〜R・A〜F・Z〜V でも鳴らす
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return;
      const index = padIndexForKey(event.key);
      if (index === null) return;
      event.preventDefault();
      trigger(index);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [trigger]);

  // ループ。少し先までの音を AudioContext の時刻で予約して、タイマーの揺れでリズムが崩れないようにする
  useEffect(() => {
    if (!looping) return;
    const s = synth();
    const step = stepSeconds(LOOP_BPM);
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let next = s.currentTime + 0.05;
    let position = 0;

    const tick = () => {
      const now = s.currentTime;
      // タブが裏にあってタイマーが止まっていたら、溜まった分をまとめて鳴らさずに今から数え直す
      if (next < now) next = now + 0.05;
      while (next < now + 0.12) {
        for (const index of LOOP_PATTERN[position]) {
          s.play(DEMO_PADS[index].voice, next);
          if (!reduced) {
            const id = setTimeout(
              () => {
                timers.delete(id);
                flash(index);
              },
              Math.max(0, (next - now) * 1000),
            );
            timers.add(id);
          }
        }
        next += step;
        position = (position + 1) % LOOP_PATTERN.length;
      }
    };
    tick();
    const interval = setInterval(tick, 25);
    return () => {
      clearInterval(interval);
      for (const id of timers) clearTimeout(id);
    };
  }, [looping, reduced, flash, synth]);

  // ページを離れたら、音と光を消すタイマーを止める
  useEffect(() => {
    const timers = flashTimers.current;
    return () => {
      for (const id of timers) clearTimeout(id);
      timers.clear();
      synthRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-5">
      {/* iPhone。中身の高さに引っぱられないよう、枠は縦横比で決めて中をはみ出させない。画面の角丸は 52 − 11 = 41px */}
      <div className="relative aspect-[9/19.5] w-full max-w-[300px] overflow-hidden rounded-[52px] border-[11px] border-[#2A2A2C] bg-[#2A2A2C] shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_30px_80px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex h-full flex-col gap-3 overflow-hidden rounded-[41px] px-4 pb-9 pt-12 text-left text-white" style={{ background: APP_BACKGROUND }}>
          {/* アプリはステータスバーを隠すので、Dynamic Island だけを描く */}
          <span className="absolute left-1/2 top-3 h-[24px] w-[80px] -translate-x-1/2 rounded-full bg-black" aria-hidden />
          <p className="text-center text-[17px] font-bold tracking-wide" aria-hidden>
            チェケラ
          </p>

          <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="16 個のパッド">
            {DEMO_PADS.map((pad) => {
              const on = lit.has(pad.index);
              return (
                <button
                  key={pad.index}
                  type="button"
                  aria-label={`${pad.name}を鳴らす`}
                  aria-keyshortcuts={pad.key.toUpperCase()}
                  onPointerDown={(event) => {
                    // マウス・指は押した瞬間に鳴らす（離すまで待つと遅れて聞こえる）
                    if (event.button !== 0) return;
                    event.preventDefault();
                    trigger(pad.index);
                  }}
                  onClick={(event) => {
                    // キーボードの Enter・スペースで押したときだけ（detail が 0）。ポインターでは onPointerDown で鳴らしている
                    if (event.detail === 0) trigger(pad.index);
                  }}
                  className={cn(
                    "relative flex aspect-square touch-manipulation select-none items-end overflow-hidden rounded-[10px] border-[3px] p-1 outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:transition-transform motion-safe:duration-75",
                    on && "motion-safe:scale-95",
                  )}
                  style={{ borderColor: PAD_COLORS[pad.color], background: on ? PAD_FILL_PRESSED : PAD_FILL, boxShadow: glow(pad.color, on ? 2 : 1) }}
                >
                  <span className="truncate text-[8px] font-semibold leading-none text-white/90">{pad.name}</span>
                </button>
              );
            })}
          </div>

          {/* 下端の操作は、ホームインジケータの分（36px）だけ画面の端から離す */}
          {/* 音の一覧。アプリと同じく残りの高さいっぱいに広げ、入りきらない行は下をぼかして隠す（アプリではスクロールできる） */}
          <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-hidden rounded-xl bg-white/[0.06] p-1.5 ring-1 ring-white/10 [mask-image:linear-gradient(to_bottom,black_75%,transparent)]" aria-hidden>
            {DEMO_PADS.map((pad) => (
              <SoundRow key={pad.index} name={pad.name} pad={pad.index} selected={lastPad === pad.index} />
            ))}
          </div>

          <div aria-hidden>
            <MiniModeControls mode="play" />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => {
            // 最初の操作のうちに AudioContext を作っておく
            synth().ensure();
            setLooping((v) => !v);
          }}
          aria-pressed={looping}
          className="h-11 min-w-[10em] rounded-full border-2 px-5 text-[15px] font-bold hover:brightness-125 motion-safe:transition"
          style={{ borderColor: PAD_COLORS.green, color: PAD_COLORS.green, background: RAISED, boxShadow: glow("green", looping ? 2 : 1) }}
        >
          {looping ? "リズムを止める" : "リズムを流す"}
        </button>
        <p className="flex max-w-sm flex-col gap-1 text-xs leading-[1.7] text-white/55">
          <span>
            <Phrases phrases={["パッドを押すと", "音が鳴ります。"]} />
            <span className="hidden sm:inline">
              <Phrases phrases={["キーボードの", "1〜4・Q〜R・A〜F・Z〜V", "でも鳴らせます。"]} />
            </span>
          </span>
          <span>
            <Phrases phrases={["このページの音は", "ブラウザで合成したもので、", "アプリに入っている", "音とは違います。"]} />
          </span>
        </p>
      </div>
    </div>
  );
}

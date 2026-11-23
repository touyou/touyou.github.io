"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/**
 * スクロールに合わせて iPhone Duo がひらき、月が満ちていく。
 * 絵は byobu-render で 20°〜180° を 10° 刻みに書き出した二扇（-a / -b）。角度に近いコマを出し、扇は CSS の 3D で傾ける。
 */
const ANGLES = Array.from({ length: 17 }, (_, i) => 20 + i * 10);
const MIN = ANGLES[0];
const MAX = ANGLES[ANGLES.length - 1];

const REDUCE = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCE);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function phaseName(angle: number) {
  if (angle < 60) return "三日月";
  if (angle < 110) return "上弦";
  if (angle < 165) return "十三夜";
  return "望月";
}

export function DuoUnfold() {
  const wrap = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(MAX);
  // 動きを減らす設定と、サーバーで描くときは、ひらいた姿のまま止めておく
  const animated = useSyncExternalStore(subscribeMotion, () => !window.matchMedia(REDUCE).matches, () => false);

  useEffect(() => {
    if (!animated) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = wrap.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -rect.top / Math.max(range, 1)));
      setAngle(MIN + (MAX - MIN) * p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [animated]);

  const shown = ANGLES.reduce((a, b) => (Math.abs(b - angle) < Math.abs(a - angle) ? b : a));
  const tilt = (180 - angle) / 2;
  // 傾いた扇ほど、こちらに向く光が減る。平たい黒を重ねるだけ（光彩やグラデーションは使わない）
  const shade = Math.sin((tilt * Math.PI) / 180) * 0.45;

  const device = (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-[min(560px,calc((100svh-12rem)*1.3))] [perspective:1400px]">
        <div className="flex justify-center [transform-style:preserve-3d] [transform:rotateX(8deg)]">
          {(["a", "b"] as const).map((side) => (
            <div
              key={side}
              className="relative w-1/2 bg-[#1d1d1f] p-[2.2%] ring-1 ring-white/15 [transform-style:preserve-3d]"
              style={{
                transformOrigin: side === "a" ? "right center" : "left center",
                transform: `rotateY(${side === "a" ? tilt : -tilt}deg)`,
                borderRadius: side === "a" ? "7% 0 0 7% / 5% 0 0 5%" : "0 7% 7% 0 / 0 5% 5% 0",
              }}
            >
              <div className="relative aspect-[480/737] overflow-hidden bg-black" style={{ borderRadius: side === "a" ? "5% 0 0 5% / 3.4% 0 0 3.4%" : "0 5% 5% 0 / 0 3.4% 3.4% 0" }}>
                {ANGLES.map((a) => (
                  <Image
                    key={a}
                    src={`/tsukibyobu/unfold/duo-${String(a).padStart(3, "0")}-${side}.webp`}
                    alt=""
                    fill
                    unoptimized
                    sizes="320px"
                    className="object-cover"
                    style={{ opacity: a === shown ? 1 : 0 }}
                  />
                ))}
                <span aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: shade }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="flex items-baseline gap-4 font-sans text-[13px] tracking-[0.1em] text-[#8E8BA0]">
        <span className="tabular-nums">{Math.round(angle)}°</span>
        <span className="font-['Hiragino_Mincho_ProN','Yu_Mincho','YuMincho','Noto_Serif_JP',serif] text-[15px] text-[#ECE9DF]">{phaseName(angle)}</span>
      </p>
    </div>
  );

  return (
    <div role="img" aria-label="iPhone Duo をひらいていくと、屏風の月が三日月から望月へ満ちていく" className="w-full">
      {animated ? (
        <div ref={wrap} className="relative h-[220vh]">
          <div className="sticky top-12 flex h-[calc(100svh-3rem)] items-center justify-center">{device}</div>
        </div>
      ) : (
        device
      )}
    </div>
  );
}

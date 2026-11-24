"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * スクロールに合わせて iPhone Duo がひらき、月が満ちていく。
 * 絵は byobu-render で 20°〜180° を 10° 刻みに書き出し、Apple の iPhone Duo の枠（Design Resources）に焼き込んでからヒンジで左右に切ったもの（-a / -b）。
 * 枠の画像そのものは置かず、焼き込んだ絵だけを使う。角度に近いコマを出し、左右は CSS の 3D で傾ける。
 */
const ANGLES = Array.from({ length: 17 }, (_, i) => 20 + i * 10);
const MIN = ANGLES[0];
const MAX = ANGLES[ANGLES.length - 1];
/** 厚みの板の枚数。8 枚 × 0.75cqw で半面の幅の 6%（実機の厚みの比に近い） */
const LAYERS = Array.from({ length: 8 }, (_, i) => i);

function phaseName(angle: number) {
  if (angle < 60) return "三日月";
  if (angle < 110) return "上弦";
  if (angle < 165) return "十三夜";
  return "望月";
}

export function DuoUnfold() {
  const wrap = useRef<HTMLDivElement>(null);
  const [angle, setAngle] = useState(MAX);
  useEffect(() => {
    // 動きを減らす設定では、ひらいた姿のまま止めておく（高さと sticky も CSS の motion-safe で外れる）
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
  }, []);

  const shown = ANGLES.reduce((a, b) => (Math.abs(b - angle) < Math.abs(a - angle) ? b : a));
  const tilt = (180 - angle) / 2;
  // 傾いた扇ほど、こちらに向く光が減る。明るさを一様に落とすだけ（光彩やグラデーションは使わない）
  const shade = Math.sin((tilt * Math.PI) / 180) * 0.45;

  const device = (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="w-full max-w-[min(600px,calc((100svh-12rem)*1.37))] [perspective:1400px]">
        <div className="relative flex justify-center [transform-style:preserve-3d] [transform:rotateX(8deg)]">
          {/* 床に落ちる影。ひらくほど横に広がる。浮いて見えないように足元へ置く */}
          <div
            aria-hidden
            className="absolute -bottom-[3%] left-1/2 h-[5%] -translate-x-1/2 rounded-[50%] bg-black blur-2xl"
            style={{ width: `${Math.cos((tilt * Math.PI) / 180) * 92}%` }}
          />
          {(["a", "b"] as const).map((side) => (
            <div
              key={side}
              className="relative aspect-[640/930] w-1/2 [container-type:inline-size] [transform-style:preserve-3d]"
              style={{
                transformOrigin: side === "a" ? "right center" : "left center",
                transform: `rotateY(${side === "a" ? tilt : -tilt}deg)`,
              }}
            >
              {/* 厚み。枠の輪郭（絵の不透明な所）で切った板を奥へ重ね、角丸に沿った側面にする。板の間隔は半面の幅に対する割合（cqw） */}
              {LAYERS.map((i) => (
                <div
                  key={i}
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: i === LAYERS.length - 1 ? "#0e0f12" : "#2a2b31",
                    filter: `brightness(${0.5 + 0.5 * Math.sin((tilt * Math.PI) / 180)})`,
                    transform: `translateZ(${-(i + 1) * 0.75}cqw)`,
                    WebkitMask: `url(/tsukibyobu/unfold/duo-180-${side}.webp) center / contain no-repeat`,
                    mask: `url(/tsukibyobu/unfold/duo-180-${side}.webp) center / contain no-repeat`,
                  }}
                />
              ))}
              <div className="absolute inset-0" style={{ filter: `brightness(${1 - shade})` }}>
                {ANGLES.map((a) => (
                  <Image
                    key={a}
                    src={`/tsukibyobu/unfold/duo-${String(a).padStart(3, "0")}-${side}.webp`}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain"
                    style={{ opacity: a === shown ? 1 : 0 }}
                  />
                ))}
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
    // サーバーでも同じ高さで描き、読み込んだあとにページが伸びないようにする
    <div role="img" aria-label="iPhone Duo をひらく角度に合わせて、屏風の月が三日月から望月へ満ちる" className="w-full">
      <div ref={wrap} className="relative motion-safe:h-[220vh]">
        <div className="flex items-center justify-center motion-safe:sticky motion-safe:top-12 motion-safe:h-[calc(100svh-3rem)]">{device}</div>
      </div>
    </div>
  );
}

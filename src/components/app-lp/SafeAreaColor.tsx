"use client";

import { useEffect } from "react";

/**
 * iPhone の上下のセーフエリアと、引っぱりすぎたときに見える地の色を、ページの上端と下端の色にそろえる。
 * 地（html の背景）は 1 色しか持てないので、ページの後半にいるあいだは下端の色に切り替える。
 */
export function SafeAreaColor({ top, bottom = top }: { top: string; bottom?: string }) {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const apply = () => {
      frame = 0;
      const half = (root.scrollHeight - window.innerHeight) / 2;
      const color = window.scrollY > half ? bottom : top;
      root.style.backgroundColor = color;
      document.body.style.backgroundColor = color;
    };
    apply();
    if (top === bottom) {
      return () => {
        root.style.backgroundColor = "";
        document.body.style.backgroundColor = "";
      };
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, [top, bottom]);

  // 読み込み直後（スクリプトが動く前）から上端の色にしておく。layout の bg-background より強く、上の inline style よりは弱い詳細度にする
  return <style>{`html.bg-background,body.bg-background{background-color:${top}}`}</style>;
}

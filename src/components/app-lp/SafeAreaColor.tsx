"use client";

import { useEffect } from "react";

/**
 * iPhone の上下のセーフエリアと、引っぱりすぎたときに見える地の色を、ページの上端と下端の色にそろえる。
 * 地（html の背景）は 1 色しか持てないので、ページの後半にいるあいだは下端の色に切り替える。
 */
export function SafeAreaColor({ top, bottom = top }: { top: string; bottom?: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
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
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      root.style.backgroundColor = "";
      document.body.style.backgroundColor = "";
    };
  }, [top, bottom]);

  // 読み込み直後（スクリプトが動く前）から上端の色にしておく
  return <style>{`html,body{background-color:${top}}`}</style>;
}

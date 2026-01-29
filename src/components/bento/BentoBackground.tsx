"use client";

import { useEffect } from "react";

const BENTO_BG_COLOR = "#f5f5f7";

export function BentoBackground() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Store original values
    const originalHtmlBg = html.style.backgroundColor;
    const originalBodyBg = body.style.backgroundColor;

    // Set bento background color
    html.style.backgroundColor = BENTO_BG_COLOR;
    body.style.backgroundColor = BENTO_BG_COLOR;

    // Cleanup on unmount
    return () => {
      html.style.backgroundColor = originalHtmlBg;
      body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  return null;
}

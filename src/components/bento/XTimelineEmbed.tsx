"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const X_USERNAME = "touyou_dev";
const X_PROFILE_URL = `https://twitter.com/${X_USERNAME}`;

interface TwitterWindow extends Window {
  twttr?: {
    widgets?: {
      load: (el: HTMLElement | null) => void;
    };
  };
}

function loadTwitterWidgets(el: HTMLElement | null) {
  const twitterWindow = window as TwitterWindow;
  twitterWindow.twttr?.widgets?.load(el);
}

export function XTimelineEmbed() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Re-initialize Twitter widget when script is already loaded
  useEffect(() => {
    if (typeof window !== "undefined") {
      loadTwitterWidgets(containerRef.current);
    }
  }, []);

  return (
    <section>
      <div className="px-1 mb-3">
        <a
          href={X_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="text-gray-600 text-sm font-semibold hover:text-gray-900 transition-colors"
        >
          X (Twitter)
        </a>
      </div>
      <div
        ref={containerRef}
        className="rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <a
          className="twitter-timeline"
          data-height="600"
          data-chrome="noheader nofooter noborders"
          data-theme="light"
          href={X_PROFILE_URL}
        >
          Tweets by {X_USERNAME}
        </a>
      </div>
      <Script
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => loadTwitterWidgets(containerRef.current)}
      />
    </section>
  );
}

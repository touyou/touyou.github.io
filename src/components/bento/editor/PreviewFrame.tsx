import type { Ref } from "react";
import type { PreviewMode } from "./types";

export function PreviewFrame({
  previewMode,
  iframeRef,
}: {
  previewMode: PreviewMode;
  iframeRef: Ref<HTMLIFrameElement>;
}) {
  return (
    <div className="flex-1 bg-gray-200 p-4 flex items-start justify-center overflow-auto">
      <div
        className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
          previewMode === "sp" ? "w-[375px]" : "w-full max-w-4xl"
        }`}
        style={{
          height: previewMode === "sp" ? "667px" : "calc(100% - 16px)",
        }}
      >
        <iframe
          ref={iframeRef}
          src="/bento/preview"
          className="w-full h-full border-0"
          title="Bento Preview"
        />
      </div>
    </div>
  );
}

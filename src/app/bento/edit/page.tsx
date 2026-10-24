"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import type { BentoData } from "@/lib/bento-types";
import initialBentoData from "@/data/bento-links.json";
import { EditorHeader } from "@/components/bento/editor/EditorHeader";
import { LinkSectionsPanel } from "@/components/bento/editor/LinkSectionsPanel";
import { YouTubeSectionsPanel } from "@/components/bento/editor/YouTubeSectionsPanel";
import { LinkEditForm } from "@/components/bento/editor/LinkEditForm";
import { YouTubeEditForm } from "@/components/bento/editor/YouTubeEditForm";
import { PreviewFrame } from "@/components/bento/editor/PreviewFrame";
import { useBentoEditor } from "@/components/bento/editor/useBentoEditor";
import type { PreviewMode, SaveMessage } from "@/components/bento/editor/types";

const PREVIEW_STORAGE_KEY = "bento-preview-data";

type AccessState = "checking" | "allowed" | "denied";

const subscribeNever = () => () => {};

function localAccessState(): AccessState {
  const hostname = window.location.hostname;
  const isLocalhost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname === "[::1]";
  return isLocalhost ? "allowed" : "denied";
}

const initialJson = JSON.stringify(initialBentoData);

export default function BentoEditPage() {
  // "checking" during SSR and hydration, then the hostname check on the client
  const accessState = useSyncExternalStore<AccessState>(
    subscribeNever,
    localAccessState,
    () => "checking",
  );
  const editor = useBentoEditor(initialBentoData as BentoData);
  const { data } = editor;
  const [previewMode, setPreviewMode] = useState<PreviewMode>("pc");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);
  // Saving clears the indicator until the data changes again
  const [savedData, setSavedData] = useState<BentoData | null>(null);
  const hasChanges = data !== savedData && JSON.stringify(data) !== initialJson;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Sync to preview iframe
  useEffect(() => {
    // Save to sessionStorage for initial load
    sessionStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(data));

    // Send to iframe via postMessage
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "bento-preview-update", data },
        "*",
      );
    }
  }, [data]);

  // Reset to file state
  const { reset } = editor;
  const handleReset = useCallback(() => {
    reset();
    setSaveMessage({ type: "success", text: "Reset to saved state" });
    setTimeout(() => setSaveMessage(null), 2000);
  }, [reset]);

  // Save to file
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const response = await fetch("/api/bento/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSaveMessage({ type: "success", text: "Saved successfully!" });
        setSavedData(data);
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setSaveMessage({
          type: "error",
          text: errorData.error || "Failed to save",
        });
      }
    } catch {
      setSaveMessage({ type: "error", text: "Failed to save" });
    } finally {
      setIsSaving(false);
    }
  }, [data]);

  // Download JSON
  const handleDownload = useCallback(() => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bento-links.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [data]);

  // Show loading while checking access
  if (accessState === "checking") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // Show 404-like page for non-localhost
  if (accessState === "denied") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <p className="text-gray-500 mt-4">
          This page is only available on localhost.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <EditorHeader
        saveMessage={saveMessage}
        previewMode={previewMode}
        onPreviewModeChange={setPreviewMode}
        hasChanges={hasChanges}
        isSaving={isSaving}
        onReset={handleReset}
        onSave={handleSave}
        onDownload={handleDownload}
      />

      <div className="flex">
        {/* Left Panel - Editor */}
        <div className="w-1/2 h-[calc(100vh-57px)] overflow-y-auto p-4">
          <LinkSectionsPanel editor={editor} />
          <YouTubeSectionsPanel editor={editor} />
        </div>

        {/* Right Panel - Preview + Edit Form */}
        <div className="w-1/2 h-[calc(100vh-57px)] border-l border-gray-200 flex flex-col">
          <LinkEditForm editor={editor} />
          <YouTubeEditForm editor={editor} />
          <PreviewFrame previewMode={previewMode} iframeRef={iframeRef} />
        </div>
      </div>
    </div>
  );
}

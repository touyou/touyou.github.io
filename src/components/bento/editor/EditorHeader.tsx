"use client";

import type { PreviewMode, SaveMessage } from "./types";

interface Props {
  saveMessage: SaveMessage | null;
  previewMode: PreviewMode;
  onPreviewModeChange: (mode: PreviewMode) => void;
  hasChanges: boolean;
  isSaving: boolean;
  onReset: () => void;
  onSave: () => void;
  onDownload: () => void;
}

export function EditorHeader({
  saveMessage,
  previewMode,
  onPreviewModeChange,
  hasChanges,
  isSaving,
  onReset,
  onSave,
  onDownload,
}: Props) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Bento Editor</h1>
        <div className="flex items-center gap-3">
          {/* Save message */}
          {saveMessage && (
            <span
              className={`text-sm ${
                saveMessage.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {saveMessage.text}
            </span>
          )}
          {/* Preview mode toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPreviewModeChange("pc")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                previewMode === "pc"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              PC
            </button>
            <button
              onClick={() => onPreviewModeChange("sp")}
              className={`px-3 py-1 text-sm rounded-md transition ${
                previewMode === "sp"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              SP
            </button>
          </div>
          {/* Reset button */}
          <button
            onClick={onReset}
            disabled={!hasChanges}
            className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
          {/* Unsaved changes indicator */}
          {hasChanges && (
            <span className="text-xs text-orange-500">Unsaved changes</span>
          )}
          {/* Save button */}
          <button
            onClick={onSave}
            disabled={isSaving}
            className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save to File"}
          </button>
          {/* Download button */}
          <button
            onClick={onDownload}
            className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Download JSON
          </button>
        </div>
      </div>
    </header>
  );
}

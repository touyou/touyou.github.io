"use client";

import { useState, useCallback, useEffect } from "react";
import type { BentoData, BentoSection, BentoLink, CardType, SocialPlatform } from "@/lib/bento-types";
import initialBentoData from "@/data/bento-links.json";

// Preview mode type
type PreviewMode = "pc" | "sp";

// Drag state type
interface DragState {
  sectionId: string;
  linkIndex: number;
}

// Card type options
const cardTypeOptions: { value: CardType; label: string }[] = [
  { value: "social", label: "Social" },
  { value: "ogp", label: "OGP" },
  { value: "image", label: "Image" },
  { value: "simple", label: "Simple" },
];

// Platform options
const platformOptions: { value: SocialPlatform; label: string }[] = [
  { value: "twitter", label: "Twitter" },
  { value: "github", label: "GitHub" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "threads", label: "Threads" },
  { value: "bluesky", label: "Bluesky" },
  { value: "fedibird", label: "Fedibird" },
  { value: "zenn", label: "Zenn" },
  { value: "qiita", label: "Qiita" },
  { value: "speakerdeck", label: "SpeakerDeck" },
  { value: "gitlab", label: "GitLab" },
  { value: "google", label: "Google" },
  { value: "wantedly", label: "Wantedly" },
  { value: "hoyolab", label: "HoYoLAB" },
  { value: "hatena", label: "Hatena" },
];

// Access state type
type AccessState = "checking" | "allowed" | "denied";

export default function BentoEditPage() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [data, setData] = useState<BentoData>(initialBentoData as BentoData);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("pc");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverState, setDragOverState] = useState<DragState | null>(null);
  const [editingLink, setEditingLink] = useState<{ sectionId: string; linkIndex: number } | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  // Check access on mount
  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname === "[::1]";

    setAccessState(isLocalhost ? "allowed" : "denied");
  }, []);

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

  // Refresh preview
  const refreshPreview = useCallback(() => {
    setPreviewKey((prev) => prev + 1);
  }, []);

  // Drag handlers
  const handleDragStart = useCallback((sectionId: string, linkIndex: number) => {
    setDragState({ sectionId, linkIndex });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, sectionId: string, linkIndex: number) => {
    e.preventDefault();
    setDragOverState({ sectionId, linkIndex });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (dragState && dragOverState && dragState.sectionId === dragOverState.sectionId) {
      const { sectionId, linkIndex: fromIndex } = dragState;
      const { linkIndex: toIndex } = dragOverState;

      if (fromIndex !== toIndex) {
        setData((prev) => {
          const newSections = prev.sections.map((section) => {
            if (section.id === sectionId) {
              const newLinks = [...section.links];
              const [movedItem] = newLinks.splice(fromIndex, 1);
              newLinks.splice(toIndex, 0, movedItem);
              return { ...section, links: newLinks };
            }
            return section;
          });
          return { ...prev, sections: newSections };
        });
      }
    }
    setDragState(null);
    setDragOverState(null);
  }, [dragState, dragOverState]);

  // Update link
  const updateLink = useCallback((sectionId: string, linkIndex: number, updates: Partial<BentoLink>) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          const newLinks = [...section.links];
          newLinks[linkIndex] = { ...newLinks[linkIndex], ...updates };
          return { ...section, links: newLinks };
        }
        return section;
      }),
    }));
  }, []);

  // Delete link
  const deleteLink = useCallback((sectionId: string, linkIndex: number) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          const newLinks = section.links.filter((_, i) => i !== linkIndex);
          return { ...section, links: newLinks };
        }
        return section;
      }),
    }));
    setEditingLink(null);
  }, []);

  // Add new link
  const addLink = useCallback((sectionId: string) => {
    const newLink: BentoLink = {
      url: "https://example.com",
      title: "New Link",
      cardType: "simple",
    };
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, links: [...section.links, newLink] };
        }
        return section;
      }),
    }));
  }, []);

  // Update section title
  const updateSectionTitle = useCallback((sectionId: string, title: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => {
        if (section.id === sectionId) {
          return { ...section, title };
        }
        return section;
      }),
    }));
  }, []);

  // Add new section
  const addSection = useCallback(() => {
    const newSection: BentoSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      links: [],
    };
    setData((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }, []);

  // Delete section
  const deleteSection = useCallback((sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  }, []);

  // Get link being edited
  const editingLinkData = editingLink
    ? data.sections.find((s) => s.id === editingLink.sectionId)?.links[editingLink.linkIndex] || null
    : null;

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
        <p className="text-gray-500 mt-4">This page is only available on localhost.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Bento Editor</h1>
          <div className="flex items-center gap-3">
            {/* Preview mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPreviewMode("pc")}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  previewMode === "pc"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                PC
              </button>
              <button
                onClick={() => setPreviewMode("sp")}
                className={`px-3 py-1 text-sm rounded-md transition ${
                  previewMode === "sp"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                SP
              </button>
            </div>
            {/* Refresh preview */}
            <button
              onClick={refreshPreview}
              className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Refresh Preview
            </button>
            {/* Download button */}
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Download JSON
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Panel - Editor */}
        <div className="w-1/2 h-[calc(100vh-57px)] overflow-y-auto p-4">
          {/* Sections */}
          {data.sections.map((section) => (
            <div key={section.id} className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 border-b">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                  placeholder="Section Title (empty for no header)"
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                />
                <button
                  onClick={() => addLink(section.id)}
                  className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                >
                  + Link
                </button>
                <button
                  onClick={() => deleteSection(section.id)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>

              {/* Links */}
              <div className="p-2">
                {section.links.map((link, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(section.id, index)}
                    onDragOver={(e) => handleDragOver(e, section.id, index)}
                    onDragEnd={handleDragEnd}
                    onClick={() => setEditingLink({ sectionId: section.id, linkIndex: index })}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                      dragOverState?.sectionId === section.id && dragOverState?.linkIndex === index
                        ? "bg-blue-100 border-2 border-blue-400"
                        : editingLink?.sectionId === section.id && editingLink?.linkIndex === index
                        ? "bg-blue-50 border border-blue-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Drag handle */}
                    <span className="text-gray-400 cursor-grab active:cursor-grabbing select-none">&#x2630;</span>
                    {/* Card type badge */}
                    <span className={`px-1.5 py-0.5 text-xs rounded ${
                      link.cardType === "social" ? "bg-purple-100 text-purple-700" :
                      link.cardType === "ogp" ? "bg-orange-100 text-orange-700" :
                      link.cardType === "image" ? "bg-green-100 text-green-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {link.cardType}
                    </span>
                    {/* Title */}
                    <span className="flex-1 text-sm text-gray-700 truncate">{link.title}</span>
                  </div>
                ))}
                {section.links.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No links in this section</p>
                )}
              </div>
            </div>
          ))}

          {/* Add section button */}
          <button
            onClick={addSection}
            className="w-full py-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600 transition"
          >
            + Add Section
          </button>
        </div>

        {/* Right Panel - Preview + Edit Form */}
        <div className="w-1/2 h-[calc(100vh-57px)] border-l border-gray-200 flex flex-col">
          {/* Edit Form (when link is selected) */}
          {editingLink && editingLinkData && (
            <div className="p-4 bg-white border-b border-gray-200 overflow-y-auto max-h-[40%]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Edit Link</h3>
                <button
                  onClick={() => setEditingLink(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingLinkData.title}
                    onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { title: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                </div>
                {/* URL */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL</label>
                  <input
                    type="url"
                    value={editingLinkData.url}
                    onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { url: e.target.value })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                </div>
                {/* Card Type */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Card Type</label>
                  <select
                    value={editingLinkData.cardType}
                    onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { cardType: e.target.value as CardType })}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  >
                    {cardTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                {/* Platform (for social) */}
                {editingLinkData.cardType === "social" && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Platform</label>
                      <select
                        value={editingLinkData.platform || ""}
                        onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { platform: e.target.value as SocialPlatform })}
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      >
                        <option value="">Select platform</option>
                        {platformOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Username</label>
                      <input
                        type="text"
                        value={editingLinkData.username || ""}
                        onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { username: e.target.value || undefined })}
                        placeholder="@username"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      />
                    </div>
                  </>
                )}
                {/* Image fields (for image) */}
                {editingLinkData.cardType === "image" && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Image Source</label>
                      <input
                        type="text"
                        value={editingLinkData.imageSrc || ""}
                        onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { imageSrc: e.target.value || undefined })}
                        placeholder="/bento/image.jpg"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Span</label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={editingLinkData.span || 1}
                          onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { span: parseInt(e.target.value) || 1 })}
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">Aspect Ratio</label>
                        <input
                          type="text"
                          value={editingLinkData.aspectRatio || ""}
                          onChange={(e) => updateLink(editingLink.sectionId, editingLink.linkIndex, { aspectRatio: e.target.value || undefined })}
                          placeholder="16/9"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Delete button */}
                <button
                  onClick={() => deleteLink(editingLink.sectionId, editingLink.linkIndex)}
                  className="w-full py-1.5 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                >
                  Delete Link
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="flex-1 bg-gray-200 p-4 flex items-start justify-center overflow-auto">
            <div
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all ${
                previewMode === "sp" ? "w-[375px]" : "w-full max-w-4xl"
              }`}
              style={{ height: previewMode === "sp" ? "667px" : "calc(100% - 16px)" }}
            >
              <iframe
                key={previewKey}
                src="/bento"
                className="w-full h-full border-0"
                title="Bento Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  BentoData,
  BentoSection,
  BentoLink,
  CardType,
  SocialPlatform,
  YouTubeSectionData,
  YouTubeVideoData,
} from "@/lib/bento-types";
import initialBentoData from "@/data/bento-links.json";
import { BentoPreview } from "@/components/bento/BentoPreview";

// Preview mode type
type PreviewMode = "pc" | "sp";

// Drag state type
interface DragState {
  type: "link" | "youtube";
  sectionId: string;
  itemIndex: number;
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
  { value: "lapras", label: "Lapras" },
];

// Access state type
type AccessState = "checking" | "allowed" | "denied";

// Editing state type
type EditingState =
  | { type: "link"; sectionId: string; linkIndex: number }
  | { type: "youtube"; sectionId: string; videoIndex: number }
  | null;

export default function BentoEditPage() {
  const [accessState, setAccessState] = useState<AccessState>("checking");
  const [data, setData] = useState<BentoData>(initialBentoData as BentoData);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("pc");
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverState, setDragOverState] = useState<DragState | null>(null);
  const [editingState, setEditingState] = useState<EditingState>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

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

  // Track changes
  useEffect(() => {
    const hasDataChanged =
      JSON.stringify(data) !== JSON.stringify(initialBentoData);
    setHasChanges(hasDataChanged);
  }, [data]);

  // Reset to file state
  const handleReset = useCallback(() => {
    setData(initialBentoData as BentoData);
    setEditingState(null);
    setSaveMessage({ type: "success", text: "Reset to saved state" });
    setTimeout(() => setSaveMessage(null), 2000);
  }, []);

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
        setHasChanges(false);
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

  // Link drag handlers
  const handleDragStart = useCallback(
    (type: "link" | "youtube", sectionId: string, itemIndex: number) => {
      setDragState({ type, sectionId, itemIndex });
    },
    []
  );

  const handleDragOver = useCallback(
    (
      e: React.DragEvent,
      type: "link" | "youtube",
      sectionId: string,
      itemIndex: number
    ) => {
      e.preventDefault();
      setDragOverState({ type, sectionId, itemIndex });
    },
    []
  );

  const handleDragEnd = useCallback(() => {
    if (dragState && dragOverState && dragState.type === dragOverState.type) {
      const { type, sectionId: fromSectionId, itemIndex: fromIndex } = dragState;
      const { sectionId: toSectionId, itemIndex: toIndex } = dragOverState;

      if (type === "link") {
        if (fromSectionId === toSectionId) {
          // Same section - reorder
          if (fromIndex !== toIndex) {
            setData((prev) => {
              const newSections = prev.sections.map((section) => {
                if (section.id === fromSectionId) {
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
        } else {
          // Different section - move item
          setData((prev) => {
            let movedItem: BentoLink | null = null;
            const newSections = prev.sections.map((section) => {
              if (section.id === fromSectionId) {
                const newLinks = [...section.links];
                [movedItem] = newLinks.splice(fromIndex, 1);
                return { ...section, links: newLinks };
              }
              return section;
            });

            if (movedItem) {
              return {
                ...prev,
                sections: newSections.map((section) => {
                  if (section.id === toSectionId) {
                    const newLinks = [...section.links];
                    newLinks.splice(toIndex, 0, movedItem!);
                    return { ...section, links: newLinks };
                  }
                  return section;
                }),
              };
            }
            return { ...prev, sections: newSections };
          });
          setEditingState(null);
        }
      } else if (type === "youtube") {
        if (fromSectionId === toSectionId) {
          // Same section - reorder
          if (fromIndex !== toIndex) {
            setData((prev) => {
              const newYoutubeSections = (prev.youtubeSections || []).map(
                (section) => {
                  if (section.id === fromSectionId) {
                    const newVideos = [...section.videos];
                    const [movedItem] = newVideos.splice(fromIndex, 1);
                    newVideos.splice(toIndex, 0, movedItem);
                    return { ...section, videos: newVideos };
                  }
                  return section;
                }
              );
              return { ...prev, youtubeSections: newYoutubeSections };
            });
          }
        } else {
          // Different section - move item
          setData((prev) => {
            let movedItem: YouTubeVideoData | null = null;
            const newYoutubeSections = (prev.youtubeSections || []).map(
              (section) => {
                if (section.id === fromSectionId) {
                  const newVideos = [...section.videos];
                  [movedItem] = newVideos.splice(fromIndex, 1);
                  return { ...section, videos: newVideos };
                }
                return section;
              }
            );

            if (movedItem) {
              return {
                ...prev,
                youtubeSections: newYoutubeSections.map((section) => {
                  if (section.id === toSectionId) {
                    const newVideos = [...section.videos];
                    newVideos.splice(toIndex, 0, movedItem!);
                    return { ...section, videos: newVideos };
                  }
                  return section;
                }),
              };
            }
            return { ...prev, youtubeSections: newYoutubeSections };
          });
          setEditingState(null);
        }
      }
    }
    setDragState(null);
    setDragOverState(null);
  }, [dragState, dragOverState]);

  // Update link
  const updateLink = useCallback(
    (sectionId: string, linkIndex: number, updates: Partial<BentoLink>) => {
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
    },
    []
  );

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
    setEditingState(null);
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

  // YouTube section management
  const updateYouTubeSectionTitle = useCallback(
    (sectionId: string, title: string) => {
      setData((prev) => ({
        ...prev,
        youtubeSections: (prev.youtubeSections || []).map((section) => {
          if (section.id === sectionId) {
            return { ...section, title };
          }
          return section;
        }),
      }));
    },
    []
  );

  const addYouTubeSection = useCallback(() => {
    const newSection: YouTubeSectionData = {
      id: `youtube-${Date.now()}`,
      title: "New YouTube Section",
      videos: [],
    };
    setData((prev) => ({
      ...prev,
      youtubeSections: [...(prev.youtubeSections || []), newSection],
    }));
  }, []);

  const deleteYouTubeSection = useCallback((sectionId: string) => {
    setData((prev) => ({
      ...prev,
      youtubeSections: (prev.youtubeSections || []).filter(
        (section) => section.id !== sectionId
      ),
    }));
  }, []);

  const addYouTubeVideo = useCallback((sectionId: string) => {
    const newVideo: YouTubeVideoData = {
      url: "https://www.youtube.com/watch?v=",
      title: "New Video",
      videoId: "",
    };
    setData((prev) => ({
      ...prev,
      youtubeSections: (prev.youtubeSections || []).map((section) => {
        if (section.id === sectionId) {
          return { ...section, videos: [...section.videos, newVideo] };
        }
        return section;
      }),
    }));
  }, []);

  const updateYouTubeVideo = useCallback(
    (
      sectionId: string,
      videoIndex: number,
      updates: Partial<YouTubeVideoData>
    ) => {
      setData((prev) => ({
        ...prev,
        youtubeSections: (prev.youtubeSections || []).map((section) => {
          if (section.id === sectionId) {
            const newVideos = [...section.videos];
            newVideos[videoIndex] = { ...newVideos[videoIndex], ...updates };

            // Auto-extract videoId from URL
            if (updates.url) {
              const match = updates.url.match(
                /(?:youtube\.com\/(?:watch\?.*v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
              );
              if (match) {
                newVideos[videoIndex].videoId = match[1];
              }
            }

            return { ...section, videos: newVideos };
          }
          return section;
        }),
      }));
    },
    []
  );

  const deleteYouTubeVideo = useCallback(
    (sectionId: string, videoIndex: number) => {
      setData((prev) => ({
        ...prev,
        youtubeSections: (prev.youtubeSections || []).map((section) => {
          if (section.id === sectionId) {
            const newVideos = section.videos.filter((_, i) => i !== videoIndex);
            return { ...section, videos: newVideos };
          }
          return section;
        }),
      }));
      setEditingState(null);
    },
    []
  );

  // Move link to another section
  const moveLinkToSection = useCallback(
    (
      fromSectionId: string,
      linkIndex: number,
      toSectionId: string
    ) => {
      setData((prev) => {
        let movedItem: BentoLink | null = null;
        const newSections = prev.sections.map((section) => {
          if (section.id === fromSectionId) {
            const newLinks = [...section.links];
            [movedItem] = newLinks.splice(linkIndex, 1);
            return { ...section, links: newLinks };
          }
          return section;
        });

        if (movedItem) {
          return {
            ...prev,
            sections: newSections.map((section) => {
              if (section.id === toSectionId) {
                return { ...section, links: [...section.links, movedItem!] };
              }
              return section;
            }),
          };
        }
        return { ...prev, sections: newSections };
      });
      setEditingState(null);
    },
    []
  );

  // Move YouTube video to another section
  const moveYouTubeToSection = useCallback(
    (
      fromSectionId: string,
      videoIndex: number,
      toSectionId: string
    ) => {
      setData((prev) => {
        let movedItem: YouTubeVideoData | null = null;
        const newYoutubeSections = (prev.youtubeSections || []).map(
          (section) => {
            if (section.id === fromSectionId) {
              const newVideos = [...section.videos];
              [movedItem] = newVideos.splice(videoIndex, 1);
              return { ...section, videos: newVideos };
            }
            return section;
          }
        );

        if (movedItem) {
          return {
            ...prev,
            youtubeSections: newYoutubeSections.map((section) => {
              if (section.id === toSectionId) {
                return { ...section, videos: [...section.videos, movedItem!] };
              }
              return section;
            }),
          };
        }
        return { ...prev, youtubeSections: newYoutubeSections };
      });
      setEditingState(null);
    },
    []
  );

  // Get editing data
  const getEditingLinkData = (): BentoLink | null => {
    if (editingState?.type === "link") {
      return (
        data.sections.find((s) => s.id === editingState.sectionId)?.links[
          editingState.linkIndex
        ] || null
      );
    }
    return null;
  };

  const getEditingYouTubeData = (): YouTubeVideoData | null => {
    if (editingState?.type === "youtube") {
      return (
        data.youtubeSections?.find((s) => s.id === editingState.sectionId)
          ?.videos[editingState.videoIndex] || null
      );
    }
    return null;
  };

  const editingLinkData = getEditingLinkData();
  const editingYouTubeData = getEditingYouTubeData();

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
      {/* Header */}
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
            {/* Reset button */}
            <button
              onClick={handleReset}
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
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save to File"}
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
          {/* Regular Sections */}
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Sections</h2>
          {data.sections.map((section) => (
            <div
              key={section.id}
              className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 p-3 bg-gray-50 border-b">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateSectionTitle(section.id, e.target.value)
                  }
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
                    onDragStart={() =>
                      handleDragStart("link", section.id, index)
                    }
                    onDragOver={(e) =>
                      handleDragOver(e, "link", section.id, index)
                    }
                    onDragEnd={handleDragEnd}
                    onClick={() =>
                      setEditingState({
                        type: "link",
                        sectionId: section.id,
                        linkIndex: index,
                      })
                    }
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                      dragOverState?.type === "link" &&
                      dragOverState?.sectionId === section.id &&
                      dragOverState?.itemIndex === index
                        ? "bg-blue-100 border-2 border-blue-400"
                        : editingState?.type === "link" &&
                          editingState?.sectionId === section.id &&
                          editingState?.linkIndex === index
                        ? "bg-blue-50 border border-blue-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Drag handle */}
                    <span className="text-gray-400 cursor-grab active:cursor-grabbing select-none">
                      &#x2630;
                    </span>
                    {/* Card type badge */}
                    <span
                      className={`px-1.5 py-0.5 text-xs rounded ${
                        link.cardType === "social"
                          ? "bg-purple-100 text-purple-700"
                          : link.cardType === "ogp"
                          ? "bg-orange-100 text-orange-700"
                          : link.cardType === "image"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {link.cardType}
                    </span>
                    {/* Title */}
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {link.title}
                    </span>
                  </div>
                ))}
                {section.links.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No links in this section
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Add section button */}
          <button
            onClick={addSection}
            className="w-full py-3 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-600 transition mb-6"
          >
            + Add Section
          </button>

          {/* YouTube Sections */}
          <h2 className="text-sm font-semibold text-gray-600 mb-2 mt-6">
            YouTube Sections
          </h2>
          {(data.youtubeSections || []).map((section) => (
            <div
              key={section.id}
              className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden border-l-4 border-red-500"
            >
              {/* Section header */}
              <div className="flex items-center gap-2 p-3 bg-red-50 border-b">
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) =>
                    updateYouTubeSectionTitle(section.id, e.target.value)
                  }
                  placeholder="YouTube Section Title"
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400"
                />
                <button
                  onClick={() => addYouTubeVideo(section.id)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  + Video
                </button>
                <button
                  onClick={() => deleteYouTubeSection(section.id)}
                  className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>

              {/* Videos */}
              <div className="p-2">
                {section.videos.map((video, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() =>
                      handleDragStart("youtube", section.id, index)
                    }
                    onDragOver={(e) =>
                      handleDragOver(e, "youtube", section.id, index)
                    }
                    onDragEnd={handleDragEnd}
                    onClick={() =>
                      setEditingState({
                        type: "youtube",
                        sectionId: section.id,
                        videoIndex: index,
                      })
                    }
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                      dragOverState?.type === "youtube" &&
                      dragOverState?.sectionId === section.id &&
                      dragOverState?.itemIndex === index
                        ? "bg-red-100 border-2 border-red-400"
                        : editingState?.type === "youtube" &&
                          editingState?.sectionId === section.id &&
                          editingState?.videoIndex === index
                        ? "bg-red-50 border border-red-300"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    {/* Drag handle */}
                    <span className="text-gray-400 cursor-grab active:cursor-grabbing select-none">
                      &#x2630;
                    </span>
                    {/* YouTube badge */}
                    <span className="px-1.5 py-0.5 text-xs rounded bg-red-100 text-red-700">
                      YT
                    </span>
                    {/* Title */}
                    <span className="flex-1 text-sm text-gray-700 truncate">
                      {video.title}
                    </span>
                  </div>
                ))}
                {section.videos.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    No videos in this section
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Add YouTube section button */}
          <button
            onClick={addYouTubeSection}
            className="w-full py-3 text-sm text-red-500 border-2 border-dashed border-red-300 rounded-lg hover:border-red-400 hover:text-red-600 transition"
          >
            + Add YouTube Section
          </button>
        </div>

        {/* Right Panel - Preview + Edit Form */}
        <div className="w-1/2 h-[calc(100vh-57px)] border-l border-gray-200 flex flex-col">
          {/* Edit Form (when link is selected) */}
          {editingState?.type === "link" && editingLinkData && (
            <div className="p-4 bg-white border-b border-gray-200 overflow-y-auto max-h-[50%]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Edit Link</h3>
                <button
                  onClick={() => setEditingState(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingLinkData.title}
                    onChange={(e) =>
                      updateLink(editingState.sectionId, editingState.linkIndex, {
                        title: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                </div>
                {/* URL */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">URL</label>
                  <input
                    type="url"
                    value={editingLinkData.url}
                    onChange={(e) =>
                      updateLink(editingState.sectionId, editingState.linkIndex, {
                        url: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  />
                </div>
                {/* Card Type */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Card Type
                  </label>
                  <select
                    value={editingLinkData.cardType}
                    onChange={(e) =>
                      updateLink(editingState.sectionId, editingState.linkIndex, {
                        cardType: e.target.value as CardType,
                      })
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  >
                    {cardTypeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Platform (for social) */}
                {editingLinkData.cardType === "social" && (
                  <>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Platform
                      </label>
                      <select
                        value={editingLinkData.platform || ""}
                        onChange={(e) =>
                          updateLink(
                            editingState.sectionId,
                            editingState.linkIndex,
                            {
                              platform: e.target.value as SocialPlatform,
                            }
                          )
                        }
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      >
                        <option value="">Select platform</option>
                        {platformOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editingLinkData.username || ""}
                        onChange={(e) =>
                          updateLink(
                            editingState.sectionId,
                            editingState.linkIndex,
                            {
                              username: e.target.value || undefined,
                            }
                          )
                        }
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
                      <label className="block text-xs text-gray-500 mb-1">
                        Image Source
                      </label>
                      <input
                        type="text"
                        value={editingLinkData.imageSrc || ""}
                        onChange={(e) =>
                          updateLink(
                            editingState.sectionId,
                            editingState.linkIndex,
                            {
                              imageSrc: e.target.value || undefined,
                            }
                          )
                        }
                        placeholder="/bento/image.jpg"
                        className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Span
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="4"
                          value={editingLinkData.span || 1}
                          onChange={(e) =>
                            updateLink(
                              editingState.sectionId,
                              editingState.linkIndex,
                              {
                                span: parseInt(e.target.value) || 1,
                              }
                            )
                          }
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">
                          Aspect Ratio
                        </label>
                        <input
                          type="text"
                          value={editingLinkData.aspectRatio || ""}
                          onChange={(e) =>
                            updateLink(
                              editingState.sectionId,
                              editingState.linkIndex,
                              {
                                aspectRatio: e.target.value || undefined,
                              }
                            )
                          }
                          placeholder="16/9"
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Move to section */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Move to Section
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) {
                        moveLinkToSection(
                          editingState.sectionId,
                          editingState.linkIndex,
                          e.target.value
                        );
                      }
                    }}
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-blue-400"
                  >
                    <option value="">Select section to move</option>
                    {data.sections
                      .filter((s) => s.id !== editingState.sectionId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title || `(${s.id})`}
                        </option>
                      ))}
                  </select>
                </div>
                {/* Delete button */}
                <button
                  onClick={() =>
                    deleteLink(editingState.sectionId, editingState.linkIndex)
                  }
                  className="w-full py-1.5 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                >
                  Delete Link
                </button>
              </div>
            </div>
          )}

          {/* Edit Form for YouTube */}
          {editingState?.type === "youtube" && editingYouTubeData && (
            <div className="p-4 bg-white border-b border-gray-200 overflow-y-auto max-h-[50%]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Edit YouTube Video</h3>
                <button
                  onClick={() => setEditingState(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  Close
                </button>
              </div>
              <div className="space-y-3">
                {/* Title */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editingYouTubeData.title}
                    onChange={(e) =>
                      updateYouTubeVideo(
                        editingState.sectionId,
                        editingState.videoIndex,
                        { title: e.target.value }
                      )
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400"
                  />
                </div>
                {/* URL */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={editingYouTubeData.url}
                    onChange={(e) =>
                      updateYouTubeVideo(
                        editingState.sectionId,
                        editingState.videoIndex,
                        { url: e.target.value }
                      )
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400"
                  />
                </div>
                {/* Video ID (auto-extracted) */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    Video ID (auto-extracted)
                  </label>
                  <input
                    type="text"
                    value={editingYouTubeData.videoId}
                    onChange={(e) =>
                      updateYouTubeVideo(
                        editingState.sectionId,
                        editingState.videoIndex,
                        { videoId: e.target.value }
                      )
                    }
                    className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400 bg-gray-50"
                  />
                </div>
                {/* Preview */}
                {editingYouTubeData.videoId && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Preview
                    </label>
                    <div className="aspect-video bg-gray-900 rounded overflow-hidden">
                      <iframe
                        src={`https://www.youtube.com/embed/${editingYouTubeData.videoId}`}
                        title={editingYouTubeData.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
                {/* Move to section */}
                {(data.youtubeSections?.length || 0) > 1 && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      Move to Section
                    </label>
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          moveYouTubeToSection(
                            editingState.sectionId,
                            editingState.videoIndex,
                            e.target.value
                          );
                        }
                      }}
                      className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400"
                    >
                      <option value="">Select section to move</option>
                      {(data.youtubeSections || [])
                        .filter((s) => s.id !== editingState.sectionId)
                        .map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title || `(${s.id})`}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
                {/* Delete button */}
                <button
                  onClick={() =>
                    deleteYouTubeVideo(
                      editingState.sectionId,
                      editingState.videoIndex
                    )
                  }
                  className="w-full py-1.5 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
                >
                  Delete Video
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
              style={{
                height: previewMode === "sp" ? "667px" : "calc(100% - 16px)",
              }}
            >
              {previewMode === "sp" ? (
                // SP mode: Use iframe for accurate mobile viewport simulation
                <iframe
                  src="/bento"
                  className="w-full h-full border-0"
                  title="Bento Preview (Mobile)"
                />
              ) : (
                // PC mode: Use BentoPreview for instant updates
                <div className="w-full h-full overflow-y-auto">
                  <BentoPreview data={data} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useCallback, useState } from "react";
import type {
  BentoData,
  BentoLink,
  BentoSection,
  YouTubeSectionData,
  YouTubeVideoData,
} from "@/lib/bento-types";
import {
  moveLink,
  moveYouTubeVideo,
  newLink,
  newYouTubeVideo,
  updateYouTubeVideoFields,
} from "@/lib/bento-editor";
import type { DragState, EditingState, ItemKind } from "./types";

function mapSection<S extends { id: string }>(
  sections: S[],
  sectionId: string,
  update: (section: S) => S,
): S[] {
  return sections.map((section) =>
    section.id === sectionId ? update(section) : section,
  );
}

// Holds the edited data, the selected item and the drag in progress
export function useBentoEditor(initialData: BentoData) {
  const [data, setData] = useState<BentoData>(initialData);
  const [editingState, setEditingState] = useState<EditingState>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dragOverState, setDragOverState] = useState<DragState | null>(null);

  const updateSections = useCallback(
    (sectionId: string, update: (section: BentoSection) => BentoSection) => {
      setData((prev) => ({
        ...prev,
        sections: mapSection(prev.sections, sectionId, update),
      }));
    },
    [],
  );

  const updateYouTubeSections = useCallback(
    (
      sectionId: string,
      update: (section: YouTubeSectionData) => YouTubeSectionData,
    ) => {
      setData((prev) => ({
        ...prev,
        youtubeSections: mapSection(
          prev.youtubeSections || [],
          sectionId,
          update,
        ),
      }));
    },
    [],
  );

  const reset = useCallback(() => {
    setData(initialData);
    setEditingState(null);
  }, [initialData]);

  const handleDragStart = useCallback(
    (type: ItemKind, sectionId: string, itemIndex: number) => {
      setDragState({ type, sectionId, itemIndex });
    },
    [],
  );

  const handleDragOver = useCallback(
    (
      e: React.DragEvent,
      type: ItemKind,
      sectionId: string,
      itemIndex: number,
    ) => {
      e.preventDefault();
      setDragOverState({ type, sectionId, itemIndex });
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    if (dragState && dragOverState && dragState.type === dragOverState.type) {
      const from = {
        sectionId: dragState.sectionId,
        index: dragState.itemIndex,
      };
      const to = {
        sectionId: dragOverState.sectionId,
        index: dragOverState.itemIndex,
      };
      const move = dragState.type === "link" ? moveLink : moveYouTubeVideo;
      setData((prev) => move(prev, from, to));
      // The selection points at the old position once the item changes section
      if (from.sectionId !== to.sectionId) setEditingState(null);
    }
    setDragState(null);
    setDragOverState(null);
  }, [dragState, dragOverState]);

  const updateLink = useCallback(
    (sectionId: string, linkIndex: number, updates: Partial<BentoLink>) => {
      updateSections(sectionId, (section) => ({
        ...section,
        links: section.links.map((link, i) =>
          i === linkIndex ? { ...link, ...updates } : link,
        ),
      }));
    },
    [updateSections],
  );

  const deleteLink = useCallback(
    (sectionId: string, linkIndex: number) => {
      updateSections(sectionId, (section) => ({
        ...section,
        links: section.links.filter((_, i) => i !== linkIndex),
      }));
      setEditingState(null);
    },
    [updateSections],
  );

  const addLink = useCallback(
    (sectionId: string) => {
      updateSections(sectionId, (section) => ({
        ...section,
        links: [...section.links, newLink()],
      }));
    },
    [updateSections],
  );

  const moveLinkToSection = useCallback(
    (fromSectionId: string, linkIndex: number, toSectionId: string) => {
      setData((prev) =>
        moveLink(
          prev,
          { sectionId: fromSectionId, index: linkIndex },
          { sectionId: toSectionId },
        ),
      );
      setEditingState(null);
    },
    [],
  );

  const updateSectionTitle = useCallback(
    (sectionId: string, title: string) => {
      updateSections(sectionId, (section) => ({ ...section, title }));
    },
    [updateSections],
  );

  const addSection = useCallback(() => {
    const section: BentoSection = {
      id: `section-${Date.now()}`,
      title: "New Section",
      links: [],
    };
    setData((prev) => ({ ...prev, sections: [...prev.sections, section] }));
  }, []);

  const deleteSection = useCallback((sectionId: string) => {
    setData((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== sectionId),
    }));
  }, []);

  const updateYouTubeSectionTitle = useCallback(
    (sectionId: string, title: string) => {
      updateYouTubeSections(sectionId, (section) => ({ ...section, title }));
    },
    [updateYouTubeSections],
  );

  const addYouTubeSection = useCallback(() => {
    const section: YouTubeSectionData = {
      id: `youtube-${Date.now()}`,
      title: "New YouTube Section",
      videos: [],
    };
    setData((prev) => ({
      ...prev,
      youtubeSections: [...(prev.youtubeSections || []), section],
    }));
  }, []);

  const deleteYouTubeSection = useCallback((sectionId: string) => {
    setData((prev) => ({
      ...prev,
      youtubeSections: (prev.youtubeSections || []).filter(
        (section) => section.id !== sectionId,
      ),
    }));
  }, []);

  const addYouTubeVideo = useCallback(
    (sectionId: string) => {
      updateYouTubeSections(sectionId, (section) => ({
        ...section,
        videos: [...section.videos, newYouTubeVideo()],
      }));
    },
    [updateYouTubeSections],
  );

  const updateYouTubeVideo = useCallback(
    (
      sectionId: string,
      videoIndex: number,
      updates: Partial<YouTubeVideoData>,
    ) => {
      updateYouTubeSections(sectionId, (section) => ({
        ...section,
        videos: section.videos.map((video, i) =>
          i === videoIndex ? updateYouTubeVideoFields(video, updates) : video,
        ),
      }));
    },
    [updateYouTubeSections],
  );

  const deleteYouTubeVideo = useCallback(
    (sectionId: string, videoIndex: number) => {
      updateYouTubeSections(sectionId, (section) => ({
        ...section,
        videos: section.videos.filter((_, i) => i !== videoIndex),
      }));
      setEditingState(null);
    },
    [updateYouTubeSections],
  );

  const moveYouTubeToSection = useCallback(
    (fromSectionId: string, videoIndex: number, toSectionId: string) => {
      setData((prev) =>
        moveYouTubeVideo(
          prev,
          { sectionId: fromSectionId, index: videoIndex },
          { sectionId: toSectionId },
        ),
      );
      setEditingState(null);
    },
    [],
  );

  return {
    data,
    editingState,
    setEditingState,
    dragOverState,
    reset,
    drag: { handleDragStart, handleDragOver, handleDragEnd },
    links: { updateLink, deleteLink, addLink, moveLinkToSection },
    sections: { updateSectionTitle, addSection, deleteSection },
    youtube: {
      updateYouTubeSectionTitle,
      addYouTubeSection,
      deleteYouTubeSection,
      addYouTubeVideo,
      updateYouTubeVideo,
      deleteYouTubeVideo,
      moveYouTubeToSection,
    },
  };
}

export type BentoEditor = ReturnType<typeof useBentoEditor>;

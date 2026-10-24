import type { BentoEditor } from "./useBentoEditor";

export function YouTubeSectionsPanel({ editor }: { editor: BentoEditor }) {
  const { data, editingState, setEditingState, dragOverState } = editor;
  const { handleDragStart, handleDragOver, handleDragEnd } = editor.drag;
  const {
    updateYouTubeSectionTitle,
    addYouTubeSection,
    deleteYouTubeSection,
    addYouTubeVideo,
  } = editor.youtube;

  return (
    <>
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
    </>
  );
}

import type { BentoEditor } from "./useBentoEditor";

export function YouTubeEditForm({ editor }: { editor: BentoEditor }) {
  const { data, editingState, setEditingState } = editor;
  const { updateYouTubeVideo, deleteYouTubeVideo, moveYouTubeToSection } =
    editor.youtube;
  if (editingState?.type !== "youtube") return null;
  const editingYouTubeData =
    data.youtubeSections?.find((s) => s.id === editingState.sectionId)?.videos[
      editingState.videoIndex
    ] || null;
  if (!editingYouTubeData) return null;

  return (
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
          <label className="block text-xs text-gray-500 mb-1">Title</label>
          <input
            type="text"
            value={editingYouTubeData.title}
            onChange={(e) =>
              updateYouTubeVideo(
                editingState.sectionId,
                editingState.videoIndex,
                { title: e.target.value },
              )
            }
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400"
          />
        </div>
        {/* URL */}
        <div>
          <label className="block text-xs text-gray-500 mb-1">URL</label>
          <input
            type="url"
            value={editingYouTubeData.url}
            onChange={(e) =>
              updateYouTubeVideo(
                editingState.sectionId,
                editingState.videoIndex,
                { url: e.target.value },
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
                { videoId: e.target.value },
              )
            }
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:border-red-400 bg-gray-50"
          />
        </div>
        {/* Preview */}
        {editingYouTubeData.videoId && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">Preview</label>
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
                    e.target.value,
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
            deleteYouTubeVideo(editingState.sectionId, editingState.videoIndex)
          }
          className="w-full py-1.5 text-sm text-red-600 bg-red-50 rounded hover:bg-red-100 transition"
        >
          Delete Video
        </button>
      </div>
    </div>
  );
}

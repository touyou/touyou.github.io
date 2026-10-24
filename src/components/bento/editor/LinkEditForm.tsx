import type { BentoEditor } from "./useBentoEditor";
import type { CardType, SocialPlatform } from "@/lib/bento-types";
import { cardTypeOptions, platformOptions } from "./types";

export function LinkEditForm({ editor }: { editor: BentoEditor }) {
  const { data, editingState, setEditingState } = editor;
  const { updateLink, deleteLink, moveLinkToSection } = editor.links;
  if (editingState?.type !== "link") return null;
  const editingLinkData =
    data.sections.find((s) => s.id === editingState.sectionId)?.links[
      editingState.linkIndex
    ] || null;
  if (!editingLinkData) return null;

  return (
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
          <label className="block text-xs text-gray-500 mb-1">Title</label>
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
          <label className="block text-xs text-gray-500 mb-1">Card Type</label>
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
                  updateLink(editingState.sectionId, editingState.linkIndex, {
                    platform: e.target.value as SocialPlatform,
                  })
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
                  updateLink(editingState.sectionId, editingState.linkIndex, {
                    username: e.target.value || undefined,
                  })
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
                  updateLink(editingState.sectionId, editingState.linkIndex, {
                    imageSrc: e.target.value || undefined,
                  })
                }
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
                  onChange={(e) =>
                    updateLink(editingState.sectionId, editingState.linkIndex, {
                      span: parseInt(e.target.value) || 1,
                    })
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
                    updateLink(editingState.sectionId, editingState.linkIndex, {
                      aspectRatio: e.target.value || undefined,
                    })
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
                  e.target.value,
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
  );
}

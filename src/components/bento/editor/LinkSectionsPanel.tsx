"use client";

import type { BentoEditor } from "./useBentoEditor";

export function LinkSectionsPanel({ editor }: { editor: BentoEditor }) {
  const { data, editingState, setEditingState, dragOverState } = editor;
  const { handleDragStart, handleDragOver, handleDragEnd } = editor.drag;
  const { addLink } = editor.links;
  const { updateSectionTitle, addSection, deleteSection } = editor.sections;

  return (
    <>
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
                onDragStart={() => handleDragStart("link", section.id, index)}
                onDragOver={(e) => handleDragOver(e, "link", section.id, index)}
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
    </>
  );
}

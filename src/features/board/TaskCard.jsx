import React, { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { formatRelativeTime } from "../../utils/dateUtils.js";
import { PRIORITY_COLORS, STATUS_COLORS } from "../../utils/constants.js";
import TaskPanel from "../tasks/TaskPanel.jsx";

const TaskCard = ({ task, index }) => {
  const [openPanel, setOpenPanel] = useState(false);

  const getPriorityColor = (priority) =>
    PRIORITY_COLORS[priority] || PRIORITY_COLORS.MEDIUM;

  const getStatusColor = (status) =>
    STATUS_COLORS[status] || STATUS_COLORS.BACKLOG;

  const handleClick = (e) => {
    // prevent opening panel while dragging
    if (e.defaultPrevented) return;
    setOpenPanel(true);
  };

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps} // ✅ FULL CARD DRAG
            onClick={handleClick}
            className={`bg-white rounded-lg p-4 border-2 transition-all duration-200 cursor-pointer ${
              snapshot.isDragging
                ? "scale-105 shadow-2xl border-blue-300 bg-blue-50 rotate-1"
                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
            }`}
            style={{
              ...provided.draggableProps.style,
              minHeight: "120px",
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  getPriorityColor(task.priority).bg
                } ${getPriorityColor(task.priority).text}`}
              >
                {task.priority}
              </span>

              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  getStatusColor(task.status).bg
                } ${getStatusColor(task.status).text}`}
              >
                {task.status}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm mb-2 text-gray-900">
              {task.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {task.description || "No description"}
            </p>

            {/* Tags */}
            {task.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-between text-xs text-gray-400">
              <span>{task.assignee || "Unassigned"}</span>
              <span>{formatRelativeTime(task.updatedAt)}</span>
            </div>
          </div>
        )}
      </Draggable>

      {/* Panel */}
      {openPanel && (
        <TaskPanel
          task={task}
          onClose={() => setOpenPanel(false)}
        />
      )}
    </>
  );
};

export default React.memo(TaskCard);
import React, { useState } from "react";
import { useTaskContext } from "../../context/TaskContext.jsx";

const TaskPanel = ({ task, onClose }) => {
  const { updateTask, deleteTask } = useTaskContext();

  const [data, setData] = useState({
    title: task.title,
    description: task.description || "",
    status: task.status,
    priority: task.priority,
    assignee: task.assignee || "",
    tags: task.tags || [],
    comment: "",
  });

  const handleSave = () => {
    updateTask(task.id, {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      tags: data.tags,
      updatedAt: Date.now(),
    });

    onClose(); // ✅ close panel after save
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  return (
    <div className="fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 border-l flex flex-col">
      
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold text-lg">Task Details</h2>
        <button onClick={onClose} className="text-gray-500">✕</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Title */}
        <input
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
          className="w-full border p-2 rounded font-semibold"
        />

        {/* Description */}
        <textarea
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          className="w-full border p-2 rounded"
          rows={4}
        />

        {/* Status */}
        <select
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option>Backlog</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        {/* Priority */}
        <select
          value={data.priority}
          onChange={(e) => setData({ ...data, priority: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Assignee */}
        <input
          value={data.assignee}
          onChange={(e) => setData({ ...data, assignee: e.target.value })}
          className="w-full border p-2 rounded"
          placeholder="Assignee"
        />

        {/* Tags */}
        <input
          placeholder="Add tags (comma separated)"
          onBlur={(e) =>
            setData((prev) => ({
              ...prev,
              tags: e.target.value.split(",").map((t) => t.trim()),
            }))
          }
          value={data.tags.join(", ")}
          className="w-full border p-2 rounded"
        />

        {/* Comments */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Comments</h4>
          <textarea
            placeholder="Write a comment..."
            className="w-full border p-2 rounded"
            rows={3}
          />
        </div>

        {/* Activity (basic) */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Activity</h4>
          <p className="text-xs text-gray-500">
            Updated recently
          </p>
        </div>

      </div>

      {/* Footer */}
      <div className="p-4 border-t flex justify-between">
        <button
          onClick={handleDelete}
          className="text-red-600"
        >
          Delete
        </button>

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-1 rounded"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default TaskPanel;
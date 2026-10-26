import React, { useEffect, useRef, useState } from "react";
import { useTaskContext } from "../../context/TaskContext.jsx";

const TaskEditModal = ({ task, onClose }) => {
  const { updateTask } = useTaskContext();

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");

  const inputRef = useRef();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    if (!title.trim()) return;

    updateTask({
      ...task,
      title: title.trim(),
      description: description.trim(),
      updatedAt: Date.now(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-5">
        
        <h2 className="text-lg font-semibold mb-4">Edit Task</h2>

        {/* Title */}
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded mb-3"
          placeholder="Task title"
        />

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          rows={4}
          placeholder="Task description"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-3 py-1 rounded bg-blue-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;
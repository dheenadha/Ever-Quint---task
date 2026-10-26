import React, { useState } from "react";
import { useTaskContext } from "../../context/TaskContext.jsx";
import { TASK_STATUSES, TASK_PRIORITIES } from "../../utils/constants.js";
import Button from "../../components/ui/Button.jsx";
import TextInput from "../../components/ui/TextInput.jsx";
import Select from "../../components/ui/Select.jsx";
import Modal from "../../components/ui/Modal.jsx";

const QuickTaskCreator = () => {
  const { createTask } = useTaskContext();

  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: TASK_STATUSES.BACKLOG,
    priority: TASK_PRIORITIES.MEDIUM,
    assignee: "",
    tags: "",
  });

  const handleCreate = () => {
    if (!form.title.trim()) return;

    createTask({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      assignee: form.assignee.trim(),
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim())
        : [],
    });

    // reset
    setForm({
      title: "",
      description: "",
      status: TASK_STATUSES.BACKLOG,
      priority: TASK_PRIORITIES.MEDIUM,
      assignee: "",
      tags: "",
    });

    setIsOpen(false);
  };

  return (
    <>
      {/* Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create Task"
        size="md"
      >
        <div className="space-y-4">

          <TextInput
            label="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full border p-2 rounded"
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value })
              }
              options={Object.values(TASK_STATUSES).map((s) => ({
                value: s,
                label: s,
              }))}
            />

            <Select
              label="Priority"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
              options={Object.values(TASK_PRIORITIES).map((p) => ({
                value: p,
                label: p,
              }))}
            />
          </div>

          <TextInput
            label="Assignee"
            value={form.assignee}
            onChange={(e) =>
              setForm({ ...form, assignee: e.target.value })
            }
          />

          <TextInput
            label="Tags (comma separated)"
            value={form.tags}
            onChange={(e) =>
              setForm({ ...form, tags: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-3">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={!form.title.trim()}
            >
              Create
            </Button>
          </div>
        </div>
      </Modal>

      {/* Floating Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg"
        >
          +
        </Button>
      </div>
    </>
  );
};

export default QuickTaskCreator;
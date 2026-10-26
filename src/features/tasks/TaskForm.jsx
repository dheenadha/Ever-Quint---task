import React, { useState, useEffect } from 'react';
import { useTaskContext } from '../../context/TaskContext.jsx';
import { useDirtyState } from '../../hooks/useDirtyState.js';
import { TASK_STATUSES, TASK_PRIORITIES, VALIDATION_RULES } from '../../utils/constants.js';
import TextInput from '../../components/ui/TextInput.jsx';
import TextArea from '../../components/ui/TextArea.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';

/**
 * TaskForm component for creating and editing tasks
 * @param {Object} props - Component props
 * @param {Object|null} props.task - Task to edit (null for new task)
 * @param {Function} props.onSave - Save handler
 * @param {Function} props.onCancel - Cancel handler
 */
const TaskForm = ({ task = null, onSave, onCancel }) => {
  const { createTask, updateTask } = useTaskContext();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUSES.BACKLOG,
    priority: TASK_PRIORITIES.MEDIUM,
    assignee: '',
    tags: []
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Tag input state
  const [tagInput, setTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || TASK_STATUSES.BACKLOG,
        priority: task.priority || TASK_PRIORITIES.MEDIUM,
        assignee: task.assignee || '',
        tags: task.tags || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUSES.BACKLOG,
        priority: TASK_PRIORITIES.MEDIUM,
        assignee: '',
        tags: []
      });
    }
    setErrors({});
    setTagInput('');
  }, [task]);

  // Dirty state management
  const { isDirty, markFieldDirty, resetDirtyState } = useDirtyState(
    formData,
    async () => {
      await handleSave();
    },
    () => {
      handleCancel();
    }
  );

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    markFieldDirty(field, value);
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim();
    if (newTag.length > VALIDATION_RULES.tag.maxLength) {
      setErrors(prev => ({ ...prev, tags: `Tag cannot exceed ${VALIDATION_RULES.tag.maxLength} characters` }));
      return;
    }

    if (formData.tags.includes(newTag)) {
      setErrors(prev => ({ ...prev, tags: 'Tag already exists' }));
      return;
    }

    const newTags = [...formData.tags, newTag];
    handleFieldChange('tags', newTags);
    setTagInput('');
    setIsAddingTag(false);
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove) => {
    const newTags = formData.tags.filter(tag => tag !== tagToRemove);
    handleFieldChange('tags', newTags);
  };

  // Handle tag input key press
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Escape') {
      setIsAddingTag(false);
      setTagInput('');
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < VALIDATION_RULES.title.minLength) {
      newErrors.title = `Title must be at least ${VALIDATION_RULES.title.minLength} characters`;
    } else if (formData.title.length > VALIDATION_RULES.title.maxLength) {
      newErrors.title = `Title cannot exceed ${VALIDATION_RULES.title.maxLength} characters`;
    }

    // Description validation
    if (formData.description.length > VALIDATION_RULES.description.maxLength) {
      newErrors.description = `Description cannot exceed ${VALIDATION_RULES.description.maxLength} characters`;
    }

    // Assignee validation
    if (formData.assignee.length > VALIDATION_RULES.assignee.maxLength) {
      newErrors.assignee = `Assignee name cannot exceed ${VALIDATION_RULES.assignee.maxLength} characters`;
    }

    // Tags validation
    if (formData.tags.some(tag => tag.length > VALIDATION_RULES.tag.maxLength)) {
      newErrors.tags = `Each tag cannot exceed ${VALIDATION_RULES.tag.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const taskData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignee: formData.assignee.trim()
    };

    if (task) {
      // Update existing task
      const result = updateTask(task.id, taskData);
      if (result.success) {
        resetDirtyState(taskData);
        onSave();
      } else {
        setErrors(result.errors || {});
      }
    } else {
      // Create new task
      const result = createTask(taskData);
      if (result.success) {
        resetDirtyState(taskData);
        onSave();
      } else {
        setErrors(result.errors || {});
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        resetDirtyState();
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  // Status options for select
  const statusOptions = Object.values(TASK_STATUSES).map(status => ({
    value: status,
    label: status
  }));

  // Priority options for select
  const priorityOptions = Object.values(TASK_PRIORITIES).map(priority => ({
    value: priority,
    label: priority
  }));

  return (
    <div className="space-y-4">
      {/* Form header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {task ? 'Edit Task' : 'Create New Task'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Fill in the details below to {task ? 'update' : 'create'} the task
        </p>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="md:col-span-2">
          <TextInput
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            error={errors.title}
            placeholder="Enter task title"
            required
            maxLength={VALIDATION_RULES.title.maxLength}
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <TextArea
            label="Description"
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            error={errors.description}
            placeholder="Describe what needs to be done"
            rows={3}
            maxLength={VALIDATION_RULES.description.maxLength}
          />
        </div>

        {/* Status */}
        <div>
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            error={errors.status}
            options={statusOptions}
            required
          />
        </div>

        {/* Priority */}
        <div>
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleFieldChange('priority', e.target.value)}
            error={errors.priority}
            options={priorityOptions}
            required
          />
        </div>

        {/* Assignee */}
        <div className="md:col-span-2">
          <TextInput
            label="Assignee"
            value={formData.assignee}
            onChange={(e) => handleFieldChange('assignee', e.target.value)}
            error={errors.assignee}
            placeholder="Who is responsible for this task?"
            maxLength={VALIDATION_RULES.assignee.maxLength}
          />
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    aria-label={`Remove ${tag} tag`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            
            {isAddingTag ? (
              <div className="flex gap-2">
                <TextInput
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Enter tag and press Enter"
                  className="flex-1"
                />
                <Button
                  variant="secondary"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  Add
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setIsAddingTag(false);
                    setTagInput('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setIsAddingTag(true)}
                disabled={formData.tags.length >= 10}
              >
                + Add Tag
              </Button>
            )}
            {errors.tags && (
              <p className="text-sm text-red-600">{errors.tags}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          variant="secondary"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isDirty && Object.keys(errors).length > 0}
        >
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </div>
  );
};

export default TaskForm;